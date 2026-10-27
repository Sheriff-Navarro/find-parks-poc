import { joinClasses } from './joinClasses.ts'

type InfoRowProps = {
  label: string
  value: string | null
  className?: string
}

export function InfoRow({ label, value, className }: InfoRowProps) {
  if (value === null || value.trim() === '') return null

  const classes = joinClasses(
    'flex items-baseline justify-between gap-4 py-2 text-sm',
    className,
  )

  return (
    <div className={classes}>
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium text-ink">{value}</span>
    </div>
  )
}
