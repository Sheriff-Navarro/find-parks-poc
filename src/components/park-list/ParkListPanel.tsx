import type { Park } from '../../types/park'
import { joinClasses } from '../ui/joinClasses.ts'
import { ParkList } from './ParkList.tsx'

type ParkListPanelProps = {
  parks: Park[]
  className?: string
}

export function ParkListPanel({ parks, className }: ParkListPanelProps) {
  return (
    <section className={joinClasses('flex min-h-0 flex-col bg-surface', className)}>
      <header className="shrink-0 border-b border-slate-200 px-4 py-4">
        <h1 id="park-list-heading" className="text-xl font-semibold text-ink">
          Find a Park
        </h1>
      </header>
      {/* Empty slot for W4.T1 SearchInput. Stays above the list, outside the scroller. */}
      <div data-slot="park-search" className="shrink-0" />
      <nav
        aria-labelledby="park-list-heading"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        <ParkList parks={parks} />
      </nav>
    </section>
  )
}
