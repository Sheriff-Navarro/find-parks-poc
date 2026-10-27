import { describe, expect, it } from 'vitest'
import type { Park } from '../types/park'
import { getParks } from '../data/parks'
import { filterParks } from './filterParks'

function park(overrides: Partial<Park> & { id: string }): Park {
  return {
    name: null,
    description: null,
    location: null,
    amenities: null,
    hours: null,
    images: null,
    acreage: null,
    rating: null,
    ...overrides,
  }
}

const RIVERSIDE = park({
  id: 'riverside',
  name: 'Riverside Commons',
  location: { lat: 1, lng: 1, address: '100 River Rd, Brooklyn, NY' },
  amenities: ['dog-run', 'bike-path'],
})
const PLAZA = park({
  id: 'plaza',
  name: 'Central Plaza Green',
  location: { lat: 2, lng: 2, address: '5 Main St, Queens, NY' },
  amenities: ['wifi', 'food-vendors'],
})
const NO_DETAILS = park({ id: 'bare' })
const NO_ADDRESS = park({
  id: 'no-address',
  name: 'Highland Dog Park',
  location: { lat: 3, lng: 3, address: null },
  amenities: [],
})

const PARKS = [RIVERSIDE, PLAZA, NO_DETAILS, NO_ADDRESS]

describe('filterParks', () => {
  it('returns every park for an empty, blank, or null query', () => {
    expect(filterParks(PARKS, '')).toBe(PARKS)
    expect(filterParks(PARKS, '   ')).toBe(PARKS)
    expect(filterParks(PARKS, null)).toBe(PARKS)
  })

  it('matches the name case-insensitively', () => {
    expect(filterParks(PARKS, 'riverSIDE')).toEqual([RIVERSIDE])
  })

  it('trims the query', () => {
    expect(filterParks(PARKS, '  plaza  ')).toEqual([PLAZA])
  })

  it('matches the address', () => {
    expect(filterParks(PARKS, 'queens')).toEqual([PLAZA])
    expect(filterParks(PARKS, ', ny')).toEqual([RIVERSIDE, PLAZA])
  })

  it('matches amenity labels, not slugs', () => {
    expect(filterParks(PARKS, 'wi-fi')).toEqual([PLAZA])
    expect(filterParks(PARKS, 'bike path')).toEqual([RIVERSIDE])
    expect(filterParks(PARKS, 'bike-path')).toEqual([])
  })

  it('matches the name of a park with no address', () => {
    expect(filterParks(PARKS, 'dog')).toEqual([RIVERSIDE, NO_ADDRESS])
  })

  it('returns an empty array when nothing matches', () => {
    expect(filterParks(PARKS, 'zzz-no-match')).toEqual([])
  })

  it('keeps the input order and does not mutate the input', () => {
    const input = [...PARKS]
    filterParks(input, 'park')
    expect(input).toEqual(PARKS)
  })

  it('works on the real data', () => {
    const all = getParks()
    expect(filterParks(all, '')).toHaveLength(all.length)
    expect(filterParks(all, 'prospect').map((p) => p.id)).toContain('prospect-park')
    expect(filterParks(all, 'highland').map((p) => p.id)).toContain('highland-dog-park')
  })
})
