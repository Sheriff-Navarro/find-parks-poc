import type { Park } from '../types/park'
import { getAmenity } from './amenities.ts'

function searchableText(park: Park): string[] {
  const fields: string[] = []
  if (park.name !== null) fields.push(park.name)
  const address = park.location?.address ?? null
  if (address !== null) fields.push(address)
  for (const slug of park.amenities ?? []) fields.push(getAmenity(slug).label)
  return fields
}

export function filterParks(parks: Park[], query: string | null): Park[] {
  const needle = (query ?? '').trim().toLowerCase()
  if (needle === '') return parks
  return parks.filter((park) =>
    searchableText(park).some((text) => text.toLowerCase().includes(needle)),
  )
}
