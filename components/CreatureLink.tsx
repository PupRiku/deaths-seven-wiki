'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { NPC } from '@/types'

interface Props {
  npc: NPC
  displayText: string
}

const ACCENT = '#c0392b'
const SHOW_DELAY = 120
const HIDE_DELAY = 150
const IMAGE_SIZE = 200 // 1:1 image, fixed square in the hover card

// Renders a stat block trait/action body in the hover card. Handles array descriptions
// (line-broken with hanging indent on wrapped continuation, used for spell lists).
function HoverEntryBody({ name, description }: { name: string; description: string | string[] }) {
  const strong = { color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '0.7rem' } as const
  if (Array.isArray(description)) {
    return (
      <>
        <span style={{ display: 'block', paddingLeft: '1.25rem', textIndent: '-1.25rem' }}>
          <strong style={strong}>{name}. </strong>{description[0]}
        </span>
        {description.slice(1).map((line, i) => (
          <span key={i} style={{ display: 'block', paddingLeft: '1.25rem', textIndent: '-1.25rem' }}>{line}</span>
        ))}
      </>
    )
  }
  return (
    <>
      <strong style={strong}>{name}. </strong>{description}
    </>
  )
}

export default function CreatureLink({ npc, displayText }: Props) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const [mounted, setMounted] = useState(false)
  const linkRef = useRef<HTMLSpanElement>(null)
  const showTimer = useRef<number | null>(null)
  const hideTimer = useRef<number | null>(null)

  // Portals require document; only render after mount.
  useEffect(() => { setMounted(true) }, [])

  const sb = npc.statBlock
  const mod = (v: number) => { const m = Math.floor((v - 10) / 2); return m >= 0 ? `+${m}` : `${m}` }

  function clearTimers() {
    if (showTimer.current) { window.clearTimeout(showTimer.current); showTimer.current = null }
    if (hideTimer.current) { window.clearTimeout(hideTimer.current); hideTimer.current = null }
  }

  function scheduleShow() {
    clearTimers()
    showTimer.current = window.setTimeout(() => {
      const r = linkRef.current?.getBoundingClientRect()
      if (!r) return
      const cardW = 360
      const cardH = npc.statBlock?.image ? 540 : 360
      let top = r.bottom + 8
      let left = r.left
      if (left + cardW > window.innerWidth - 12) left = Math.max(12, window.innerWidth - cardW - 12)
      // If card would overflow bottom, try flipping above the link.
      // If neither fits, place above the link's top so the link itself stays uncovered.
      if (top + cardH > window.innerHeight - 12) {
        const flipped = r.top - cardH - 8
        top = flipped >= 12 ? flipped : Math.max(12, r.top - cardH - 8)
      }
      setPos({ top, left })
      setOpen(true)
    }, SHOW_DELAY)
  }

  function scheduleHide() {
    clearTimers()
    hideTimer.current = window.setTimeout(() => {
      setOpen(false)
      setPos(null)
    }, HIDE_DELAY)
  }

  function openPopout() {
    clearTimers()
    setOpen(false)
    window.open(
      `/creatures/${npc.id}`,
      `creature-${npc.id}`,
      'width=480,height=780,resizable=yes,scrollbars=yes'
    )
  }

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    openPopout()
  }

  const card = (open && pos && sb) ? (
    <div
      onMouseEnter={clearTimers}
      onMouseLeave={scheduleHide}
      className="fade-in"
      style={{
        position: 'fixed',
        top: pos.top,
        left: pos.left,
        width: '360px',
        background: '#0f0c09',
        border: `1px solid ${ACCENT}55`,
        borderTop: `2px solid ${ACCENT}`,
        borderRadius: '4px',
        padding: '0.75rem 0.85rem',
        zIndex: 1000,
        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
        fontFamily: 'var(--font-body)',
        color: 'var(--text-primary)',
      }}
    >
      {/* Image (1:1, contained, never cropped) */}
      {sb.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sb.image}
          alt={sb.name}
          style={{
            width: `${IMAGE_SIZE}px`,
            height: `${IMAGE_SIZE}px`,
            objectFit: 'contain',
            borderRadius: '3px',
            border: `1px solid ${ACCENT}22`,
            margin: '0 auto 0.5rem',
            display: 'block',
            background: '#0a0806',
          }}
        />
      )}

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', marginBottom: '0.4rem' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.88rem', color: ACCENT, letterSpacing: '0.05em' }}>{sb.name}</div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.04em', marginTop: '0.15rem', fontStyle: 'italic' }}>
          {npc.race}
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.64rem', color: 'var(--text-secondary)', marginTop: '0.25rem', letterSpacing: '0.04em' }}>
          CR {sb.cr} · AC {sb.ac} · HP {sb.hp} · Speed {sb.speed}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.25rem', padding: '0.3rem 0', borderBottom: '1px solid var(--border)', marginBottom: '0.45rem' }}>
        {(['str','dex','con','int','wis','cha'] as const).map((stat) => (
          <div key={stat} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.55rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>{stat.toUpperCase()}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-primary)' }}>{sb[stat]}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-secondary)' }}>{mod(sb[stat])}</div>
          </div>
        ))}
      </div>

      {/* Skills / Senses / Languages */}
      {(sb.senses || sb.languages || (sb.skills && sb.skills.length > 0)) && (
        <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: '0.45rem' }}>
          {sb.skills && sb.skills.length > 0 && (
            <div><strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '0.66rem' }}>Skills </strong>{sb.skills.join(', ')}</div>
          )}
          {sb.senses && (
            <div><strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '0.66rem' }}>Senses </strong>{sb.senses}</div>
          )}
          {sb.languages && (
            <div><strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '0.66rem' }}>Languages </strong>{sb.languages}</div>
          )}
        </div>
      )}

      {/* First trait — div, not p, so the card never has block descendants of the host paragraph (portal also keeps it safe) */}
      {sb.traits && sb.traits.length > 0 && (
        <div style={{ margin: '0.25rem 0', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
          <HoverEntryBody name={sb.traits[0].name} description={sb.traits[0].description} />
        </div>
      )}

      {/* First action */}
      {sb.actions && sb.actions.length > 0 && (
        <div style={{ margin: '0.25rem 0', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
          <HoverEntryBody name={sb.actions[0].name} description={sb.actions[0].description} />
        </div>
      )}

      {/* Open button — always reachable even if the card overlaps the link */}
      <button
        type="button"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); openPopout() }}
        style={{
          width: '100%',
          marginTop: '0.6rem',
          padding: '0.45rem',
          fontFamily: 'var(--font-heading)',
          fontSize: '0.7rem',
          letterSpacing: '0.1em',
          background: 'transparent',
          border: `1px solid ${ACCENT}66`,
          color: ACCENT,
          borderRadius: '3px',
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = `${ACCENT}22`; e.currentTarget.style.borderColor = ACCENT }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = `${ACCENT}66` }}
      >
        OPEN FULL STAT BLOCK ↗
      </button>
    </div>
  ) : null

  return (
    <>
      <span
        ref={linkRef}
        onMouseEnter={scheduleShow}
        onMouseLeave={scheduleHide}
        onClick={handleClick}
        style={{
          color: ACCENT,
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
          textDecorationColor: ACCENT + '77',
          textUnderlineOffset: '3px',
          cursor: 'pointer',
          fontWeight: 500,
        }}
      >
        {displayText}
      </span>
      {mounted && card && createPortal(card, document.body)}
    </>
  )
}
