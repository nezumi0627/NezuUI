import type { ButtonHTMLAttributes } from 'react'

export type ToggleProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  checked: boolean
  label: string
  onCheckedChange: (checked: boolean) => void
}

/** A controlled, accessible switch with no application state dependency. */
export function Toggle({ checked, label, onCheckedChange, disabled, className, ...props }: ToggleProps) {
  return (
    <button
      {...props}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      className={['nezu-toggle', checked && 'is-checked', className].filter(Boolean).join(' ')}
      onClick={() => onCheckedChange(!checked)}
    >
      <span aria-hidden="true" />
    </button>
  )
}
