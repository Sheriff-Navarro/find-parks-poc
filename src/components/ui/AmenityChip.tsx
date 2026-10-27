import { getAmenity } from '../../lib/amenities.ts'
import { joinClasses } from './joinClasses.ts'

type AmenityChipProps = {
  slug: string
  className?: string
}

export function AmenityChip({ slug, className }: AmenityChipProps) {
  const { label, icon: Icon } = getAmenity(slug)
  const classes = joinClasses(
    'inline-flex items-center gap-1.5 rounded-full bg-chip px-3 py-1 text-sm text-ink',
    className,
  )

  return (
    <span className={classes}>
      <Icon aria-hidden="true" className="size-4 shrink-0 text-primary" />
      {label}
    </span>
  )
}
