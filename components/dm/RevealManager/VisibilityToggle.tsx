'use client'

import type { Visibility } from './types'

const SEGMENTS: { value: Visibility; label: string; aria: string; color: string }[] = [
  { value: 'hidden', label: 'H', aria: 'Hidden', color: 'var(--text-muted)' },
  { value: 'discovered', label: 'D', aria: 'Discovered', color: 'var(--orange)' },
  { value: 'revealed', label: 'R', aria: 'Revealed', color: 'var(--cyan)' },
]

interface Props {
  value: Visibility
  onChange: (v: Visibility) => void
}

// Three-state segmented toggle. Designed to be reachable mid-session — a
// single tap commits the new state immediately (no save button).
export default function VisibilityToggle({ value, onChange }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="Visibility"
      style={{
        display: 'inline-flex',
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      {SEGMENTS.map((seg) => {
        const active = seg.value === value
        return (
          <button
            key={seg.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={seg.aria}
            onClick={() => onChange(seg.value)}
            style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              padding: '0.3rem 0.7rem',
              border: 'none',
              borderRight: '0.5px solid var(--border)',
              background: active
                ? `color-mix(in srgb, ${seg.color} 16%, transparent)`
                : 'var(--bg-surface)',
              color: active ? seg.color : 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {seg.label}
          </button>
        )
      })}
    </div>
  )
}
