import type { Park } from '../types/park'

export function formatAcreage(acreage: number | null): string | null {
  if (acreage === null) return null
  const value = acreage.toLocaleString('en-US', { maximumFractionDigits: 1 })
  return `${value} ${acreage === 1 ? 'acre' : 'acres'}`
}

export function formatRating(rating: number | null): string {
  if (rating === null) return 'No rating yet'
  return `${rating.toFixed(1)} / 5`
}

export function hasAddress(park: Park): boolean {
  return park.location !== null && park.location.address !== null
}
