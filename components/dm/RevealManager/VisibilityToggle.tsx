'use client'

import { useRef } from 'react'
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
//
// Keyboard: implements WAI-ARIA roving tabindex pattern for radiogroup.
// The selected segment is in the tab order; ArrowLeft/ArrowRight (and
// ArrowUp/ArrowDown) move selection AND fire onChange. Home/End jump
// to first/last segment.
export default function VisibilityToggle({ value, onChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const selectedIndex = SEGMENTS.findIndex((s) => s.value === value)

  function focusSegment(index: number) {
    const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>(
      'button[role="radio"]'
    )
    buttons?.[index]?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    let nextIndex: number | null = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (selectedIndex + 1) % SEGMENTS.length
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (selectedIndex - 1 + SEGMENTS.length) % SEGMENTS.length
    } else if (e.key === 'Home') {
      nextIndex = 0
    } else if (e.key === 'End') {
      nextIndex = SEGMENTS.length - 1
    }
    if (nextIndex !== null) {
      e.preventDefault()
      onChange(SEGMENTS[nextIndex].value)
      focusSegment(nextIndex)
    }
  }

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label="Visibility"
      onKeyDown={handleKeyDown}
      style={{
        display: 'inline-flex',
        border: '0.5px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
      }}
    >
      {SEGMENTS.map((seg, i) => {
        const active = seg.value === value
        return (
          <button
            key={seg.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={seg.aria}
            // Roving tabindex: only the selected segment is tab-reachable;
            // the others are reached via arrow keys.
            tabIndex={active ? 0 : -1}
            onClick={() => {
              onChange(seg.value)
              focusSegment(i)
            }}
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
