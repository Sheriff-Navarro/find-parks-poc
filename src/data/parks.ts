import type { Park, ParkLocation } from '../types/park'
import rawJson from './parks.json'

type UnknownRecord = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function toStringOrNull(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed === '' ? null : trimmed
}

function toNumberOrNull(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

function toStringArrayOrNull(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null
  const strings: string[] = []
  for (const item of value) {
    const str = toStringOrNull(item)
    if (str !== null) strings.push(str)
  }
  return strings
}

function toLocationOrNull(value: unknown): ParkLocation | null {
  if (!isRecord(value)) return null
  return {
    lat: toNumberOrNull(value.lat),
    lng: toNumberOrNull(value.lng),
    address: toStringOrNull(value.address),
  }
}

function toPark(value: unknown): Park {
  const entry = isRecord(value) ? value : {}
  return {
    id: toStringOrNull(entry.id),
    name: toStringOrNull(entry.name),
    description: toStringOrNull(entry.description),
    location: toLocationOrNull(entry.location),
    amenities: toStringArrayOrNull(entry.amenities),
    hours: toStringOrNull(entry.hours),
    images: toStringArrayOrNull(entry.images),
    acreage: toNumberOrNull(entry.acreage),
    rating: toNumberOrNull(entry.rating),
  }
}

function compareByName(a: Park, b: Park): number {
  if (a.name === null && b.name === null) return 0
  if (a.name === null) return 1
  if (b.name === null) return -1
  return a.name.localeCompare(b.name)
}

/**
 * Single entry point for park data. Accepts anything; every key of every
 * returned Park is present, with missing or wrongly typed values as null.
 * Entries without an id are dropped because they cannot have a /park/:id route.
 * Results are sorted by name, with null names last.
 */
export function normalizeParks(raw: unknown): Park[] {
  if (!Array.isArray(raw)) return []
  return raw
    .map(toPark)
    .filter((park) => park.id !== null)
    .sort(compareByName)
}

const PARKS: Park[] = normalizeParks(rawJson)

export function getParks(): Park[] {
  return PARKS
}

export function getParkById(id: string | null | undefined): Park | null {
  if (!id) return null
  return PARKS.find((park) => park.id === id) ?? null
}
