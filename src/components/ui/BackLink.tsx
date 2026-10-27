import type { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { joinClasses } from './joinClasses.ts'

type BackLinkProps = {
  to?: string
  children?: ReactNode
  className?: string
}

// Links into a detail page pass `{ backSearch: location.search }` as router state.
function homeWithSearch(state: unknown): string {
  if (typeof state !== 'object' || state === null || !('backSearch' in state)) return '/'
  const { backSearch } = state
  if (typeof backSearch !== 'string' || !backSearch.startsWith('?') || backSearch.length < 2) {
    return '/'
  }
  return `/${backSearch}`
}

export function BackLink({
  to,
  children = 'Back to all parks',
  className,
}: BackLinkProps) {
  const location = useLocation()
  const target = to ?? homeWithSearch(location.state)
  const classes = joinClasses(
    'inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-sm font-medium text-ink shadow-md',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    className,
  )

  return (
    <Link to={target} className={classes}>
      <ChevronLeft aria-hidden="true" className="size-4 shrink-0" />
      {children}
    </Link>
  )
}
