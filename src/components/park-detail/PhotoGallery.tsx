import { ParkImage } from '../ui/ParkImage.tsx'

type PhotoGalleryProps = {
  images: string[] | null
  name: string | null
}

export function PhotoGallery({ images, name }: PhotoGalleryProps) {
  if (images === null || images.length === 0) return null

  const label = name ?? 'Park'

  return (
    <section aria-labelledby="park-photos-heading" className="mt-6">
      <h2 id="park-photos-heading" className="text-sm font-semibold text-ink">
        Photos
      </h2>
      <ul className="mt-3 grid grid-cols-2 gap-3">
        {images.map((src, index) => (
          <li
            key={`${src}-${index}`}
            className="aspect-[4/3] overflow-hidden rounded-xl bg-chip"
          >
            <ParkImage src={src} alt={`${label} photo ${index + 1}`} />
          </li>
        ))}
      </ul>
    </section>
  )
}
