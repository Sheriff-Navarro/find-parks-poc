import { Mountain } from 'lucide-react'
import { joinClasses } from './joinClasses.ts'

type PlaceholderProps = {
  className?: string
}

export function Placeholder({ className }: PlaceholderProps) {
  const classes = joinClasses(
    'flex items-center justify-center bg-chip text-muted',
    className,
  )

  return (
    <div role="img" aria-label="No photo available" className={classes}>
      <Mountain aria-hidden="true" className="size-10" strokeWidth={1.5} />
    </div>
  )
}
