import { Link } from 'react-router-dom'
import type { Park } from '../../types/park'

type ParkPopupProps = {
  park: Park
}

export function ParkPopup({ park }: ParkPopupProps) {
  const address = park.location?.address ?? null

  return (
    <div className="min-w-40 space-y-1 text-ink">
      <p className="m-0! text-base font-semibold">{park.name ?? 'Unnamed park'}</p>
      {address !== null && <p className="m-0! text-sm text-muted">{address}</p>}
      {park.id !== null && (
        <Link
          to={`/park/${encodeURIComponent(park.id)}`}
          className="mt-2 inline-block rounded-xl bg-primary px-3 py-1.5 text-sm font-medium text-white! no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          View details
        </Link>
      )}
    </div>
  )
}
