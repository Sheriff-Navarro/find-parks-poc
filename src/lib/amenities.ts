import type { LucideIcon } from 'lucide-react'
import {
  Accessibility,
  Anchor,
  Bike,
  Binoculars,
  CircleDot,
  CircleParking,
  Coffee,
  Dog,
  Droplets,
  FerrisWheel,
  Fish,
  Flower2,
  Footprints,
  Gift,
  GlassWater,
  Lamp,
  LandPlot,
  MapPin,
  PersonStanding,
  Sailboat,
  Store,
  Tent,
  Toilet,
  TreePine,
  Utensils,
  WavesHorizontal,
  Wifi,
} from 'lucide-react'

export type AmenityMeta = {
  label: string
  icon: LucideIcon
}

const AMENITIES: Record<string, AmenityMeta> = {
  playground: { label: 'Playground', icon: FerrisWheel },
  'dog-run': { label: 'Dog run', icon: Dog },
  trails: { label: 'Trails', icon: TreePine },
  restrooms: { label: 'Restrooms', icon: Toilet },
  parking: { label: 'Parking', icon: CircleParking },
  lake: { label: 'Lake', icon: WavesHorizontal },
  'picnic-areas': { label: 'Picnic areas', icon: Utensils },
  waterfront: { label: 'Waterfront', icon: Anchor },
  'bike-path': { label: 'Bike path', icon: Bike },
  'wildlife-viewing': { label: 'Wildlife viewing', icon: Binoculars },
  'splash-pad': { label: 'Splash pad', icon: Droplets },
  basketball: { label: 'Basketball', icon: CircleDot },
  'water-fountain': { label: 'Water fountain', icon: GlassWater },
  'sports-fields': { label: 'Sports fields', icon: LandPlot },
  gardens: { label: 'Gardens', icon: Flower2 },
  cafe: { label: 'Cafe', icon: Coffee },
  'gift-shop': { label: 'Gift shop', icon: Gift },
  'accessible-paths': { label: 'Accessible paths', icon: Accessibility },
  fishing: { label: 'Fishing', icon: Fish },
  'kayak-launch': { label: 'Kayak launch', icon: Sailboat },
  'event-lawn': { label: 'Event lawn', icon: Tent },
  wifi: { label: 'Wi-Fi', icon: Wifi },
  'food-vendors': { label: 'Food vendors', icon: Store },
  boardwalk: { label: 'Boardwalk', icon: Footprints },
  'skate-park': { label: 'Skate park', icon: PersonStanding },
  lighting: { label: 'Lighting', icon: Lamp },
}

function titleCaseSlug(slug: string): string {
  return slug
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function getAmenity(slug: string): AmenityMeta {
  const key = slug.trim().toLowerCase()
  const known = AMENITIES[key]
  if (known) return known
  return { label: titleCaseSlug(key), icon: MapPin }
}
