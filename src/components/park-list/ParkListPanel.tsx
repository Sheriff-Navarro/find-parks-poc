import { useRef } from 'react'
import { SearchX } from 'lucide-react'
import type { Park } from '../../types/park'
import { SearchInput } from '../search/SearchInput.tsx'
import { joinClasses } from '../ui/joinClasses.ts'
import { ParkList } from './ParkList.tsx'

type ParkListPanelProps = {
  parks: Park[]
  totalCount: number
  query: string
  onQueryChange: (query: string) => void
  className?: string
}

export function ParkListPanel({ parks, totalCount, query, onQueryChange, className }: ParkListPanelProps) {
  const searchRef = useRef<HTMLInputElement>(null)
  const isFiltering = query.trim() !== ''

  const clearSearch = () => {
    onQueryChange('')
    searchRef.current?.focus()
  }

  return (
    <section className={joinClasses('flex min-h-0 flex-col bg-surface', className)}>
      <header className="shrink-0 border-b border-slate-200 px-4 py-4">
        <h1 id="park-list-heading" className="text-xl font-semibold text-ink">
          Find a Park
          {isFiltering && (
            <span className="font-normal text-muted">
              {' '}
              ({parks.length} of {totalCount})
            </span>
          )}
        </h1>
        <SearchInput ref={searchRef} value={query} onChange={onQueryChange} className="mt-3" />
        <p role="status" className="sr-only">
          {isFiltering ? `${parks.length} of ${totalCount} parks match "${query.trim()}"` : ''}
        </p>
      </header>
      <nav aria-labelledby="park-list-heading" className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        {parks.length > 0 ? (
          <ParkList parks={parks} />
        ) : (
          <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
            <SearchX aria-hidden="true" className="size-8 text-muted" />
            <p className="font-medium text-ink">No parks match</p>
            {isFiltering && (
              <p className="text-sm text-muted">
                Nothing found for “{query.trim()}”. Try a park name, street, or amenity.
              </p>
            )}
            <button
              type="button"
              onClick={clearSearch}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Clear search
            </button>
          </div>
        )}
      </nav>
    </section>
  )
}
