import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Park } from '../../types/park'
import { hasAddress } from '../../lib/format.ts'
import { ParkImage } from '../ui/ParkImage.tsx'

type ParkListItemProps = {
  park: Park
}

export function ParkListItem({ park }: ParkListItemProps) {
  if (park.id === null) return null

  const name = park.name ?? 'Unnamed park'
  const address = hasAddress(park) ? (park.location?.address ?? null) : null
  const photo = park.images?.[0] ?? null

  return (
    <Link
      to={`/park/${encodeURIComponent(park.id)}`}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-chip focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      <div className="size-16 shrink-0 overflow-hidden rounded-xl bg-chip">
        <ParkImage src={photo} alt="" />
      </div>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium text-ink" title={park.name ?? undefined}>
          {name}
        </span>
        {address !== null && (
          <span className="mt-0.5 block truncate text-sm text-muted" title={address}>
            {address}
          </span>
        )}
      </span>
      <ChevronRight aria-hidden="true" className="size-5 shrink-0 text-muted" />
    </Link>
  )
}
