'use client'

import { useState, useEffect } from 'react'
import type { NPC } from '@/types'

const ALIGNMENT_COLORS: Record<string, string> = {
  Ally: 'var(--cyan)',
  Enemy: '#c0392b',
  Neutral: 'var(--gold)',
  Complex: 'var(--purple)',
}

const STATUS_COLORS: Record<string, string> = {
  Active: '#27ae60',
  Deceased: '#c0392b',
  Unknown: 'var(--gold-dim)',
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
  return ALIGNMENT_COLORS[npc.alignment] || 'var(--gold)'
}

function StatRow({ label, value }: { label: string; value: number }) {
  const mod = Math.floor((value - 10) / 2)
  const modStr = mod >= 0 ? `+${mod}` : `${mod}`
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{modStr}</div>
    </div>
  )
}

// Renders a stat block trait/action body. Handles both plain string descriptions and
// array-of-strings descriptions (used for spell lists where each line should break,
// with a hanging indent on wrapped continuation).
function EntryBody({ name, description }: { name: string; description: string | string[] }) {
  const strong = { color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '0.75rem' } as const
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

  return (
    <div style={{ background: '#0f0c09', border: `1px solid ${accent}33`, borderTop: `2px solid ${accent}`, borderRadius: '4px', padding: '1rem', marginTop: '1rem' }}>
      {sb.image && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sb.image} alt={sb.name} style={{ maxWidth: '100%', maxHeight: '280px', objectFit: 'contain', borderRadius: '3px', border: `1px solid ${accent}22` }} />
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', color: accent, letterSpacing: '0.06em' }}>{sb.name}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
            CR {sb.cr} · AC {sb.ac} · HP {sb.hp} · Speed {sb.speed}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.5rem', padding: '0.5rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', margin: '0.5rem 0' }}>
        {(['str','dex','con','int','wis','cha'] as const).map((stat) => (
          <StatRow key={stat} label={stat.toUpperCase()} value={sb[stat]} />
        ))}
      </div>

      {/* Metadata: skills / senses / languages */}
      {(sb.skills?.length || sb.senses || sb.languages || sb.savingThrows?.length) && (
        <div style={{ marginBottom: '0.5rem', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {sb.savingThrows && sb.savingThrows.length > 0 && (
            <div><strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '0.72rem' }}>Saving Throws </strong>{sb.savingThrows.join(', ')}</div>
          )}
          {sb.skills && sb.skills.length > 0 && (
            <div><strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '0.72rem' }}>Skills </strong>{sb.skills.join(', ')}</div>
          )}
          {sb.senses && (
            <div><strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '0.72rem' }}>Senses </strong>{sb.senses}</div>
          )}
          {sb.languages && (
            <div><strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', fontSize: '0.72rem' }}>Languages </strong>{sb.languages}</div>
          )}
        </div>
      )}

      {/* Traits */}
      {sb.traits && sb.traits.length > 0 && (
        <div style={{ marginBottom: '0.5rem' }}>
          {sb.traits.map((t, i) => (
            <p key={i} style={{ margin: '0.3rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <EntryBody name={t.name} description={t.description} />
            </p>
          ))}
        </div>
      )}

      {/* Actions */}
      {sb.actions && sb.actions.length > 0 && (
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: accent, letterSpacing: '0.12em', marginBottom: '0.3rem' }}>ACTIONS</div>
          {sb.actions.map((a, i) => (
            <p key={i} style={{ margin: '0.3rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <EntryBody name={a.name} description={a.description} />
            </p>
          ))}
        </div>
      )}

      {/* Bonus Actions */}
      {sb.bonusActions && sb.bonusActions.length > 0 && (
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: accent, letterSpacing: '0.12em', marginBottom: '0.3rem' }}>BONUS ACTIONS</div>
          {sb.bonusActions.map((a, i) => (
            <p key={i} style={{ margin: '0.3rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <EntryBody name={a.name} description={a.description} />
            </p>
          ))}
        </div>
      )}

      {/* Reactions */}
      {sb.reactions && sb.reactions.length > 0 && (
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: accent, letterSpacing: '0.12em', marginBottom: '0.3rem' }}>REACTIONS</div>
          {sb.reactions.map((a, i) => (
            <p key={i} style={{ margin: '0.3rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              <EntryBody name={a.name} description={a.description} />
            </p>
          ))}
        </div>
      )}

      {/* Legendary Actions */}
      {sb.legendaryActions && sb.legendaryActions.length > 0 && (
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: accent, letterSpacing: '0.12em', marginBottom: '0.3rem' }}>LEGENDARY ACTIONS</div>
          {sb.legendaryActions.map((a, i) => (
            <p key={i} style={{ margin: '0.3rem 0', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
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
  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '1.5rem' }}>
      {/* Header */}
      <div style={{ borderBottom: `2px solid ${accent}44`, paddingBottom: '1rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
          <span className="badge" style={{ color: ALIGNMENT_COLORS[npc.alignment], borderColor: ALIGNMENT_COLORS[npc.alignment] + '55', background: ALIGNMENT_COLORS[npc.alignment] + '11' }}>{npc.alignment.toUpperCase()}</span>
          <span className="badge" style={{ color: STATUS_COLORS[npc.status], borderColor: STATUS_COLORS[npc.status] + '55', background: STATUS_COLORS[npc.status] + '11' }}>{npc.status.toUpperCase()}</span>
          <span className="badge" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>CH.{npc.firstAppearance}</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', margin: '0 0 0.25rem', color: accent }}>{npc.name}</h1>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
          {npc.race} · {npc.role}
        </div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
          {npc.location} · {npc.arc}
        </div>
      </div>

      {/* Description */}
      <div className="card" style={{ borderLeftColor: accent, marginBottom: '1rem' }}>
        <p style={{ margin: 0, lineHeight: 1.75, color: 'var(--text-primary)' }}>{npc.description}</p>
      </div>

      {/* Personality */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '0.35rem' }}>PERSONALITY</div>
        <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{npc.personality}</p>
      </div>

      {/* Notes */}
      {npc.notes.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '0.35rem' }}>DM NOTES</div>
          {npc.notes.map((note, i) => (
            <div key={i} className="key-info-item">
              <p style={{ margin: 0, lineHeight: 1.65, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{note}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
        {npc.tags.map((tag) => (
          <span key={tag} className="badge" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', fontSize: '0.62rem' }}>{tag}</span>
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
      <div style={{ width: '270px', borderRight: '1px solid var(--border)', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        {/* Search */}
        <div style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.4rem', position: 'sticky', top: 0, background: 'var(--bg-base)', zIndex: 10 }}>
          <input className="search-input" placeholder="Search NPCs, creatures, notes..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ fontSize: '0.85rem' }} />
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            {['All', 'NPC', 'Creature', 'Boss'].map((t) => (
              <button key={t} className={`btn ${typeFilter === t ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: '0.62rem', padding: '0.2rem 0.6rem' }} onClick={() => setTypeFilter(t)}>{t}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
            {['All', 'Ally', 'Enemy', 'Complex', 'Neutral'].map((a) => (
              <button key={a} className={`btn ${alignmentFilter === a ? 'btn-primary' : 'btn-ghost'}`}
                style={{ fontSize: '0.62rem', padding: '0.2rem 0.6rem', borderColor: a !== 'All' ? ALIGNMENT_COLORS[a] + '66' : undefined, color: alignmentFilter === a ? undefined : a !== 'All' ? ALIGNMENT_COLORS[a] : undefined }}
                onClick={() => setAlignmentFilter(a)}>{a}</button>
            ))}
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            {filtered.length} of {npcs.length} entries
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {loading && <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading...</div>}
          {filtered.map((npc) => {
            const accent = getAccentColor(npc)
            const isCreature = npc.tags.includes('creature')
            return (
              <div key={npc.id} onClick={() => setSelected(npc)} style={{
                padding: '0.6rem 0.85rem', cursor: 'pointer', borderBottom: '1px solid var(--border)',
                background: selected?.id === npc.id ? 'var(--bg-hover)' : 'transparent',
                borderLeft: `2px solid ${selected?.id === npc.id ? accent : 'transparent'}`,
                transition: 'all 0.12s',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.1rem' }}>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.78rem', color: selected?.id === npc.id ? accent : 'var(--text-primary)', lineHeight: 1.2 }}>
                    {npc.name}
                  </span>
                  <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.58rem', color: STATUS_COLORS[npc.status], flexShrink: 0, marginLeft: '0.4rem' }}>
                    {npc.status === 'Active' ? '●' : npc.status === 'Deceased' ? '✕' : '?'}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.04em', lineHeight: 1.3 }}>
                  {isCreature ? '🐾 ' : ''}{npc.race} · Ch.{npc.firstAppearance}
                </div>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6rem', color: ALIGNMENT_COLORS[npc.alignment] + 'aa', marginTop: '0.1rem' }}>
                  {npc.alignment}
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
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>👥</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>Select an NPC or creature</div>
              <div style={{ fontSize: '0.85rem', marginTop: '0.35rem', color: 'var(--text-muted)' }}>{npcs.length} entries total</div>
            </div>
          </div>
        )}
        {selected && <NPCDetail npc={selected} />}
      </div>
    </div>
  )
}
