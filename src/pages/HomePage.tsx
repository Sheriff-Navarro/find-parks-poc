import { useEffect, useRef, useState } from 'react'
import { List, Map } from 'lucide-react'
import { getParks } from '../data/parks.ts'
import { ParkMap } from '../components/map/ParkMap.tsx'
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

function DesktopHome({ parks }: { parks: Park[] }) {
  return (
    <div className="relative h-dvh overflow-hidden">
      <ParkMap
        parks={parks}
        className="absolute inset-0 z-0 h-full w-full [&_.leaflet-left]:left-auto! [&_.leaflet-left]:right-0!"
      />
      <ParkListPanel
        parks={parks}
        className="absolute top-4 bottom-4 left-4 z-10 w-80 max-w-[calc(100%-2rem)] overflow-hidden rounded-3xl shadow-xl"
      />
    </div>
  )
}

function MobileHome({ parks }: { parks: Park[] }) {
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
        <ParkMap parks={parks} className="absolute inset-0 z-0 h-full w-full" />
        <button
          ref={showListButtonRef}
          type="button"
          onClick={() => setMapOpen(false)}
          className={`absolute top-[max(1rem,env(safe-area-inset-top))] left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-surface px-4 py-2 text-sm font-medium text-ink shadow-md ${focusRing}`}
        >
          <List aria-hidden="true" className="size-4 shrink-0" />
          Show list
        </button>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-surface">
      <ParkListPanel parks={parks} className="min-h-0 flex-1" />
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
  const parks = getParks()
  const mdUp = useMdUp()

  return mdUp ? <DesktopHome parks={parks} /> : <MobileHome parks={parks} />
}
