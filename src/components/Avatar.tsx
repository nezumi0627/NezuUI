import { useState, type ReactNode } from 'react'

export type AvatarProps = {
  alt?: string
  color: string
  glyph?: string
  imageUrl?: string
  online?: boolean
  ring?: boolean
  size?: number
  icon?: ReactNode
  children?: ReactNode
}

/** A presentation-only avatar. The consuming application owns image URLs. */
export function Avatar({
  alt = '',
  color,
  glyph = '',
  imageUrl,
  online = false,
  ring = false,
  size = 44,
  icon,
  children,
}: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(imageUrl) && !failed
  const style = { width: size, height: size }

  return (
    <span className={['nezu-avatar', ring && 'has-ring'].filter(Boolean).join(' ')} style={style}>
      {showImage ? (
        <img src={imageUrl} alt={alt} onError={() => setFailed(true)} />
      ) : (
        <span
          aria-hidden={alt ? undefined : true}
          className="nezu-avatar-fallback"
          style={{
            background: `linear-gradient(145deg, ${color}, color-mix(in oklab, ${color} 55%, #000))`,
            fontSize: size * 0.5,
          }}
        >
          {icon ?? children ?? glyph}
        </span>
      )}
      {online && <span className="nezu-avatar-online" aria-label="オンライン" />}
    </span>
  )
}
