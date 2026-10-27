import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AmenityGrid } from '../components/park-detail/AmenityGrid.tsx'
import { ParkHero } from '../components/park-detail/ParkHero.tsx'
import { ParkInfoList } from '../components/park-detail/ParkInfoList.tsx'
import { PhotoGallery } from '../components/park-detail/PhotoGallery.tsx'
import { StarRating } from '../components/ui/StarRating.tsx'
import { getParkById } from '../data/parks.ts'

function pageTitle(name: string | null, found: boolean): string {
  if (!found) return 'Park not found · Find a Park'
  return `${name ?? 'Unnamed park'} · Find a Park`
}

export function ParkDetailPage() {
  const { id } = useParams()
  const park = getParkById(id)
  const title = pageTitle(park?.name ?? null, park !== null)

  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])

  if (park === null) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-semibold text-ink">Park not found</h1>
        <p className="mt-4">
          <Link
            to="/"
            className="rounded-sm font-medium text-primary underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            Back to all parks
          </Link>
        </p>
      </main>
    )
  }

  const address = park.location?.address ?? null
  const heroSrc = park.images?.[0] ?? null
  const displayName = park.name ?? 'Unnamed park'

  return (
    <main className="min-h-dvh bg-surface md:bg-chip md:px-6">
      <article className="md:mx-auto md:max-w-3xl md:py-8">
        <ParkHero name={park.name} src={heroSrc} />
        <div className="relative z-10 -mt-6 rounded-t-3xl bg-surface px-5 pt-3 pb-12 shadow-md md:mt-6 md:rounded-3xl md:px-8 md:py-8 md:shadow-none md:ring-1 md:ring-slate-200">
          <div
            aria-hidden="true"
            className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-slate-300 md:hidden"
          />
          <h1 className="text-2xl font-semibold tracking-tight text-ink">{displayName}</h1>
          {address !== null ? <p className="mt-1 text-sm text-muted">{address}</p> : null}
          {park.rating !== null ? (
            <div className="mt-2">
              <StarRating rating={park.rating} />
            </div>
          ) : null}
          <p
            className={
              park.description === null
                ? 'mt-4 leading-relaxed text-muted'
                : 'mt-4 leading-relaxed text-ink'
            }
          >
            {park.description ?? 'No description available'}
          </p>
          <ParkInfoList park={park} />
          <AmenityGrid amenities={park.amenities} />
          <PhotoGallery images={park.images} name={park.name} />
        </div>
      </article>
    </main>
  )
}
