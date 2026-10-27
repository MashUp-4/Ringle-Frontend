import type { Tutor } from '../types/tutor'

export function TutorImage({
  tutor,
  alt = '',
}: {
  tutor: Tutor
  alt?: string
}) {
  const fallback = '/tutor-placeholder.svg'
  const src =
    tutor.id !== undefined
      ? tutor.imageUrl || fallback
      : `/tutor-${tutor.image}.png`
  return (
    <img
      src={src}
      alt={alt}
      onError={(event) => {
        if (!event.currentTarget.src.endsWith(fallback))
          event.currentTarget.src = fallback
      }}
    />
  )
}
