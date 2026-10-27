import { getAmenity } from '../../lib/amenities.ts'

type AmenityGridProps = {
  amenities: string[] | null
}

export function AmenityGrid({ amenities }: AmenityGridProps) {
  if (amenities === null || amenities.length === 0) return null

  return (
    <section aria-labelledby="park-amenities-heading" className="mt-6">
      <h2 id="park-amenities-heading" className="text-lg font-semibold text-ink">
        Amenities
      </h2>
      <ul className="mt-3 grid grid-cols-3 gap-3 md:grid-cols-4">
        {amenities.map((slug, index) => {
          const { label, icon: Icon } = getAmenity(slug)
          return (
            <li
              key={`${slug}-${index}`}
              className="flex flex-col items-center justify-center gap-2 rounded-xl bg-chip px-2 py-4 text-center"
            >
              <Icon aria-hidden="true" className="size-6 shrink-0 text-ink" strokeWidth={1.75} />
              <span className="text-sm leading-tight text-ink">{label}</span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
