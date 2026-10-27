import { useEffect, useMemo } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet'
import { latLngBounds, type LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Park } from '../../types/park'
import { ParkPopup } from './ParkPopup'

const NYC_CENTER: LatLngTuple = [40.7128, -74.006]
const FALLBACK_ZOOM = 11
const MAX_FIT_ZOOM = 15

// Leaflet writes these as SVG attributes, which cannot read CSS variables; the
// className lets the Tailwind token win, and the hex (blue-700) is the fallback.
const MARKER_STYLE = {
  className: 'fill-primary stroke-white',
  color: '#ffffff',
  weight: 2,
  fillColor: '#1d4ed8',
  fillOpacity: 1,
}

type MappablePark = { park: Park; position: LatLngTuple }

type ParkMapProps = {
  parks: Park[]
  className?: string
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

function FitToParks({ positions }: { positions: LatLngTuple[] }) {
  const map = useMap()
  const key = positions.map(([lat, lng]) => `${lat},${lng}`).join('|')

  useEffect(() => {
    if (positions.length === 0) {
      map.setView(NYC_CENTER, FALLBACK_ZOOM)
    } else {
      map.fitBounds(latLngBounds(positions), { padding: [32, 32], maxZoom: MAX_FIT_ZOOM })
    }
    // Refit only when the set of coordinates changes, not on every new array identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, key])

  return null
}

export function ParkMap({ parks, className }: ParkMapProps) {
  const mappable = useMemo(() => toMappable(parks), [parks])
  const positions = useMemo(() => mappable.map((m) => m.position), [mappable])

  return (
    <div role="region" aria-label="Map of parks" className={className}>
      <MapContainer center={NYC_CENTER} zoom={FALLBACK_ZOOM} scrollWheelZoom className="h-full w-full">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FitToParks positions={positions} />
        {mappable.map(({ park, position }) => (
          <CircleMarker
            key={park.id ?? `${position[0]},${position[1]}`}
            center={position}
            radius={9}
            pathOptions={MARKER_STYLE}
          >
            <Popup>
              <ParkPopup park={park} />
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  )
}
