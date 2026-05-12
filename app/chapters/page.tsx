'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Chapter, ChapterMeta, Section, NPC } from '@/types'
import CreatureLink from '@/components/CreatureLink'
import { rgbaFromHex } from '@/lib/colors'

const ACT_LABELS = {
  1: 'Act I — Awakening',
  2: 'Act II — The Hunt',
  3: 'Act III — The Reckoning',
} as const

// Two parallel forms: CSS vars for live theming, hex for opacity-based tinting (badges).
const ACT_COLORS_VAR = {
  1: 'var(--cyan)',
  2: 'var(--orange)',
  3: 'var(--purple)',
} as const

const ACT_COLORS_HEX = {
  1: '#22d3ee',
  2: '#e8834a',
  3: '#8b5cf6',
} as const

const TYPE_COLORS_HEX: Record<string, string> = {
  scene: '#60a5fa',     // status-info
  encounter: '#f87171', // status-danger
  prose: '#7a4a2a',     // orange-dim
  npc: '#8b5cf6',       // purple
}

function Badge({ text, hex }: { text: string; hex: string }) {
  return (
    <span className="badge" style={{ color: hex, borderColor: rgbaFromHex(hex, 0.25), background: rgbaFromHex(hex, 0.08) }}>
      {text}
    </span>
  )
}

