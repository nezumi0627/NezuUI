import type { ReactNode } from 'react'

export function FloatNotice({ children }: { children: ReactNode }) {
  return (
    <div className="nezu-float-notice" role="status">
      <div>{children}</div>
    </div>
  )
}
