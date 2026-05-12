'use client'

import { useState, useEffect } from 'react'
import { IconUsers } from '@tabler/icons-react'
import type { NPC } from '@/types'

const ALIGNMENT_COLORS: Record<string, string> = {
  Ally: 'var(--cyan)',
  Enemy: 'var(--status-danger)',
  Neutral: 'var(--orange)',
  Complex: 'var(--purple)',
}

const STATUS_COLORS: Record<string, string> = {
  Active: 'var(--status-success)',
  Deceased: 'var(--status-danger)',
  Unknown: 'var(--orange-dim)',
  Imprisoned: 'var(--purple)',
}

const SIN_COLORS: Record<string, string> = {
  greed: 'var(--sin-greed)',
  lust: 'var(--sin-lust)',
  sloth: 'var(--sin-sloth)',
  gluttony: 'var(--sin-gluttony)',
  envy: 'var(--sin-envy)',
  wrath: 'var(--sin-wrath)',
  pride: 'var(--sin-pride)',
}

function getAccentColor(npc: NPC): string {
  const sinTag = npc.tags.find((t) => SIN_COLORS[t])
  if (sinTag) return SIN_COLORS[sinTag]
  return ALIGNMENT_COLORS[npc.alignment] || 'var(--orange)'
}

// Alignment colors live as CSS vars so the badge opacity helpers need raw hex.
const ALIGNMENT_HEX: Record<string, string> = {
  Ally: '#22d3ee',
  Enemy: '#f87171',
  Neutral: '#e8834a',
  Complex: '#8b5cf6',
}

const STATUS_HEX: Record<string, string> = {
  Active: '#34d399',
  Deceased: '#f87171',
  Unknown: '#7a4a2a',
  Imprisoned: '#8b5cf6',
}

function rgbaFromHex(hex: string, alpha: number) {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function StatRow({ label, value }: { label: string; value: number }) {
  const mod = Math.floor((value - 10) / 2)
  const modStr = mod >= 0 ? `+${mod}` : `${mod}`
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
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-secondary)' }}>{modStr}</div>
    </div>
  )
}

// Renders a stat block trait/action body. Handles both plain string descriptions and
// array-of-strings descriptions (used for spell lists where each line should break,
// with a hanging indent on wrapped continuation).
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

