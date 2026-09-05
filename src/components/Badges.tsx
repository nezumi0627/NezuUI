export function OfficialBadge({ className = '' }: { className?: string }) {
  return (
    <span className={`nezu-official-badge ${className}`.trim()} aria-label="公式アカウント" title="公式アカウント">
      <svg viewBox="0 0 24 24" width="10" height="10" aria-hidden="true">
        <path d="m5 12.5 4.5 4.5L19 7" />
      </svg>
    </span>
  )
}

/** @deprecated Use OfficialBadge. */
export const VerifiedBadge = OfficialBadge

export function PremiumBadge({ compact = false, size = 14 }: { compact?: boolean; size?: number }) {
  return (
    <span
      className="nezu-premium-badge"
      aria-label="LYP Premium"
      title="LYP Premium"
      style={{ width: size, height: size, fontSize: Math.max(8, size * 0.56) }}
    >
      {!compact && 'P'}
    </span>
  )
}
