import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { List, Map } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { getParks } from '../data/parks.ts'
import { filterParks } from '../lib/filterParks.ts'
import { ParkMap, type MapOverlayInset } from '../components/map/ParkMap.tsx'
import { ParkListPanel } from '../components/park-list/ParkListPanel.tsx'
import type { Park } from '../types/park'

// Tailwind's md breakpoint. The map mounts only for the layout that is on screen,
// because a display:none Leaflet container initializes at 0px and stays blank.
const MD_QUERY = '(min-width: 48rem)'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

function useMdUp(): boolean {
  const [mdUp, setMdUp] = useState(() => window.matchMedia(MD_QUERY).matches)

  useEffect(() => {
    const media = window.matchMedia(MD_QUERY)
    const onChange = () => setMdUp(media.matches)
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return mdUp
}

type HomeLayoutProps = {
  parks: Park[]
  totalCount: number
  query: string
  onQueryChange: (query: string) => void
}

function useParkSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const setQuery = useCallback(
    (next: string) => {
      setSearchParams(
        (params) => {
          const updated = new URLSearchParams(params)
          if (next === '') updated.delete('q')
          else updated.set('q', next)
          return updated
        },
        // Typing should not add a history entry per keystroke.
        { replace: true },
      )
    },
    [setSearchParams],
  )

  return [query, setQuery] as const
}

// left-4 + w-80 + a 1rem gap, so popups opened under the panel pan into view.
const DESKTOP_MAP_INSET: MapOverlayInset = { left: 352 }
// The "Show list" pill: top-4 plus its height.
const MOBILE_MAP_INSET: MapOverlayInset = { top: 56 }

// The list and "Show list" come before the map in the DOM so they come first in Tab order;
// absolute positioning and z-index keep the visual layout.
function DesktopHome({ parks, totalCount, query, onQueryChange }: HomeLayoutProps) {
  return (
    <div className="relative h-dvh overflow-hidden">
      <ParkListPanel
        parks={parks}
        totalCount={totalCount}
        query={query}
        onQueryChange={onQueryChange}
        className="absolute top-4 bottom-4 left-4 z-10 w-80 max-w-[calc(100%-2rem)] overflow-hidden rounded-3xl shadow-xl"
      />
      <ParkMap
        parks={parks}
        overlayInset={DESKTOP_MAP_INSET}
        className="absolute inset-0 z-0 h-full w-full [&_.leaflet-left]:left-auto! [&_.leaflet-left]:right-0!"
      />
    </div>
  )
}

function MobileHome({ parks, totalCount, query, onQueryChange }: HomeLayoutProps) {
  const [mapOpen, setMapOpen] = useState(false)
  const openMapButtonRef = useRef<HTMLButtonElement>(null)
  const showListButtonRef = useRef<HTMLButtonElement>(null)
  const skipInitialFocus = useRef(true)

  useEffect(() => {
    if (skipInitialFocus.current) {
      skipInitialFocus.current = false
      return
    }
    if (mapOpen) showListButtonRef.current?.focus()
    else openMapButtonRef.current?.focus()
  }, [mapOpen])

  if (mapOpen) {
    return (
      <div className="relative h-dvh overflow-hidden">
        <button
          ref={showListButtonRef}
          type="button"
          onClick={() => setMapOpen(false)}
          className={`absolute top-[max(1rem,env(safe-area-inset-top))] left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-sm font-medium text-ink shadow-md ${focusRing}`}
        >
          <List aria-hidden="true" className="size-4 shrink-0" />
          Show list
        </button>
        <ParkMap parks={parks} overlayInset={MOBILE_MAP_INSET} className="absolute inset-0 z-0 h-full w-full" />
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-surface">
      <ParkListPanel
        parks={parks}
        totalCount={totalCount}
        query={query}
        onQueryChange={onQueryChange}
        className="min-h-0 flex-1"
      />
      <div className="shrink-0 border-t border-slate-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <button
          ref={openMapButtonRef}
          type="button"
          onClick={() => setMapOpen(true)}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-base font-medium text-white ${focusRing}`}
        >
          <Map aria-hidden="true" className="size-5 shrink-0" />
          Open map
        </button>
      </div>
    </div>
  )
}

export function HomePage() {
  const allParks = getParks()
  const [query, setQuery] = useParkSearch()
  const parks = useMemo(() => filterParks(allParks, query), [allParks, query])
  const mdUp = useMdUp()

  const layoutProps: HomeLayoutProps = {
    parks,
    totalCount: allParks.length,
    query,
    onQueryChange: setQuery,
  }

  return mdUp ? <DesktopHome {...layoutProps} /> : <MobileHome {...layoutProps} />
}
