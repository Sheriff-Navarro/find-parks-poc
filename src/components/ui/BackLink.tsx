import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { joinClasses } from './joinClasses.ts'

type BackLinkProps = {
  to?: string
  children?: ReactNode
  className?: string
}

export function BackLink({
  to = '/',
  children = 'Back to all parks',
  className,
}: BackLinkProps) {
  const classes = joinClasses(
    'inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-sm font-medium text-ink shadow-md',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    className,
  )

  return (
    <Link to={to} className={classes}>
      <ChevronLeft aria-hidden="true" className="size-4 shrink-0" />
      {children}
    </Link>
  )
}
