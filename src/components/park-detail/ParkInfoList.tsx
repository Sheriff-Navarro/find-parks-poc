import type { Park } from '../../types/park.ts'
import { formatAcreage, formatRating } from '../../lib/format.ts'
import { InfoRow } from '../ui/InfoRow.tsx'

type ParkInfoListProps = {
  park: Park
}

export function ParkInfoList({ park }: ParkInfoListProps) {
  const address = park.location?.address ?? null

  return (
    <section aria-labelledby="park-details-heading" className="mt-6">
      <h2 id="park-details-heading" className="text-sm font-semibold text-ink">
        Details
      </h2>
      <div className="mt-1 divide-y divide-slate-200 border-t border-slate-200">
        <InfoRow label="Address" value={address} />
        <InfoRow label="Hours" value={park.hours} />
        <InfoRow label="Size" value={formatAcreage(park.acreage)} />
        <InfoRow label="Rating" value={formatRating(park.rating)} />
      </div>
    </section>
  )
}
