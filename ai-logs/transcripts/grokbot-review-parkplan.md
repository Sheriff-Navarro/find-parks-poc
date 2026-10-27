# AI review log: ParkMap.tsx cleanup

Exported unedited from my Grok Bot (Job Hunt Bean) chat, Oct 27, 2026 (ET). Covers the request to review `src/components/map/ParkMap.tsx` and suggest simplifications, and the follow-up asking for an agent prompt (later run in Cursor session `f3f53796-a14f-420f-bec6-7ab46430b659`).

## Nick

Review this file and tell me how it can be simplified without breaking the implementation

import { useEffect, useMemo, useRef } from 'react'
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

type MappablePark = { park: Park; position: LatLngTuple }

export type MapOverlayInset = { top?: number; left?: number }

type ParkMapProps = {
  parks: Park[]
  className?: string
  // Pixels of the map covered by floating UI, so an opened popup pans clear of it.
  overlayInset?: MapOverlayInset
}

function toMappable(parks: Park[]): MappablePark[] {
  const result: MappablePark[] = []
  for (const park of parks) {
    const lat = park.location?.lat ?? null
    const lng = park.location?.lng ?? null
    if (lat === null || lng === null) continue
    result.push({ park, position: [lat, lng] })
  }
  return result
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
  const icon = useMemo(() => divIcon({ className: MARKER_CLASS, html: '', iconSize: [MARKER_SIZE, MARKER_SIZE] }), [])

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
    // Leaflet reuses one container per popup, so listeners attach once on first open.
    const onPopupOpen = () => {
      const el = popupEl()
      el?.addEventListener('keydown', onPopupKeyDown)
      el?.addEventListener('focusout', onFocusOut)
    }

    iconEl.addEventListener('pointerdown', onPointerDown)
    iconEl.addEventListener('mousedown', onPointerDown)
    iconEl.addEventListener('click', onClick)
    iconEl.addEventListener('focus', onFocus)
    iconEl.addEventListener('focusout', onFocusOut)
    iconEl.addEventListener('keydown', onIconKeyDown)
    marker.on('popupopen', onPopupOpen)

    return () => {
      iconEl.removeEventListener('pointerdown', onPointerDown)
      iconEl.removeEventListener('mousedown', onPointerDown)
      iconEl.removeEventListener('click', onClick)
      iconEl.removeEventListener('focus', onFocus)
      iconEl.removeEventListener('focusout', onFocusOut)
      iconEl.removeEventListener('keydown', onIconKeyDown)
      marker.off('popupopen', onPopupOpen)
      const el = popupEl()
      el?.removeEventListener('keydown', onPopupKeyDown)
      el?.removeEventListener('focusout', onFocusOut)
    }
  }, [map, label])

  // autoPanOnFocus is off because the popup's autoPan already keeps the marker in view;
  // both together pan twice per focus.
  return (
    <Marker ref={markerRef} position={position} icon={icon} keyboard title={label} autoPanOnFocus={false}>
      <Popup autoPanPaddingTopLeft={popupPaddingTopLeft}>
        <ParkPopup park={park} />
      </Popup>
    </Marker>
  )
}

function ParkMarkers({ items, popupPaddingTopLeft }: { items: MappablePark[]; popupPaddingTopLeft: PointTuple }) {
  return items.map(({ park, position }) => (
    <ParkMarker
      key={park.id ?? `${position[0]},${position[1]}`}
      park={park}
      position={position}
      popupPaddingTopLeft={popupPaddingTopLeft}
    />
  ))
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
        <ParkMarkers key={orderKey} items={mappable} popupPaddingTopLeft={popupPaddingTopLeft} />
      </MapContainer>
    </div>
  )
}

## Assistant

The file is in good shape, and most of its complexity is the keyboard and focus handling, which you need for accessibility. Here are the changes that cut code without changing behavior, safest first.

