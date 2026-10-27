import { Star, StarHalf } from 'lucide-react'
import { joinClasses } from './joinClasses.ts'

type StarRatingProps = {
  rating: number | null
  className?: string
}

const STAR_COUNT = 5

type StarState = 'full' | 'half' | 'empty'

function starStates(rating: number): StarState[] {
  const clamped = Math.min(STAR_COUNT, Math.max(0, rating))
  const halves = Math.round(clamped * 2)
  return Array.from({ length: STAR_COUNT }, (_, index) => {
    const remaining = halves - index * 2
    if (remaining >= 2) return 'full'
    if (remaining === 1) return 'half'
    return 'empty'
  })
}

function StarGlyph({ state }: { state: StarState }) {
  if (state === 'full') {
    return <Star aria-hidden="true" className="size-4 fill-star text-star" />
  }
  if (state === 'half') {
    return (
      <span className="relative inline-flex size-4">
        <Star aria-hidden="true" className="size-4 fill-transparent text-slate-300" />
        <StarHalf
          aria-hidden="true"
          className="absolute inset-0 size-4 fill-star text-star"
        />
      </span>
    )
  }
  return <Star aria-hidden="true" className="size-4 fill-transparent text-slate-300" />
}

export function StarRating({ rating, className }: StarRatingProps) {
  if (rating === null || !Number.isFinite(rating)) return null

  const classes = joinClasses('inline-flex items-center gap-0.5', className)

  return (
    <span className={classes} role="img" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      {starStates(rating).map((state, index) => (
        <StarGlyph key={index} state={state} />
      ))}
    </span>
  )
}
