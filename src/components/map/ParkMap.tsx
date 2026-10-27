import { Fragment, useEffect, useMemo, useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import { divIcon, latLngBounds, type LatLngTuple, type Marker as LeafletMarker, type PointTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Park } from '../../types/park'
import { ParkPopup } from './ParkPopup'

const NYC_CENTER: LatLngTuple = [40.7128, -74.006]
const FALLBACK_ZOOM = 11
const MAX_FIT_ZOOM = 15
const MARKER_SIZE = 18
const POPUP_PADDING = 16
const FIT_PADDING = 32

const MARKER_CLASS =
  'park-marker rounded-full border-2 border-white bg-primary shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

// Shared by every marker; Leaflet creates a separate DOM element per marker from it.
const PARK_ICON = divIcon({ className: MARKER_CLASS, html: '', iconSize: [MARKER_SIZE, MARKER_SIZE] })

type MappablePark = { park: Park; position: LatLngTuple }

export type MapOverlayInset = { top?: number; left?: number }

type ParkMapProps = {
  parks: Park[]
  className?: string
  // Pixels of the map covered by floating UI, so an opened popup pans clear of it.
  overlayInset?: MapOverlayInset
}

// Keeps only parks with both coordinates; `== null` treats null and undefined as missing.
function toMappable(parks: Park[]): MappablePark[] {
  return parks.flatMap((park) => {
    const lat = park.location?.lat
    const lng = park.location?.lng
    return lat == null || lng == null ? [] : [{ park, position: [lat, lng] as LatLngTuple }]
  })
}

function FitToParks({
  positions,
  insetLeft,
  insetTop,
}: {
  positions: LatLngTuple[]
  insetLeft: number
  insetTop: number
}) {
  const map = useMap()
  const key = positions.map(([lat, lng]) => `${lat},${lng}`).join('|')

  useEffect(() => {
    if (positions.length === 0) {
      map.setView(NYC_CENTER, FALLBACK_ZOOM)
    } else {
      map.fitBounds(latLngBounds(positions), {
        paddingTopLeft: [insetLeft + FIT_PADDING, insetTop + FIT_PADDING],
        paddingBottomRight: [FIT_PADDING, FIT_PADDING],
        maxZoom: MAX_FIT_ZOOM,
      })
    }
    // Refit only when the set of coordinates changes, not on every new array identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key, insetLeft, insetTop])

  return null
}

type ParkMarkerProps = {
  park: Park
  position: LatLngTuple
  popupPaddingTopLeft: PointTuple
}

function ParkMarker({ park, position, popupPaddingTopLeft }: ParkMarkerProps) {
  const map = useMap()
  const markerRef = useRef<LeafletMarker>(null)
  const label = `${park.name ?? 'Unnamed park'}, show details`

  useEffect(() => {
    const marker = markerRef.current
    const iconEl = marker?.getElement()
    if (!marker || !iconEl) return

    iconEl.setAttribute('aria-label', label)

    const popupEl = () => marker.getPopup()?.getElement() ?? null
    const detailsLink = () => popupEl()?.querySelector<HTMLAnchorElement>('.leaflet-popup-content a') ?? null
    const isInside = (node: EventTarget | null) =>
      node instanceof Node && (iconEl.contains(node) || (popupEl()?.contains(node) ?? false))

    // Markers remount in list order, so DOM order in the marker pane is list order.
    const nextStop = (): HTMLElement | null => {
      const icons = Array.from(map.getPane('markerPane')?.querySelectorAll<HTMLElement>('.park-marker') ?? [])
      const next = icons[icons.indexOf(iconEl) + 1]
      return next ?? map.getContainer().querySelector<HTMLElement>('.leaflet-control-zoom-in')
    }

    // A click focuses the icon too; let Leaflet's click toggle handle that popup.
    let pointerFocus = false
    const onPointerDown = () => {
      pointerFocus = true
    }
    const onClick = () => {
      pointerFocus = false
    }
    const onFocus = () => {
      if (pointerFocus) {
        pointerFocus = false
        return
      }
      if (!marker.isPopupOpen()) marker.openPopup()
    }
    const onFocusOut = (event: FocusEvent) => {
      if (event.relatedTarget !== null && !isInside(event.relatedTarget)) marker.closePopup()
    }
    const onIconKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        marker.closePopup()
        return
      }
      const isForwardTab = event.key === 'Tab' && !event.shiftKey
      if (!isForwardTab && event.key !== 'Enter') return
      const link = marker.isPopupOpen() ? detailsLink() : null
      if (link) {
        event.preventDefault()
        link.focus()
      }
    }
    const onPopupKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        iconEl.focus()
        marker.closePopup()
        return
      }
      if (event.key !== 'Tab' || event.target !== detailsLink()) return
      const target = event.shiftKey ? iconEl : nextStop()
      if (target) {
        event.preventDefault()
        target.focus()
      }
    }
    // Aborting this signal removes every DOM listener below in one call.
    const controller = new AbortController()
    const { signal } = controller

    // Leaflet reuses one container per popup, so listeners attach once on first open.
    const onPopupOpen = () => {
      const el = popupEl()
      el?.addEventListener('keydown', onPopupKeyDown, { signal })
      el?.addEventListener('focusout', onFocusOut, { signal })
    }

    // pointerdown covers mouse, touch, and pen, so no separate mousedown listener is needed.
    iconEl.addEventListener('pointerdown', onPointerDown, { signal })
    iconEl.addEventListener('click', onClick, { signal })
    iconEl.addEventListener('focus', onFocus, { signal })
    iconEl.addEventListener('focusout', onFocusOut, { signal })
    iconEl.addEventListener('keydown', onIconKeyDown, { signal })
    marker.on('popupopen', onPopupOpen)

    return () => {
      controller.abort()
      // Leaflet events don't use AbortSignal, so this one is removed by hand.
      marker.off('popupopen', onPopupOpen)
    }
  }, [map, label])

  // autoPanOnFocus is off because the popup's autoPan already keeps the marker in view;
  // both together pan twice per focus.
  return (
    <Marker ref={markerRef} position={position} icon={PARK_ICON} keyboard title={label} autoPanOnFocus={false}>
      <Popup autoPanPaddingTopLeft={popupPaddingTopLeft}>
        <ParkPopup park={park} />
      </Popup>
    </Marker>
  )
}