function StatBlock({ npc }: { npc: NPC }) {
  const sb = npc.statBlock
  if (!sb) return null
  const accent = getAccentColor(npc)
  const accentHex = SIN_COLORS[npc.tags.find((t) => SIN_COLORS[t]) || ''] ? undefined : ALIGNMENT_HEX[npc.alignment]
  // For sin-tagged NPCs we still want a working border opacity — fall back to orange.
  const accentRgba = (alpha: number) => accentHex ? rgbaFromHex(accentHex, alpha) : rgbaFromHex('#e8834a', alpha)

  return (
    <div style={{
      background: 'var(--bg-base)',
      border: `0.5px solid ${accentRgba(0.2)}`,
      borderTop: `2px solid ${accent}`,
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-lg)',
      marginTop: 'var(--space-lg)',
    }}>
      {sb.image && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sb.image} alt={sb.name} style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain', borderRadius: 'var(--radius-md)', border: `0.5px solid ${accentRgba(0.15)}` }} />
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', color: accent, letterSpacing: '0.06em', fontWeight: 600 }}>{sb.name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            CR {sb.cr} · AC {sb.ac} · HP {sb.hp} · Speed {sb.speed}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', padding: '0.75rem 0', borderTop: '0.5px solid var(--border)', borderBottom: '0.5px solid var(--border)', margin: '0.5rem 0' }}>
        {(['str','dex','con','int','wis','cha'] as const).map((stat) => (
          <StatRow key={stat} label={stat.toUpperCase()} value={sb[stat]} />
        ))}
      </div>

      {/* Metadata: skills / senses / languages */}
      {(sb.skills?.length || sb.senses || sb.languages || sb.savingThrows?.length) && (
        <div style={{ marginBottom: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
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
        <div style={{ marginBottom: '0.5rem' }}>
          {sb.traits.map((t, i) => (
            <p key={i} style={{ margin: '0.3rem 0', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <EntryBody name={t.name} description={t.description} />
            </p>
          ))}
        </div>
      )}

      {/* Actions */}
      {sb.actions && sb.actions.length > 0 && (
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: accent, letterSpacing: '0.12em', marginBottom: '0.3rem', fontWeight: 600 }}>ACTIONS</div>
          {sb.actions.map((a, i) => (
            <p key={i} style={{ margin: '0.3rem 0', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <EntryBody name={a.name} description={a.description} />
            </p>
          ))}
        </div>
      )}

      {/* Bonus Actions */}
      {sb.bonusActions && sb.bonusActions.length > 0 && (
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: accent, letterSpacing: '0.12em', marginBottom: '0.3rem', fontWeight: 600 }}>BONUS ACTIONS</div>
          {sb.bonusActions.map((a, i) => (
            <p key={i} style={{ margin: '0.3rem 0', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <EntryBody name={a.name} description={a.description} />
            </p>
          ))}
        </div>
      )}

      {/* Reactions */}
      {sb.reactions && sb.reactions.length > 0 && (
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: accent, letterSpacing: '0.12em', marginBottom: '0.3rem', fontWeight: 600 }}>REACTIONS</div>
          {sb.reactions.map((a, i) => (
            <p key={i} style={{ margin: '0.3rem 0', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <EntryBody name={a.name} description={a.description} />
            </p>
          ))}
        </div>
      )}

      {/* Legendary Actions */}
      {sb.legendaryActions && sb.legendaryActions.length > 0 && (
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: accent, letterSpacing: '0.12em', marginBottom: '0.3rem', fontWeight: 600 }}>LEGENDARY ACTIONS</div>
          {sb.legendaryActions.map((a, i) => (
            <p key={i} style={{ margin: '0.3rem 0', fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <EntryBody name={a.name} description={a.description} />
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

function NPCDetail({ npc }: { npc: NPC }) {
  const accent = getAccentColor(npc)
  const alignmentHex = ALIGNMENT_HEX[npc.alignment]
  const statusHex = STATUS_HEX[npc.status]
  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ borderBottom: `2px solid ${rgbaFromHex(alignmentHex || '#e8834a', 0.3)}`, paddingBottom: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
          <span className="badge" style={{ color: ALIGNMENT_COLORS[npc.alignment], borderColor: rgbaFromHex(alignmentHex, 0.25), background: rgbaFromHex(alignmentHex, 0.08) }}>{npc.alignment.toUpperCase()}</span>
          <span className="badge" style={{ color: STATUS_COLORS[npc.status], borderColor: rgbaFromHex(statusHex, 0.25), background: rgbaFromHex(statusHex, 0.08) }}>{npc.status.toUpperCase()}</span>
          <span className="badge" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>CH.{npc.firstAppearance}</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem', color: accent }}>{npc.name}</h1>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.06em', fontWeight: 600 }}>
          {npc.race} · {npc.role}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
          {npc.location} · {npc.arc}
        </div>
      </div>

      {/* Description */}
      <div className="card" style={{ borderLeftColor: accent, marginBottom: '1rem' }}>
        <p style={{ margin: 0, lineHeight: 1.75, color: 'var(--text-primary)' }}>{npc.description}</p>
      </div>

      {/* Personality */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '0.35rem', fontWeight: 600 }}>PERSONALITY</div>
        <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{npc.personality}</p>
      </div>

      {/* Notes */}
      {npc.notes.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.15em', marginBottom: '0.35rem', fontWeight: 600 }}>DM NOTES</div>
          {npc.notes.map((note, i) => (
            <div key={i} className="key-info-item">
              <p style={{ margin: 0, lineHeight: 1.65, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{note}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
        {npc.tags.map((tag) => (
          <span key={tag} className="badge" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>{tag}</span>
        ))}
      </div>

      {/* Stat Block */}
      <StatBlock npc={npc} />
    </div>
  )
}

export default function NPCsPage() {
  const [npcs, setNpcs] = useState<NPC[]>([])
  const [filtered, setFiltered] = useState<NPC[]>([])
  const [selected, setSelected] = useState<NPC | null>(null)
  const [search, setSearch] = useState('')
  const [alignmentFilter, setAlignmentFilter] = useState<string>('All')
  const [typeFilter, setTypeFilter] = useState<string>('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/npcs').then((r) => r.json()).then((data) => {
      setNpcs(data)
      setFiltered(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    let result = [...npcs]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter((n) =>
        n.name.toLowerCase().includes(q) ||
        n.role.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        n.tags.some((t) => t.includes(q)) ||
        n.notes.some((note) => note.toLowerCase().includes(q))
      )
    }
    if (alignmentFilter !== 'All') result = result.filter((n) => n.alignment === alignmentFilter)
    if (typeFilter === 'Boss') result = result.filter((n) => n.tags.includes('boss'))
    else if (typeFilter === 'Creature') result = result.filter((n) => n.tags.includes('creature'))
    else if (typeFilter === 'NPC') result = result.filter((n) => !n.tags.includes('creature'))
    setFiltered(result)
  }, [search, alignmentFilter, typeFilter, npcs])

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left panel */}
      <div style={{ width: '270px', borderRight: '0.5px solid var(--border)', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Search */}
        <div style={{ padding: '0.75rem', borderBottom: '0.5px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.4rem', position: 'sticky', top: 0, background: 'var(--bg-base)', zIndex: 10 }}>
          <input className="search-input" placeholder="Search NPCs, creatures, notes..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ fontSize: '0.8125rem' }} />
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            {['All', 'NPC', 'Creature', 'Boss'].map((t) => (
              <button key={t} className={`btn ${typeFilter === t ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: '0.6875rem', padding: '0.25rem 0.6rem' }} onClick={() => setTypeFilter(t)}>{t}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            {['All', 'Ally', 'Enemy', 'Complex', 'Neutral'].map((a) => (
              <button key={a} className={`btn ${alignmentFilter === a ? 'btn-primary' : 'btn-ghost'}`}
                style={{
                  fontSize: '0.6875rem',
                  padding: '0.25rem 0.6rem',
                  borderColor: a !== 'All' && alignmentFilter !== a ? rgbaFromHex(ALIGNMENT_HEX[a], 0.4) : undefined,
                  color: a !== 'All' && alignmentFilter !== a ? ALIGNMENT_COLORS[a] : undefined,
                }}
                onClick={() => setAlignmentFilter(a)}>{a}</button>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.12em', fontWeight: 600 }}>
            {filtered.length} of {npcs.length} entries
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading && <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading...</div>}
          {filtered.map((npc) => {
            const accent = getAccentColor(npc)
            return (
              <div key={npc.id} onClick={() => setSelected(npc)} style={{
                padding: '0.6rem 0.85rem', cursor: 'pointer', borderBottom: '0.5px solid var(--border)',
                background: selected?.id === npc.id ? 'var(--bg-hover)' : 'transparent',
                borderLeft: `2px solid ${selected?.id === npc.id ? accent : 'transparent'}`,
                transition: 'all 0.15s ease',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.1rem' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', color: selected?.id === npc.id ? accent : 'var(--text-primary)', lineHeight: 1.2, fontWeight: 600 }}>
                    {npc.name}
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.625rem', color: STATUS_COLORS[npc.status], flexShrink: 0, marginLeft: '0.4rem' }}>
                    {npc.status === 'Active' ? '●' : npc.status === 'Deceased' ? '✕' : '?'}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                  {npc.race} · Ch.{npc.firstAppearance}
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.625rem', color: ALIGNMENT_COLORS[npc.alignment], opacity: 0.75, marginTop: '0.1rem', letterSpacing: '0.08em' }}>
                  {npc.alignment.toUpperCase()}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {!selected && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center', color: 'var(--cyan)' }}>
                <IconUsers size={40} stroke={1.5} />
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', letterSpacing: '0.12em', fontWeight: 600 }}>Select an NPC or creature</div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', marginTop: '0.35rem', color: 'var(--text-muted)' }}>{npcs.length} entries total</div>
            </div>
          </div>
        )}
        {selected && <NPCDetail npc={selected} />}
      </div>
    </div>
  )
}
