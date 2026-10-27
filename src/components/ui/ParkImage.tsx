import { useState } from 'react'
import { joinClasses } from './joinClasses.ts'
import { Placeholder } from './Placeholder.tsx'

type ParkImageProps = {
  src: string | null
  alt: string
  className?: string
}

export function ParkImage({ src, alt, className }: ParkImageProps) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null)
  const trimmed = src?.trim() ?? ''
  const missing = trimmed === ''
  const failed = !missing && failedSrc === trimmed
  const frame = joinClasses('h-full w-full', className)

  if (missing || failed) {
    return <Placeholder className={frame} />
  }

  return (
    <img
      src={trimmed}
      alt={alt}
      className={joinClasses('block object-cover', frame)}
      onError={() => setFailedSrc(trimmed)}
    />
  )
}
