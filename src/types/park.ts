export type ParkLocation = {
  lat: number | null
  lng: number | null
  address: string | null
}

export type Park = {
  id: string | null
  name: string | null
  description: string | null
  location: ParkLocation | null
  amenities: string[] | null
  hours: string | null
  images: string[] | null
  acreage: number | null
  rating: number | null
}
