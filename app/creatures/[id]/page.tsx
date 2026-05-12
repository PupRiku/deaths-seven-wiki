'use client'

import { useState, useEffect, use } from 'react'
import type { NPC } from '@/types'
import { rgbaFromHex } from '@/lib/colors'

const ALIGNMENT_COLORS: Record<string, string> = {
  Ally: 'var(--cyan)',
  Enemy: 'var(--status-danger)',
  Neutral: 'var(--orange)',
  Complex: 'var(--purple)',
}

const ALIGNMENT_HEX: Record<string, string> = {
  Ally: '#22d3ee',
  Enemy: '#f87171',
  Neutral: '#e8834a',
  Complex: '#8b5cf6',
}

function StatRow({ label, value }: { label: string; value: number }) {
  const m = Math.floor((value - 10) / 2)
  return (
    <div style={{
      textAlign: 'center',
      padding: '0.5rem 0.25rem',
      background: 'rgba(34, 211, 238, 0.04)',
      border: '0.5px solid rgba(34, 211, 238, 0.1)',
      borderRadius: 'var(--radius-md)',
    }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9375rem', color: 'var(--cyan-bright)', fontWeight: 500 }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{m >= 0 ? `+${m}` : `${m}`}</div>
    </div>
  )
}

function EntryBody({ name, description }: { name: string; description: string | string[] }) {
  const strong = { color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 600 } as const
  if (Array.isArray(description)) {
    return (
      <>
        <span style={{ display: 'block', paddingLeft: '1.5rem', textIndent: '-1.5rem' }}>
          <strong style={strong}>{name}. </strong>{description[0]}
        </span>
        {description.slice(1).map((line, i) => (
          <span key={i} style={{ display: 'block', paddingLeft: '1.5rem', textIndent: '-1.5rem' }}>{line}</span>
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

function ActionList({ heading, items, accent }: { heading: string; items: { name: string; description: string | string[] }[]; accent: string }) {
  return (
    <div style={{ marginBottom: '0.6rem' }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: accent, letterSpacing: '0.12em', marginBottom: '0.3rem', fontWeight: 600 }}>{heading}</div>
      {items.map((a, i) => (
        <p key={i} style={{ margin: '0.3rem 0', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
          <EntryBody name={a.name} description={a.description} />
        </p>
      ))}
    </div>
  )
}

export default function CreaturePopout({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [npc, setNpc] = useState<NPC | null>(null)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/npcs?id=${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('not found'))))
      .then((data) => {
        setNpc(data)
        if (data?.name) document.title = data.name
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div style={{ padding: '2rem', color: 'var(--text-muted)', fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', letterSpacing: '0.12em', fontWeight: 600 }}>Loading…</div>
  }

  if (error || !npc) {
    return (
      <div style={{ padding: '2rem', color: 'var(--text-muted)', fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', fontWeight: 600 }}>
        Creature not found: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{id}</span>
      </div>
    )
  }

  const sb = npc.statBlock
  const accent = ALIGNMENT_COLORS[npc.alignment] || 'var(--orange)'
  const accentHex = ALIGNMENT_HEX[npc.alignment] || '#e8834a'

  return (
    <div style={{ padding: '1rem', maxWidth: '480px', margin: '0 auto' }}>
      {/* Top header */}
      <div style={{ borderBottom: `2px solid ${rgbaFromHex(accentHex, 0.4)}`, paddingBottom: '0.5rem', marginBottom: '0.75rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: accent, margin: 0, letterSpacing: '0.04em' }}>{npc.name}</h1>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem', fontStyle: 'italic' }}>
          {npc.race} · {npc.role}
        </div>
      </div>

      {!sb && (
        <div style={{ padding: '1rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
          No stat block available for this entry.
        </div>
      )}

      {sb && (
        <div style={{
          background: 'var(--bg-base)',
          border: `0.5px solid ${rgbaFromHex(accentHex, 0.2)}`,
          borderTop: `2px solid ${accent}`,
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-lg)',
        }}>
          {sb.image && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sb.image} alt={sb.name} style={{ maxWidth: '100%', maxHeight: '320px', objectFit: 'contain', borderRadius: 'var(--radius-md)', border: `0.5px solid ${rgbaFromHex(accentHex, 0.15)}` }} />
            </div>
          )}
          {/* Stat block header */}
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', color: accent, letterSpacing: '0.06em', marginBottom: '0.15rem', fontWeight: 600 }}>{sb.name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            CR {sb.cr} · AC {sb.ac} · HP {sb.hp} · Speed {sb.speed}
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', padding: '0.75rem 0', borderTop: '0.5px solid var(--border)', borderBottom: '0.5px solid var(--border)', margin: '0.5rem 0' }}>
            {(['str','dex','con','int','wis','cha'] as const).map((stat) => (
              <StatRow key={stat} label={stat.toUpperCase()} value={sb[stat]} />
            ))}
          </div>

          {/* Metadata */}
          {((sb.savingThrows && sb.savingThrows.length > 0) || (sb.skills && sb.skills.length > 0) || sb.senses || sb.languages) && (
            <div style={{ marginBottom: '0.6rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {sb.savingThrows && sb.savingThrows.length > 0 && (
                <div><strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 600 }}>Saving Throws </strong>{sb.savingThrows.join(', ')}</div>
              )}
              {sb.skills && sb.skills.length > 0 && (
                <div><strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 600 }}>Skills </strong>{sb.skills.join(', ')}</div>
              )}
              {sb.senses && (
                <div><strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 600 }}>Senses </strong>{sb.senses}</div>
              )}
              {sb.languages && (
                <div><strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '0.75rem', fontWeight: 600 }}>Languages </strong>{sb.languages}</div>
              )}
            </div>
          )}

          {/* Traits */}
          {sb.traits && sb.traits.length > 0 && (
            <div style={{ marginBottom: '0.6rem' }}>
              {sb.traits.map((t, i) => (
                <p key={i} style={{ margin: '0.3rem 0', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  <EntryBody name={t.name} description={t.description} />
                </p>
              ))}
            </div>
          )}

          {sb.actions && sb.actions.length > 0 && <ActionList heading="ACTIONS" items={sb.actions} accent={accent} />}
          {sb.bonusActions && sb.bonusActions.length > 0 && <ActionList heading="BONUS ACTIONS" items={sb.bonusActions} accent={accent} />}
          {sb.reactions && sb.reactions.length > 0 && <ActionList heading="REACTIONS" items={sb.reactions} accent={accent} />}
          {sb.legendaryActions && sb.legendaryActions.length > 0 && <ActionList heading="LEGENDARY ACTIONS" items={sb.legendaryActions} accent={accent} />}
        </div>
      )}
    </div>
  )
}