function renderCreatureLine(line: string, npcs: NPC[]): React.ReactNode {
  // Only NPCs with stat blocks are linkable. Sort by name length DESC so multi-word
  // names match before substrings (e.g. "Wrath-Infused Veteran" before "Veteran").
  const linkable = npcs.filter((n) => n.statBlock).sort((a, b) => b.name.length - a.name.length)
  for (const npc of linkable) {
    const escaped = npc.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\b${escaped}s?\\b`, 'i')
    const match = line.match(regex)
    if (match && match.index !== undefined) {
      const before = line.slice(0, match.index)
      const matched = match[0]
      const after = line.slice(match.index + matched.length)
      return (
        <>
          {before}
          <CreatureLink npc={npc} displayText={matched} />
          {after}
        </>
      )
    }
  }
  return line
}

function SectionBlock({ section, showDmNotes, npcs }: { section: Section; showDmNotes: boolean; npcs: NPC[] }) {
  const typeHex = TYPE_COLORS_HEX[section.type] || '#7a4a2a'
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div className="section-header">
        <div className={`section-type-bar ${section.type}`} />
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.875rem', color: 'var(--text-accent)', letterSpacing: '0.08em', fontWeight: 600 }}>
          {section.title}
        </span>
        <Badge text={section.type.toUpperCase()} hex={typeHex} />
      </div>
      {section.content && <p style={{ margin: '0 0 0.75rem', lineHeight: 1.75, color: 'var(--text-primary)' }}>{section.content}</p>}
      {section.boxedText && <div className="boxed-text">{section.boxedText}</div>}
      {section.boxedText2 && <div className="boxed-text">{section.boxedText2}</div>}
      {section.keyInfo && section.keyInfo.length > 0 && (
        <div style={{ margin: '0.5rem 0' }}>
          {section.keyInfo.map((info, i) => (
            <div key={i} className="key-info-item">
              <p style={{ margin: 0, lineHeight: 1.65, color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>{info}</p>
            </div>
          ))}
        </div>
      )}
      {section.creatures && section.creatures.length > 0 && (
        <div style={{ margin: '0.5rem 0' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--status-danger)', letterSpacing: '0.12em', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>CREATURES</span>
          {section.creatures.map((c, i) => (
            <p key={i} style={{ margin: '0.15rem 0 0.15rem 1rem', color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
              • {renderCreatureLine(c, npcs)}
            </p>
          ))}
        </div>
      )}
      {section.tactics && (
        <div style={{ margin: '0.5rem 0' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--status-warning)', letterSpacing: '0.12em', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>TACTICS</span>
          <p style={{ margin: '0 0 0 1rem', color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.65 }}>
            {Array.isArray(section.tactics) ? section.tactics.join(' ') : section.tactics}
          </p>
        </div>
      )}
      {section.dmNote && showDmNotes && (
        <div className="dm-note">
          <span className="dm-note-label">DM NOTE</span>
          <p>{section.dmNote}</p>
        </div>
      )}
      {section.bucket && (
        <div style={{ margin: '0.75rem 0', paddingLeft: '0.75rem', borderLeft: '2px solid var(--cyan)' }}>
          {(['discovery', 'encounter', 'aftermath'] as const).map((key) => {
            const text = section.bucket?.[key]
            if (!text) return null
            return (
              <div key={key} style={{ margin: '0.6rem 0' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--cyan)', letterSpacing: '0.12em', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>
                  {key.toUpperCase()}
                </span>
                <p style={{ margin: '0 0 0 1rem', color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.7 }}>
                  {text}
                </p>
              </div>
            )
          })}
          {section.bucket.dmNote && showDmNotes && (
            <div className="dm-note">
              <span className="dm-note-label">DM NOTE</span>
              <p>{section.bucket.dmNote}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ChaptersPage() {
  const [index, setIndex] = useState<ChapterMeta[]>([])
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null)
  const [activeNum, setActiveNum] = useState<number>(1)
  const [loading, setLoading] = useState(true)
  const [chapterLoading, setChapterLoading] = useState(false)
  const [showDmNotes, setShowDmNotes] = useState(true)
  const [npcs, setNpcs] = useState<NPC[]>([])

  useEffect(() => {
    fetch('/api/chapters').then((r) => r.json()).then((data) => { setIndex(data); setLoading(false) })
    fetch('/api/npcs').then((r) => r.json()).then(setNpcs).catch(() => {})
  }, [])

  const loadChapter = useCallback(async (num: number) => {
    if (num < 1 || num > 20) return
    setChapterLoading(true)
    setActiveNum(num)
    const res = await fetch(`/api/chapters?number=${num}`)
    const data = await res.json()
    setActiveChapter(data)
    setChapterLoading(false)
  }, [])

  useEffect(() => { if (index.length > 0 && !activeChapter) loadChapter(1) }, [index, activeChapter, loadChapter])

  const actChapters = (act: 1 | 2 | 3) => index.filter((c) => c.act === act)

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Chapter list */}
      <div style={{ width: '255px', borderRight: '0.5px solid var(--border)', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
        <div style={{ padding: '0.75rem 1rem', borderBottom: '0.5px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--bg-base)', zIndex: 10 }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.15em', fontWeight: 600 }}>ALL CHAPTERS</span>
          <button className={`btn ${showDmNotes ? 'btn-primary' : 'btn-ghost'}`} style={{ fontSize: '0.6875rem', padding: '0.25rem 0.6rem' }} onClick={() => setShowDmNotes(!showDmNotes)}>
            {showDmNotes ? '● DM ON' : '○ DM OFF'}
          </button>
        </div>
        {loading ? <div style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>Loading...</div> : (
          ([1, 2, 3] as const).map((act) => (
            <div key={act}>
              <div style={{ padding: '0.5rem 1rem', fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', letterSpacing: '0.15em', color: ACT_COLORS_VAR[act], borderBottom: '0.5px solid var(--border)', background: 'var(--bg-surface)', position: 'sticky', top: '37px', zIndex: 9, fontWeight: 600 }}>
                {ACT_LABELS[act].toUpperCase()}
              </div>
              {actChapters(act).map((meta) => {
                const isActive = activeNum === meta.number
                return (
                  <div key={meta.number} onClick={() => loadChapter(meta.number)} style={{ padding: '0.6rem 1rem', cursor: 'pointer', borderBottom: '0.5px solid var(--border)', background: isActive ? 'var(--bg-raised)' : 'transparent', borderLeft: `2px solid ${isActive ? ACT_COLORS_VAR[act] : 'transparent'}`, transition: 'all 0.15s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                      <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 600 }}>CH.{meta.number}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Lv{meta.levelStart}–{meta.levelEnd}</span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', color: isActive ? ACT_COLORS_VAR[act] : 'var(--text-secondary)', letterSpacing: '0.04em', lineHeight: 1.3, fontWeight: 600 }}>
                      {meta.title}
                    </div>
                  </div>
                )
              })}
            </div>
          ))
        )}
      </div>

      {/* Chapter content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {chapterLoading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-muted)' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', letterSpacing: '0.15em', fontWeight: 600 }}>Loading Chapter {activeNum}...</span>
          </div>
        )}
        {activeChapter && !chapterLoading && (
          <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 1.5rem' }} className="fade-in">
            {/* Nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <button className="btn btn-ghost" onClick={() => loadChapter(activeNum - 1)} disabled={activeNum <= 1} style={{ opacity: activeNum <= 1 ? 0.3 : 1 }}>← PREV</button>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.15em', fontWeight: 600 }}>CHAPTER {activeNum} OF 20</span>
              <button className="btn btn-ghost" onClick={() => loadChapter(activeNum + 1)} disabled={activeNum >= 20} style={{ opacity: activeNum >= 20 ? 0.3 : 1 }}>NEXT →</button>
            </div>
            {/* Header */}
            <div style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '0.5px solid var(--border-bright)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.15em', fontWeight: 600 }}>CHAPTER {activeChapter.number}</span>
                <Badge text={ACT_LABELS[activeChapter.act]} hex={ACT_COLORS_HEX[activeChapter.act]} />
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
                  <Badge text={`Start Lv${activeChapter.levelStart}`} hex="#4a5a78" />
                  <Badge text={`End Lv${activeChapter.levelEnd}`} hex="#34d399" />
                </div>
              </div>
              <h1 style={{ margin: '0 0 0.75rem', fontSize: '1.6rem' }}>{activeChapter.title}</h1>
              <div className="card" style={{ borderLeftColor: ACT_COLORS_VAR[activeChapter.act] }}>
                <p style={{ margin: 0, fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{activeChapter.summary}</p>
              </div>
            </div>
            {/* Sections */}
            {activeChapter.sections.map((section, i) => <SectionBlock key={i} section={section} showDmNotes={showDmNotes} npcs={npcs} />)}
            {/* Bottom nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1rem', borderTop: '0.5px solid var(--border)' }}>
              <button className="btn btn-ghost" onClick={() => loadChapter(activeNum - 1)} disabled={activeNum <= 1} style={{ opacity: activeNum <= 1 ? 0.3 : 1 }}>← PREV</button>
              <button className="btn btn-ghost" onClick={() => loadChapter(activeNum + 1)} disabled={activeNum >= 20} style={{ opacity: activeNum >= 20 ? 0.3 : 1 }}>NEXT →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
