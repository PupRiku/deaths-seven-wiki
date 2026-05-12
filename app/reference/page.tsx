'use client'

import { useState } from 'react'
import { SINS, VIRTUE_TOKENS, LOCATIONS, FACTIONS, ITEMS, MECHANICS, PARTY, TIMELINE } from '@/data/reference/index'

const TABS = [
  { id: 'sins', label: 'Seven Sins', icon: '⚉' },
  { id: 'timeline', label: 'Timeline', icon: '◈' },
  { id: 'party', label: 'Party', icon: '◉' },
  { id: 'mechanics', label: 'Mechanics', icon: '⚙' },
  { id: 'locations', label: 'Locations', icon: '⬡' },
  { id: 'factions', label: 'Factions', icon: '✦' },
  { id: 'items', label: 'Key Items', icon: '◆' },
] as const

type TabId = typeof TABS[number]['id']

// ---- SINS TAB ----
function SinsTab() {
  const [selected, setSelected] = useState(SINS[0])
  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: '100%' }}>
      {/* Sin selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '140px', flexShrink: 0 }}>
        {SINS.map((s) => {
          const borderColor = selected.sin === s.sin ? s.color : 'var(--border)'
          return (
          <button key={s.sin} onClick={() => setSelected(s)} style={{
            background: selected.sin === s.sin ? s.color + '22' : 'var(--bg-surface)',
            borderTop: `0.5px solid ${borderColor}`,
            borderRight: `0.5px solid ${borderColor}`,
            borderBottom: `0.5px solid ${borderColor}`,
            borderLeft: `2px solid ${s.color}`,
            borderRadius: 'var(--radius-md)', padding: '0.5rem 0.75rem', cursor: 'pointer', textAlign: 'left',
            fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', color: selected.sin === s.sin ? s.color : 'var(--text-secondary)',
            letterSpacing: '0.08em', transition: 'all 0.15s ease', fontWeight: 600,
          }}>
            {s.sin.toUpperCase()}
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.15rem', letterSpacing: 'normal' }}>Ch.{s.chapter}</div>
          </button>
          )
        })}
        {/* Virtue tokens */}
        <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '0.35rem', fontWeight: 600 }}>VIRTUE TOKENS</div>
          {VIRTUE_TOKENS.map((t) => (
            <div key={t.sin} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.color, flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{t.virtue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sin detail */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ borderLeft: `2px solid ${selected.color}`, paddingLeft: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', color: selected.color, letterSpacing: '0.08em', fontWeight: 600 }}>{selected.sin.toUpperCase()}</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>→ {selected.virtue}</span>
            <span className="badge" style={{ color: 'var(--status-success)', borderColor: 'rgba(52, 211, 153, 0.25)', background: 'rgba(52, 211, 153, 0.08)', marginLeft: 'auto' }}>{selected.status}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{selected.host} · Ch.{selected.chapter} · {selected.location}</div>
        </div>

        <p style={{ color: 'var(--text-primary)', lineHeight: 1.75, marginBottom: '1rem' }}>{selected.concept}</p>

        {[
          { label: 'SIPHON EFFECT', content: selected.siphonEffect, color: selected.color },
          { label: 'HOST FATE', content: selected.hostFate, color: 'var(--status-success)' },
          { label: 'VIRTUE TOKEN', content: `${VIRTUE_TOKENS.find(t => t.sin.includes(selected.sin))?.token ?? '—'} — ${VIRTUE_TOKENS.find(t => t.sin.includes(selected.sin))?.counter ?? ''}`, color: 'var(--orange)' },
          { label: 'DM NOTES', content: selected.notes, color: 'var(--text-muted)' },
        ].map(({ label, content, color }) => (
          <div key={label} style={{ marginBottom: '0.85rem' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color, letterSpacing: '0.12em', marginBottom: '0.3rem', fontWeight: 600 }}>{label}</div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.875rem' }}>{content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---- TIMELINE TAB ----
function TimelineTab() {
  const [openAct, setOpenAct] = useState<number>(1)
  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>
      {TIMELINE.map((act) => (
        <div key={act.act} style={{ marginBottom: '1rem' }}>
          <button onClick={() => setOpenAct(openAct === act.act ? 0 : act.act)} style={{
            width: '100%', background: openAct === act.act ? act.color + '22' : 'var(--bg-surface)',
            borderTop: `0.5px solid ${act.color}55`,
            borderRight: `0.5px solid ${act.color}55`,
            borderBottom: `0.5px solid ${act.color}55`,
            borderLeft: `2px solid ${act.color}`,
            borderRadius: 'var(--radius-lg)', padding: '0.6rem 1rem', cursor: 'pointer', textAlign: 'left',
            fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', color: act.color, letterSpacing: '0.08em', fontWeight: 600,
            display: 'flex', justifyContent: 'space-between',
          }}>
            {act.label.toUpperCase()}
            <span style={{ opacity: 0.6 }}>{openAct === act.act ? '▲' : '▼'}</span>
          </button>
          {openAct === act.act && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.35rem', paddingLeft: '0.5rem' }}>
              {act.chapters.map((ch) => (
                <div key={ch.number} style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--bg-surface)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-md)', alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, textAlign: 'center', minWidth: '50px' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 600 }}>CH.{ch.number}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: act.color }}>Lv{ch.levels}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', color: 'var(--text-accent)', marginBottom: '0.15rem', fontWeight: 600 }}>{ch.title}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{ch.summary}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ---- PARTY TAB ----
function PartyTab() {
  const [selected, setSelected] = useState(PARTY[0])
  return (
    <div style={{ display: 'flex', gap: '1rem', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '130px', flexShrink: 0 }}>
        {PARTY.map((pc) => {
          const borderColor = selected.player === pc.player ? pc.color : 'var(--border)'
          return (
          <button key={pc.player} onClick={() => setSelected(pc)} style={{
            background: selected.player === pc.player ? pc.color + '22' : 'var(--bg-surface)',
            borderTop: `0.5px solid ${borderColor}`,
            borderRight: `0.5px solid ${borderColor}`,
            borderBottom: `0.5px solid ${borderColor}`,
            borderLeft: `2px solid ${pc.color}`, borderRadius: 'var(--radius-md)', padding: '0.5rem 0.75rem',
            cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-heading)', fontSize: '0.75rem',
            color: selected.player === pc.player ? pc.color : 'var(--text-secondary)', letterSpacing: '0.08em', fontWeight: 600,
          }}>
            {pc.player}
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.1rem', letterSpacing: 'normal' }}>{pc.newRace}</div>
          </button>
          )
        })}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ borderLeft: `2px solid ${selected.color}`, paddingLeft: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: selected.color, marginBottom: '0.15rem', fontWeight: 600 }}>{selected.characterName}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>{selected.newRace} {selected.newClass} · {selected.newBackground}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>HP {selected.hp} · AC {selected.ac}</div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px', marginBottom: '1rem', padding: '0.6rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '0.5px solid var(--border)' }}>
          {(['str','dex','con','int','wis','cha'] as const).map((stat) => {
            const val = selected.stats[stat]
            const mod = Math.floor((val - 10) / 2)
            return (
              <div key={stat} style={{
                textAlign: 'center',
                padding: '0.4rem 0.25rem',
                background: 'rgba(34, 211, 238, 0.04)',
                border: '0.5px solid rgba(34, 211, 238, 0.1)',
                borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.625rem', color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{stat.toUpperCase()}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9375rem', color: stat === 'wis' && val <= 8 ? 'var(--status-danger)' : 'var(--cyan-bright)', fontWeight: 500 }}>{val}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{mod >= 0 ? '+' : ''}{mod}</div>
              </div>
            )
          })}
        </div>

        {/* Past life */}
        <div style={{ marginBottom: '0.85rem', padding: '0.6rem 0.85rem', background: 'transparent', border: '0.5px dashed var(--border-bright)', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '0.25rem', fontWeight: 600 }}>PAST LIFE</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8125rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{selected.pastRace} {selected.pastClass} — {selected.pastRole}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.15rem' }}>{selected.pastDeath}</div>
        </div>

        {/* Arc */}
        <div style={{ marginBottom: '0.85rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '0.3rem', fontWeight: 600 }}>PERSONAL ARC</div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.875rem' }}>{selected.personalArc}</p>
        </div>

        {/* True Reaper */}
        <div style={{ marginBottom: '0.85rem', padding: '0.6rem 0.85rem', background: 'var(--bg-surface)', borderTop: `0.5px solid ${selected.color}44`, borderRight: `0.5px solid ${selected.color}44`, borderBottom: `0.5px solid ${selected.color}44`, borderLeft: `2px solid ${selected.color}`, borderRadius: 'var(--radius-lg)' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: selected.color, letterSpacing: '0.12em', marginBottom: '0.25rem', fontWeight: 600 }}>TRUE REAPER</div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>{selected.trueReaper}</p>
        </div>

        {/* Vulnerabilities */}
        <div style={{ marginBottom: '0.85rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--status-danger)', letterSpacing: '0.12em', marginBottom: '0.3rem', fontWeight: 600 }}>KEY VULNERABILITIES</div>
          {selected.keyVulnerabilities.map((v, i) => (
            <div key={i} className="key-info-item"><p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{v}</p></div>
          ))}
        </div>

        {/* Special mechanics */}
        {'specialMechanics' in selected && (selected as typeof PARTY[2]).specialMechanics && (
          <div style={{ marginBottom: '0.85rem' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--purple)', letterSpacing: '0.12em', marginBottom: '0.3rem', fontWeight: 600 }}>SPECIAL MECHANICS</div>
            {(selected as typeof PARTY[2]).specialMechanics!.map((m: string, i: number) => (
              <div key={i} className="key-info-item"><p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{m}</p></div>
            ))}
          </div>
        )}

        {/* Notes */}
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '0.3rem', fontWeight: 600 }}>DM NOTES</div>
          {selected.notes.map((n, i) => (
            <div key={i} className="key-info-item"><p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{n}</p></div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---- MECHANICS TAB ----
function MechanicsTab() {
  const [selected, setSelected] = useState(MECHANICS[0])
  return (
    <div style={{ display: 'flex', gap: '1rem', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '160px', flexShrink: 0, overflowY: 'auto' }}>
        {MECHANICS.map((m) => {
          const borderColor = selected.id === m.id ? m.color : 'var(--border)'
          return (
          <button key={m.id} onClick={() => setSelected(m)} style={{
            background: selected.id === m.id ? m.color + '22' : 'var(--bg-surface)',
            borderTop: `0.5px solid ${borderColor}`,
            borderRight: `0.5px solid ${borderColor}`,
            borderBottom: `0.5px solid ${borderColor}`,
            borderLeft: `2px solid ${m.color}`, borderRadius: 'var(--radius-md)', padding: '0.45rem 0.75rem',
            cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-heading)', fontSize: '0.75rem',
            color: selected.id === m.id ? m.color : 'var(--text-secondary)', letterSpacing: '0.06em', fontWeight: 600,
          }}>
            {m.name}
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.1rem', letterSpacing: 'normal' }}>{m.arc.split(' — ')[0]}</div>
          </button>
          )
        })}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ borderLeft: `2px solid ${selected.color}`, paddingLeft: '1rem', marginBottom: '0.85rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: selected.color, letterSpacing: '0.06em', fontWeight: 600 }}>{selected.name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{selected.arc}</div>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1rem', fontStyle: 'italic' }}>{selected.summary}</p>
        {/* Dense rules block */}
        <div style={{ background: 'var(--bg-deep)', border: `0.5px solid ${selected.color}33`, borderRadius: 'var(--radius-lg)', padding: '0.75rem 1rem' }}>
          {selected.rules.map((rule, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.6rem', padding: '0.3rem 0', borderBottom: i < selected.rules.length - 1 ? '0.5px solid var(--border)' : 'none' }}>
              <span style={{ color: selected.color, fontSize: '0.75rem', flexShrink: 0, marginTop: '0.15rem' }}>▸</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.55 }}>{rule}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---- LOCATIONS TAB ----
function LocationsTab() {
  const [selected, setSelected] = useState(LOCATIONS[0])
  return (
    <div style={{ display: 'flex', gap: '1rem', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '170px', flexShrink: 0, overflowY: 'auto' }}>
        {LOCATIONS.map((loc) => {
          const sinColor = loc.sinArc ? `var(--sin-${loc.sinArc.toLowerCase()})` : 'var(--orange)'
          const borderColor = selected.id === loc.id ? sinColor : 'var(--border)'
          return (
            <button key={loc.id} onClick={() => setSelected(loc)} style={{
              background: selected.id === loc.id ? 'var(--bg-raised)' : 'var(--bg-surface)',
              borderTop: `0.5px solid ${borderColor}`,
              borderRight: `0.5px solid ${borderColor}`,
              borderBottom: `0.5px solid ${borderColor}`,
              borderLeft: `2px solid ${sinColor}`, borderRadius: 'var(--radius-md)', padding: '0.45rem 0.75rem',
              cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-heading)', fontSize: '0.75rem',
              color: selected.id === loc.id ? sinColor : 'var(--text-secondary)', letterSpacing: '0.06em', lineHeight: 1.3, fontWeight: 600,
            }}>
              {loc.name}
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.1rem', letterSpacing: 'normal' }}>{loc.type.split(' — ')[0]}</div>
            </button>
          )
        })}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {(() => {
          const sinColor = selected.sinArc ? `var(--sin-${selected.sinArc.toLowerCase()})` : 'var(--orange)'
          return (
            <>
              <div style={{ borderLeft: `2px solid ${sinColor}`, paddingLeft: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: sinColor, fontWeight: 600 }}>{selected.name}</div>
                {selected.altName && <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{selected.altName}</div>}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                  <span className="badge" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>{selected.type}</span>
                  {selected.sinArc && <span className="badge" style={{ color: sinColor, borderColor: 'var(--border)', background: 'transparent' }}>{selected.sinArc}</span>}
                  {selected.chapters.map((c) => <span key={c} className="badge" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>Ch.{c}</span>)}
                </div>
              </div>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.75, marginBottom: '1rem' }}>{selected.description}</p>
              {selected.keyLocations.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: sinColor, letterSpacing: '0.12em', marginBottom: '0.35rem', fontWeight: 600 }}>KEY LOCATIONS</div>
                  {selected.keyLocations.map((kl, i) => (
                    <div key={i} className="key-info-item"><p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{kl}</p></div>
                  ))}
                </div>
              )}
              <div className="dm-note"><span className="dm-note-label">DM NOTE</span><p>{selected.notes}</p></div>
            </>
          )
        })()}
      </div>
    </div>
  )
}

// ---- FACTIONS TAB ----
function FactionsTab() {
  const [selected, setSelected] = useState(FACTIONS[0])
  return (
    <div style={{ display: 'flex', gap: '1rem', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '150px', flexShrink: 0 }}>
        {FACTIONS.map((f) => {
          const borderColor = selected.id === f.id ? f.color : 'var(--border)'
          return (
          <button key={f.id} onClick={() => setSelected(f)} style={{
            background: selected.id === f.id ? 'var(--bg-raised)' : 'var(--bg-surface)',
            borderTop: `0.5px solid ${borderColor}`,
            borderRight: `0.5px solid ${borderColor}`,
            borderBottom: `0.5px solid ${borderColor}`,
            borderLeft: `2px solid ${f.color}`, borderRadius: 'var(--radius-md)', padding: '0.5rem 0.75rem',
            cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-heading)', fontSize: '0.75rem',
            color: selected.id === f.id ? f.color : 'var(--text-secondary)', letterSpacing: '0.06em', lineHeight: 1.3, fontWeight: 600,
          }}>
            {f.name}
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.1rem', letterSpacing: 'normal' }}>{f.alignment}</div>
          </button>
          )
        })}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ borderLeft: `2px solid ${selected.color}`, paddingLeft: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: selected.color, fontWeight: 600 }}>{selected.name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{selected.type} · Leader: {selected.leader}</div>
        </div>
        <p style={{ color: 'var(--text-primary)', lineHeight: 1.75, marginBottom: '1rem' }}>{selected.description}</p>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: selected.color, letterSpacing: '0.12em', marginBottom: '0.35rem', fontWeight: 600 }}>KEY MEMBERS</div>
          {selected.keyMembers.map((m, i) => (
            <div key={i} className="key-info-item"><p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{m}</p></div>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6875rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '0.35rem', fontWeight: 600 }}>NOTES</div>
          {selected.notes.map((n, i) => (
            <div key={i} className="key-info-item"><p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{n}</p></div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---- ITEMS TAB ----
function ItemsTab() {
  const [selected, setSelected] = useState(ITEMS[0])
  return (
    <div style={{ display: 'flex', gap: '1rem', height: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', width: '150px', flexShrink: 0 }}>
        {ITEMS.map((item) => {
          const borderColor = selected.id === item.id ? 'var(--orange)' : 'var(--border)'
          return (
          <button key={item.id} onClick={() => setSelected(item)} style={{
            background: selected.id === item.id ? 'var(--bg-raised)' : 'var(--bg-surface)',
            borderTop: `0.5px solid ${borderColor}`,
            borderRight: `0.5px solid ${borderColor}`,
            borderBottom: `0.5px solid ${borderColor}`,
            borderLeft: `2px solid var(--orange)`, borderRadius: 'var(--radius-md)', padding: '0.5rem 0.75rem',
            cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-heading)', fontSize: '0.75rem',
            color: selected.id === item.id ? 'var(--orange)' : 'var(--text-secondary)', letterSpacing: '0.06em', lineHeight: 1.3, fontWeight: 600,
          }}>
            {item.name}
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.1rem', letterSpacing: 'normal' }}>{item.type.split(' ')[0]}</div>
          </button>
          )
        })}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ borderLeft: '2px solid var(--orange)', paddingLeft: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: 'var(--orange)', fontWeight: 600 }}>{selected.name}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{selected.type} · Ch.{selected.chapter} · {selected.location}</div>
        </div>
        <p style={{ color: 'var(--text-primary)', lineHeight: 1.75, marginBottom: '1rem' }}>{selected.description}</p>
        <div style={{ marginBottom: '1rem', background: 'var(--bg-deep)', border: '0.5px solid var(--border-bright)', borderRadius: 'var(--radius-lg)', padding: '0.75rem 1rem' }}>
          {selected.properties.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.6rem', padding: '0.3rem 0', borderBottom: i < selected.properties.length - 1 ? '0.5px solid var(--border)' : 'none' }}>
              <span style={{ color: 'var(--orange)', fontSize: '0.75rem', flexShrink: 0, marginTop: '0.15rem' }}>◆</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{p}</span>
            </div>
          ))}
        </div>
        <div className="dm-note"><span className="dm-note-label">DM NOTE</span><p>{selected.notes}</p></div>
      </div>
    </div>
  )
}

// ---- MAIN PAGE ----
export default function ReferencePage() {
  const [activeTab, setActiveTab] = useState<TabId>('sins')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', background: 'var(--bg-base)', borderBottom: '0.5px solid var(--border)', padding: '0 0.75rem', gap: '0.25rem', flexShrink: 0, flexWrap: 'wrap' }}>
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab.id ? 'var(--orange)' : 'transparent'}`,
            color: activeTab === tab.id ? 'var(--orange)' : 'var(--text-muted)',
            fontFamily: 'var(--font-heading)', fontSize: '0.75rem', letterSpacing: '0.1em', fontWeight: 600,
            padding: '0.6rem 0.75rem', cursor: 'pointer', transition: 'all 0.15s ease',
            display: 'flex', alignItems: 'center', gap: '0.4rem',
          }}>
            <span style={{ fontFamily: 'serif', fontSize: '0.9rem' }}>{tab.icon}</span>
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', padding: '1.25rem' }}>
        {activeTab === 'sins' && <SinsTab />}
        {activeTab === 'timeline' && <TimelineTab />}
        {activeTab === 'party' && <PartyTab />}
        {activeTab === 'mechanics' && <MechanicsTab />}
        {activeTab === 'locations' && <LocationsTab />}
        {activeTab === 'factions' && <FactionsTab />}
        {activeTab === 'items' && <ItemsTab />}
      </div>
    </div>
  )
}
