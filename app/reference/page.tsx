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

const ACT_COLORS = { 1: 'var(--cyan)', 2: 'var(--orange)', 3: 'var(--purple)' } as const

// ---- SINS TAB ----
function SinsTab() {
  const [selected, setSelected] = useState(SINS[0])
  return (
    <div style={{ display: 'flex', gap: '1.5rem', height: '100%' }}>
      {/* Sin selector */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '140px', flexShrink: 0 }}>
        {SINS.map((s) => (
          <button key={s.sin} onClick={() => setSelected(s)} style={{
            background: selected.sin === s.sin ? s.color + '22' : 'var(--bg-surface)',
            border: `1px solid ${selected.sin === s.sin ? s.color : 'var(--border)'}`,
            borderLeft: `3px solid ${s.color}`,
            borderRadius: '3px', padding: '0.5rem 0.75rem', cursor: 'pointer', textAlign: 'left',
            fontFamily: 'var(--font-heading)', fontSize: '0.78rem', color: selected.sin === s.sin ? s.color : 'var(--text-secondary)',
            letterSpacing: '0.06em', transition: 'all 0.12s',
          }}>
            {s.sin.toUpperCase()}
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>Ch.{s.chapter}</div>
          </button>
        ))}
        {/* Virtue tokens */}
        <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '3px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>VIRTUE TOKENS</div>
          {VIRTUE_TOKENS.map((t) => (
            <div key={t.sin} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.2rem' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.color, flexShrink: 0 }} />
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>{t.virtue}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sin detail */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ borderLeft: `3px solid ${selected.color}`, paddingLeft: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: selected.color, letterSpacing: '0.08em' }}>{selected.sin.toUpperCase()}</span>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>→ {selected.virtue}</span>
            <span className="badge" style={{ color: '#27ae60', borderColor: '#27ae6055', background: '#27ae6011', marginLeft: 'auto' }}>{selected.status}</span>
          </div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{selected.host} · Ch.{selected.chapter} · {selected.location}</div>
        </div>

        <p style={{ color: 'var(--text-primary)', lineHeight: 1.75, marginBottom: '1rem' }}>{selected.concept}</p>

        {[
          { label: 'SIPHON EFFECT', content: selected.siphonEffect, color: selected.color },
          { label: 'HOST FATE', content: selected.hostFate, color: '#27ae60' },
          { label: 'VIRTUE TOKEN', content: `${VIRTUE_TOKENS.find(t => t.sin.includes(selected.sin))?.token ?? '—'} — ${VIRTUE_TOKENS.find(t => t.sin.includes(selected.sin))?.counter ?? ''}`, color: 'var(--gold)' },
          { label: 'DM NOTES', content: selected.notes, color: 'var(--text-muted)' },
        ].map(({ label, content, color }) => (
          <div key={label} style={{ marginBottom: '0.85rem' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color, letterSpacing: '0.12em', marginBottom: '0.3rem' }}>{label}</div>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.92rem' }}>{content}</p>
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
            border: `1px solid ${act.color}55`, borderLeft: `3px solid ${act.color}`,
            borderRadius: '4px', padding: '0.6rem 1rem', cursor: 'pointer', textAlign: 'left',
            fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: act.color, letterSpacing: '0.08em',
            display: 'flex', justifyContent: 'space-between',
          }}>
            {act.label.toUpperCase()}
            <span style={{ opacity: 0.6 }}>{openAct === act.act ? '▲' : '▼'}</span>
          </button>
          {openAct === act.act && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginTop: '0.35rem', paddingLeft: '0.5rem' }}>
              {act.chapters.map((ch) => (
                <div key={ch.number} style={{ display: 'flex', gap: '0.75rem', padding: '0.5rem 0.75rem', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '3px', alignItems: 'flex-start' }}>
                  <div style={{ flexShrink: 0, textAlign: 'center', minWidth: '50px' }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>CH.{ch.number}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: act.color }}>Lv{ch.levels}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.78rem', color: 'var(--text-accent)', marginBottom: '0.15rem' }}>{ch.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{ch.summary}</div>
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
        {PARTY.map((pc) => (
          <button key={pc.player} onClick={() => setSelected(pc)} style={{
            background: selected.player === pc.player ? pc.color + '22' : 'var(--bg-surface)',
            border: `1px solid ${selected.player === pc.player ? pc.color : 'var(--border)'}`,
            borderLeft: `3px solid ${pc.color}`, borderRadius: '3px', padding: '0.5rem 0.75rem',
            cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-heading)', fontSize: '0.72rem',
            color: selected.player === pc.player ? pc.color : 'var(--text-secondary)', letterSpacing: '0.06em',
          }}>
            {pc.player}
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{pc.newRace}</div>
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ borderLeft: `3px solid ${selected.color}`, paddingLeft: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', color: selected.color, marginBottom: '0.15rem' }}>{selected.characterName}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{selected.newRace} {selected.newClass} · {selected.newBackground}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>HP {selected.hp} · AC {selected.ac}</div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.4rem', marginBottom: '1rem', padding: '0.6rem', background: 'var(--bg-surface)', borderRadius: '4px', border: '1px solid var(--border)' }}>
          {(['str','dex','con','int','wis','cha'] as const).map((stat) => {
            const val = selected.stats[stat]
            const mod = Math.floor((val - 10) / 2)
            return (
              <div key={stat} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{stat.toUpperCase()}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: stat === 'wis' && val <= 8 ? '#e74c3c' : 'var(--text-primary)' }}>{val}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>{mod >= 0 ? '+' : ''}{mod}</div>
              </div>
            )
          })}
        </div>

        {/* Past life */}
        <div style={{ marginBottom: '0.85rem', padding: '0.6rem 0.85rem', background: '#0d0a0700', border: '1px dashed var(--border)', borderRadius: '4px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '0.25rem' }}>PAST LIFE</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{selected.pastRace} {selected.pastClass} — {selected.pastRole}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.15rem' }}>{selected.pastDeath}</div>
        </div>

        {/* Arc */}
        <div style={{ marginBottom: '0.85rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '0.3rem' }}>PERSONAL ARC</div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.92rem' }}>{selected.personalArc}</p>
        </div>

        {/* True Reaper */}
        <div style={{ marginBottom: '0.85rem', padding: '0.6rem 0.85rem', background: 'var(--bg-surface)', border: `1px solid ${selected.color}44`, borderLeft: `3px solid ${selected.color}`, borderRadius: '4px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.62rem', color: selected.color, letterSpacing: '0.12em', marginBottom: '0.25rem' }}>TRUE REAPER</div>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>{selected.trueReaper}</p>
        </div>

        {/* Vulnerabilities */}
        <div style={{ marginBottom: '0.85rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.62rem', color: '#e74c3c', letterSpacing: '0.12em', marginBottom: '0.3rem' }}>KEY VULNERABILITIES</div>
          {selected.keyVulnerabilities.map((v, i) => (
            <div key={i} className="key-info-item"><p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{v}</p></div>
          ))}
        </div>

        {/* Special mechanics */}
        {'specialMechanics' in selected && (selected as typeof PARTY[2]).specialMechanics && (
          <div style={{ marginBottom: '0.85rem' }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.62rem', color: 'var(--purple)', letterSpacing: '0.12em', marginBottom: '0.3rem' }}>SPECIAL MECHANICS</div>
            {(selected as typeof PARTY[2]).specialMechanics!.map((m: string, i: number) => (
              <div key={i} className="key-info-item"><p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{m}</p></div>
            ))}
          </div>
        )}

        {/* Notes */}
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '0.3rem' }}>DM NOTES</div>
          {selected.notes.map((n, i) => (
            <div key={i} className="key-info-item"><p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{n}</p></div>
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
        {MECHANICS.map((m) => (
          <button key={m.id} onClick={() => setSelected(m)} style={{
            background: selected.id === m.id ? m.color + '22' : 'var(--bg-surface)',
            border: `1px solid ${selected.id === m.id ? m.color : 'var(--border)'}`,
            borderLeft: `3px solid ${m.color}`, borderRadius: '3px', padding: '0.45rem 0.75rem',
            cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-heading)', fontSize: '0.7rem',
            color: selected.id === m.id ? m.color : 'var(--text-secondary)', letterSpacing: '0.05em',
          }}>
            {m.name}
            <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{m.arc.split(' — ')[0]}</div>
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ borderLeft: `3px solid ${selected.color}`, paddingLeft: '1rem', marginBottom: '0.85rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', color: selected.color, letterSpacing: '0.06em' }}>{selected.name}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{selected.arc}</div>
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '1rem', fontStyle: 'italic' }}>{selected.summary}</p>
        {/* Dense rules block */}
        <div style={{ background: '#0a0807', border: `1px solid ${selected.color}33`, borderRadius: '4px', padding: '0.75rem 1rem' }}>
          {selected.rules.map((rule, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.6rem', padding: '0.3rem 0', borderBottom: i < selected.rules.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ color: selected.color, fontSize: '0.7rem', flexShrink: 0, marginTop: '0.15rem', fontFamily: 'var(--font-heading)' }}>▸</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.55 }}>{rule}</span>
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
          const sinColor = loc.sinArc ? `var(--sin-${loc.sinArc.toLowerCase()})` : 'var(--gold)'
          return (
            <button key={loc.id} onClick={() => setSelected(loc)} style={{
              background: selected.id === loc.id ? sinColor + '22' : 'var(--bg-surface)',
              border: `1px solid ${selected.id === loc.id ? sinColor : 'var(--border)'}`,
              borderLeft: `3px solid ${sinColor}`, borderRadius: '3px', padding: '0.45rem 0.75rem',
              cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-heading)', fontSize: '0.7rem',
              color: selected.id === loc.id ? sinColor : 'var(--text-secondary)', letterSpacing: '0.04em', lineHeight: 1.3,
            }}>
              {loc.name}
              <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{loc.type.split(' — ')[0]}</div>
            </button>
          )
        })}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {(() => {
          const sinColor = selected.sinArc ? `var(--sin-${selected.sinArc.toLowerCase()})` : 'var(--gold)'
          return (
            <>
              <div style={{ borderLeft: `3px solid ${sinColor}`, paddingLeft: '1rem', marginBottom: '1rem' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', color: sinColor }}>{selected.name}</div>
                {selected.altName && <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{selected.altName}</div>}
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                  <span className="badge" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', fontSize: '0.6rem' }}>{selected.type}</span>
                  {selected.sinArc && <span className="badge" style={{ color: sinColor, borderColor: sinColor + '55', background: sinColor + '11', fontSize: '0.6rem' }}>{selected.sinArc}</span>}
                  {selected.chapters.map((c) => <span key={c} className="badge" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', fontSize: '0.58rem' }}>Ch.{c}</span>)}
                </div>
              </div>
              <p style={{ color: 'var(--text-primary)', lineHeight: 1.75, marginBottom: '1rem' }}>{selected.description}</p>
              {selected.keyLocations.length > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: sinColor, letterSpacing: '0.12em', marginBottom: '0.35rem' }}>KEY LOCATIONS</div>
                  {selected.keyLocations.map((kl, i) => (
                    <div key={i} className="key-info-item"><p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{kl}</p></div>
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
        {FACTIONS.map((f) => (
          <button key={f.id} onClick={() => setSelected(f)} style={{
            background: selected.id === f.id ? f.color + '22' : 'var(--bg-surface)',
            border: `1px solid ${selected.id === f.id ? f.color : 'var(--border)'}`,
            borderLeft: `3px solid ${f.color}`, borderRadius: '3px', padding: '0.5rem 0.75rem',
            cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-heading)', fontSize: '0.7rem',
            color: selected.id === f.id ? f.color : 'var(--text-secondary)', letterSpacing: '0.04em', lineHeight: 1.3,
          }}>
            {f.name}
            <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{f.alignment}</div>
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ borderLeft: `3px solid ${selected.color}`, paddingLeft: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', color: selected.color }}>{selected.name}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{selected.type} · Leader: {selected.leader}</div>
        </div>
        <p style={{ color: 'var(--text-primary)', lineHeight: 1.75, marginBottom: '1rem' }}>{selected.description}</p>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: selected.color, letterSpacing: '0.12em', marginBottom: '0.35rem' }}>KEY MEMBERS</div>
          {selected.keyMembers.map((m, i) => (
            <div key={i} className="key-info-item"><p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{m}</p></div>
          ))}
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '0.35rem' }}>NOTES</div>
          {selected.notes.map((n, i) => (
            <div key={i} className="key-info-item"><p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{n}</p></div>
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
        {ITEMS.map((item) => (
          <button key={item.id} onClick={() => setSelected(item)} style={{
            background: selected.id === item.id ? 'var(--bg-hover)' : 'var(--bg-surface)',
            border: `1px solid ${selected.id === item.id ? 'var(--gold)' : 'var(--border)'}`,
            borderLeft: `3px solid var(--gold)`, borderRadius: '3px', padding: '0.5rem 0.75rem',
            cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-heading)', fontSize: '0.7rem',
            color: selected.id === item.id ? 'var(--gold)' : 'var(--text-secondary)', letterSpacing: '0.04em', lineHeight: 1.3,
          }}>
            {item.name}
            <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{item.type.split(' ')[0]}</div>
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '1rem', marginBottom: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', color: 'var(--gold)' }}>{selected.name}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{selected.type} · Ch.{selected.chapter} · {selected.location}</div>
        </div>
        <p style={{ color: 'var(--text-primary)', lineHeight: 1.75, marginBottom: '1rem' }}>{selected.description}</p>
        <div style={{ marginBottom: '1rem', background: '#0a0807', border: '1px solid var(--border-bright)', borderRadius: '4px', padding: '0.75rem 1rem' }}>
          {selected.properties.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.6rem', padding: '0.3rem 0', borderBottom: i < selected.properties.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ color: 'var(--gold)', fontSize: '0.7rem', flexShrink: 0, marginTop: '0.15rem' }}>◆</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{p}</span>
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
      <div style={{ display: 'flex', background: 'var(--bg-base)', borderBottom: '1px solid var(--border)', padding: '0 0.75rem', gap: '0.25rem', flexShrink: 0, flexWrap: 'wrap' }}>
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            background: 'none', border: 'none', borderBottom: `2px solid ${activeTab === tab.id ? 'var(--gold)' : 'transparent'}`,
            color: activeTab === tab.id ? 'var(--gold)' : 'var(--text-muted)',
            fontFamily: 'var(--font-heading)', fontSize: '0.72rem', letterSpacing: '0.08em',
            padding: '0.6rem 0.75rem', cursor: 'pointer', transition: 'all 0.15s',
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
