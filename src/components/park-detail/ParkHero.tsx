import { BackLink } from '../ui/BackLink.tsx'
import { ParkImage } from '../ui/ParkImage.tsx'

type ParkHeroProps = {
  name: string | null
  src: string | null
}

export function ParkHero({ name, src }: ParkHeroProps) {
  const alt = name ? `Photo of ${name}` : 'Park photo'

  return (
    <div className="relative h-72 w-full overflow-hidden bg-chip md:h-96 md:rounded-3xl">
      <ParkImage src={src} alt={alt} />
      <div className="absolute top-4 left-4 z-10">
        <BackLink />
      </div>
    </div>
  )
}
