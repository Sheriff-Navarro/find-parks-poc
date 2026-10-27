import { describe, expect, it } from 'vitest'
import { formatAcreage, formatRating, hasAddress } from '../lib/format'
import { getParkById, getParks, normalizeParks } from './parks'

const EMPTY_PARK_FIELDS = {
  name: null,
  description: null,
  location: null,
  amenities: null,
  hours: null,
  images: null,
  acreage: null,
  rating: null,
}

describe('known data gaps', () => {
  it('highland-dog-park has no images and no address', () => {
    const park = getParkById('highland-dog-park')
    expect(park).not.toBeNull()
    expect(park?.images).toEqual([])
    expect(park?.location?.address).toBeNull()
    expect(park?.location?.lat).toBe(40.6789)
    expect(park && hasAddress(park)).toBe(false)
  })

  it('old-mill-botanical-garden has a null description', () => {
    expect(getParkById('old-mill-botanical-garden')?.description).toBeNull()
  })

  it('cedar-hill-nature-preserve has a null rating', () => {
    const park = getParkById('cedar-hill-nature-preserve')
    expect(park?.rating).toBeNull()
    expect(formatRating(park?.rating ?? null)).toBe('No rating yet')
  })
})

describe('getParks / getParkById', () => {
  it('returns every park sorted by name', () => {
    const parks = getParks()
    expect(parks).toHaveLength(12)
    const names = parks.map((park) => park.name ?? '')
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })

  it('returns the same array on every call', () => {
    expect(getParks()).toBe(getParks())
  })

  it('returns null for an unknown or missing id', () => {
    expect(getParkById('no-such-park')).toBeNull()
    expect(getParkById(undefined)).toBeNull()
    expect(getParkById(null)).toBeNull()
  })
})

describe('normalizeParks', () => {
  it('returns [] for non-array input', () => {
    expect(normalizeParks(undefined)).toEqual([])
    expect(normalizeParks(null)).toEqual([])
    expect(normalizeParks('parks')).toEqual([])
    expect(normalizeParks(42)).toEqual([])
    expect(normalizeParks({ id: 'a' })).toEqual([])
  })

  it('fills every key with null for an entry missing everything but id', () => {
    expect(normalizeParks([{ id: 'bare' }])).toEqual([
      { id: 'bare', ...EMPTY_PARK_FIELDS },
    ])
  })

  it('drops an entry missing every key, since it has no id', () => {
    expect(normalizeParks([{}])).toEqual([])
  })

  it('drops entries without a usable id', () => {
    const parks = normalizeParks([
      { name: 'No id' },
      { id: '   ', name: 'Blank id' },
      { id: 7, name: 'Numeric id' },
      null,
      'not an object',
      { id: 'kept', name: 'Kept' },
    ])
    expect(parks.map((park) => park.id)).toEqual(['kept'])
  })

  it('turns wrongly typed values into null', () => {
    const [park] = normalizeParks([
      {
        id: 'typed',
        name: 123,
        description: ['not', 'a', 'string'],
        location: { lat: 'abc', lng: Number.NaN, address: 5 },
        amenities: 'trails',
        hours: false,
        images: { 0: 'x' },
        acreage: '10',
        rating: '4.4',
      },
    ])
    expect(park).toEqual({
      ...EMPTY_PARK_FIELDS,
      id: 'typed',
      location: { lat: null, lng: null, address: null },
    })
  })

  it('treats a non-object location as null', () => {
    const [park] = normalizeParks([{ id: 'a', location: 'Brooklyn' }])
    expect(park.location).toBeNull()
  })

  it('trims strings and turns empty strings into null', () => {
    const [park] = normalizeParks([
      {
        id: '  trimmed  ',
        name: '  Trimmed Park ',
        description: '   ',
        hours: '',
        location: { lat: 1, lng: 2, address: '  1 Main St  ' },
      },
    ])
    expect(park.id).toBe('trimmed')
    expect(park.name).toBe('Trimmed Park')
    expect(park.description).toBeNull()
    expect(park.hours).toBeNull()
    expect(park.location).toEqual({ lat: 1, lng: 2, address: '1 Main St' })
  })

  it('keeps only non-empty strings in arrays', () => {
    const [park] = normalizeParks([
      {
        id: 'arrays',
        amenities: ['trails', '', '  ', 3, null, ' lake '],
        images: [{}, ''],
      },
    ])
    expect(park.amenities).toEqual(['trails', 'lake'])
    expect(park.images).toEqual([])
  })

  it('sorts by name with null names last', () => {
    const parks = normalizeParks([
      { id: 'c', name: null },
      { id: 'b', name: 'Beta' },
      { id: 'a', name: 'Alpha' },
    ])
    expect(parks.map((park) => park.id)).toEqual(['a', 'b', 'c'])
  })
})

describe('format helpers', () => {
  it('formats rating', () => {
    expect(formatRating(4.4)).toBe('4.4 / 5')
    expect(formatRating(4)).toBe('4.0 / 5')
    expect(formatRating(null)).toBe('No rating yet')
  })

  it('formats acreage', () => {
    expect(formatAcreage(526)).toBe('526 acres')
    expect(formatAcreage(1)).toBe('1 acre')
    expect(formatAcreage(1200)).toBe('1,200 acres')
    expect(formatAcreage(null)).toBeNull()
  })

  it('detects an address', () => {
    const [withAddress, noLocation] = normalizeParks([
      { id: 'a', name: 'A', location: { address: '1 Main St' } },
      { id: 'b', name: 'B' },
    ])
    expect(hasAddress(withAddress)).toBe(true)
    expect(hasAddress(noLocation)).toBe(false)
  })
})
