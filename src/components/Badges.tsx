export function VerifiedBadge({ label = '確認済み' }: { label?: string }) {
  return (
    <span className="nezu-verified-badge" aria-label={label} title={label}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m5 12.5 4.5 4.5L19 7" />
      </svg>
    </span>
  )
}

export function PremiumBadge({ compact = false, size = 16 }: { compact?: boolean; size?: number }) {
  return (
    <span
      className="nezu-premium-badge"
      aria-label="Premium"
      title="Premium"
      style={{ width: size, height: size, fontSize: Math.max(8, size * 0.56) }}
    >
      {!compact && 'P'}
    </span>
  )
}
