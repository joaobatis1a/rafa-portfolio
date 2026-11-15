import type { ProjectImage } from '../../types'

interface PictureProps {
  image: ProjectImage
  sizes: string
  priority?: boolean
  className?: string
}

const srcSet = (image: ProjectImage, ext: 'avif' | 'webp') =>
  image.widths.map((w) => `/img/${image.name}-${w}.${ext} ${w}w`).join(', ')

/**
 * Imagem responsiva: AVIF com WebP como alternativa, srcset por largura,
 * dimensões explícitas e lazy-loading fora da primeira dobra.
 */
export function Picture({ image, sizes, priority, className }: PictureProps) {
  const largest = image.widths[image.widths.length - 1]
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(image, 'avif')} sizes={sizes} />
      <img
        src={`/img/${image.name}-${largest}.webp`}
        srcSet={srcSet(image, 'webp')}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={image.alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        className={className}
      />
    </picture>
  )
}
