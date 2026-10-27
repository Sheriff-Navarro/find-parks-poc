import type { Park } from '../../types/park'
import { ParkListItem } from './ParkListItem.tsx'

type ParkListProps = {
  parks: Park[]
}

export function ParkList({ parks }: ParkListProps) {
  return (
    <ul className="flex flex-col gap-1 p-2">
      {parks.map((park) =>
        park.id === null ? null : (
          <li key={park.id}>
            <ParkListItem park={park} />
          </li>
        ),
      )}
    </ul>
  )
}