export function ParkMap({ parks, className, overlayInset }: ParkMapProps) {
  const mappable = useMemo(() => toMappable(parks), [parks])
  const positions = useMemo(() => mappable.map((m) => m.position), [mappable])
  // Leaflet appends markers in mount order; remounting on any change keeps Tab order equal to list order.
  const orderKey = mappable.map(({ park, position }) => park.id ?? position.join(',')).join('|')
  const insetLeft = overlayInset?.left ?? 0
  const insetTop = overlayInset?.top ?? 0
  const popupPaddingTopLeft = useMemo<PointTuple>(
    () => [insetLeft + POPUP_PADDING, insetTop + POPUP_PADDING],
    [insetLeft, insetTop],
  )

  return (
    <div role="region" aria-label="Map of parks" className={className}>
      {/* keyboard={false} keeps Leaflet from making the container a tab stop. */}
      <MapContainer center={NYC_CENTER} zoom={FALLBACK_ZOOM} scrollWheelZoom keyboard={false} className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitToParks positions={positions} insetLeft={insetLeft} insetTop={insetTop} />
        {/* A new orderKey remounts all markers so they re-enter the DOM in list order. */}
        <Fragment key={orderKey}>
          {mappable.map(({ park, position }) => (
            <ParkMarker
              key={park.id ?? position.join(',')}
              park={park}
              position={position}
              popupPaddingTopLeft={popupPaddingTopLeft}
            />
          ))}
        </Fragment>
      </MapContainer>
    </div>
  )
}