**1. Remove all the listeners with one `AbortController`.** This is the biggest win. The cleanup block that mirrors every `addEventListener` goes away, and so does the separate popup cleanup.
```ts
const ac = new AbortController()
const opts = { signal: ac.signal }

iconEl.addEventListener('pointerdown', onPointerDown, opts)
iconEl.addEventListener('click', onClick, opts)
iconEl.addEventListener('focus', onFocus, opts)
iconEl.addEventListener('focusout', onFocusOut, opts)
iconEl.addEventListener('keydown', onIconKeyDown, opts)

const onPopupOpen = () => {
  const el = popupEl()
  el?.addEventListener('keydown', onPopupKeyDown, opts)
  el?.addEventListener('focusout', onFocusOut, opts)
}
marker.on('popupopen', onPopupOpen)

return () => {
  ac.abort()
  marker.off('popupopen', onPopupOpen)
}
```
The browser ignores a second `addEventListener` call with the same function, so reopening the popup still won't stack listeners, just like today.

**2. Drop the `mousedown` listener.** `pointerdown` fires before `mousedown` in every browser that supports pointer events, which covers all modern ones, so setting the flag twice does nothing. Keep `onClick`, though. It resets the flag when you click an icon that already has focus and no focus event fires.

**3. Move the icon to the top of the file.** `useMemo(..., [])` with no dependencies just gives you a constant. Leaflet's `divIcon` is only an options object, so every marker can share one.
```ts
const PARK_ICON = divIcon({ className: MARKER_CLASS, html: '', iconSize: [MARKER_SIZE, MARKER_SIZE] })
```

**4. Make `toMappable` shorter.**
```ts
const toMappable = (parks: Park[]): MappablePark[] =>
  parks.flatMap((park) => {
    const { lat, lng } = park.location ?? {}
    return lat == null || lng == null ? [] : [{ park, position: [lat, lng] as LatLngTuple }]
  })
```
Using `== null` catches both `null` and `undefined`, which is what `?? null` plus `=== null` was doing. A latitude of `0` still counts as valid.

**5. Replace `ParkMarkers` with a keyed Fragment.** That component only exists so it can take the `key` that forces a remount. A `<Fragment key={orderKey}>` remounts its children the same way:
```tsx
<Fragment key={orderKey}>
  {mappable.map(({ park, position }) => (
    <ParkMarker key={park.id ?? position.join(',')} park={park} position={position} popupPaddingTopLeft={popupPaddingTopLeft} />
  ))}
</Fragment>
```
This also lets you use the same `park.id ?? position.join(',')` key in both places. Right now you use two slightly different templates for it.

**6. Optional: build the refit key once.** `FitToParks` rebuilds the coordinate key from `positions` itself. You could compute `positionsKey` once in `ParkMap` and pass it down. That saves a few lines, but it's a style choice, so only do it if you want it.

**Don't simplify these.** Each one prevents a real bug:
- Remounting on `orderKey`, which keeps Tab order the same as list order.
- The coordinate key and the `eslint-disable` comment in `FitToParks`. Without them, the map refits on every render.
- `autoPanOnFocus={false}`. Without it, the map pans twice.
- `keyboard={false}` on the map, which stops the container from becoming a stray tab stop.
- The `pointerFocus` flag. Without it, clicking a marker would open its popup and then immediately close it.

Together, items 1, 2, 3 and 5 cut about 25 lines. Before you merge, tab through the markers once to check that the popup opens on focus, Tab and Shift+Tab move in and out of the popup, Escape closes it, and clicking an icon toggles its popup. Those are the paths most likely to break.

## Nick

Give me a simple prompt to give to agent to fix this.

## Assistant

Here's a prompt you can paste in as is:

```
Simplify ParkMap.tsx without changing any behavior:

1. In ParkMarker's effect, use one AbortController: pass { signal } to every addEventListener (icon and popup), and in cleanup call abort() plus marker.off('popupopen', onPopupOpen).
2. Remove the redundant 'mousedown' listener (pointerdown already covers it). Keep onClick.
3. Hoist the divIcon to a module-level constant PARK_ICON and drop the useMemo.
4. Rewrite toMappable with flatMap and `== null` checks.
5. Replace the ParkMarkers component with a <Fragment key={orderKey}> around the mapped markers, and use `park.id ?? position.join(',')` as the marker key.

Do NOT change: the orderKey remount, FitToParks' coordinate key and eslint-disable, autoPanOnFocus={false}, keyboard={false} on MapContainer, or the pointerFocus logic.

After the edits, run the type check, lint, and existing tests, and confirm they pass. Summarize what changed.
```
