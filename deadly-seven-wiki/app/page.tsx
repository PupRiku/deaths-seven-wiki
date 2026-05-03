'use client'

import Link from 'next/link'

const QUICK_LINKS = [
  { icon: '📖', label: 'Chapters', sub: 'Full module content', href: '/chapters' },
  { icon: '👥', label: 'NPCs', sub: 'Searchable reference', href: '/npcs' },
  { icon: '⚔️', label: 'Encounter', sub: 'Initiative & stat blocks', href: '/encounter' },
  { icon: '📝', label: 'Session Log', sub: 'Live notes & export', href: '/session-log' },
  { icon: '📚', label: 'Reference', sub: 'Sins, locations, lore', href: '/reference' },
]

const SINS = [
  { name: 'Greed', host: 'Baron Avarus', ch: 9, color: '#f39c12', status: 'Active' },
  { name: 'Lust', host: 'The Matriarch', ch: 10, color: '#9b59b6', status: 'Active' },
  { name: 'Sloth', host: 'Pip', ch: 12, color: '#3498db', status: 'Active' },
  { name: 'Gluttony', host: 'Aldric Voss', ch: 11, color: '#e67e22', status: 'Active' },
  { name: 'Envy', host: 'Cassius Argente', ch: 13, color: '#2ecc71', status: 'Active' },
  { name: 'Wrath', host: 'General Draven', ch: 14, color: '#e74c3c', status: 'Active' },
  { name: 'Pride', host: 'King Kaelen (Doppelganger)', ch: 16, color: '#ecf0f1', status: 'Active' },
]

export default function Home() {
  return (
    <div className="wiki-content fade-in">
      {/* Header */}
      <div style={{ textAlign: 'center', paddingBottom: '2rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.2em', marginBottom: '0.5rem' }}>
          ☽ ✦ ☾
        </div>
        <h1 style={{ marginBottom: '0.5rem' }}>The Deadly Seven</h1>
        <p style={{ fontFamily: 'var(--font-heading)', fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.12em', fontStyle: 'italic' }}>
          Dungeon Master Campaign Bible
        </p>
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {QUICK_LINKS.map((link) => (
          <Link key={link.href} href={link.href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center', padding: '1.25rem 1rem' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'var(--orange)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-raised)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'var(--gold)'; (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-surface)'; }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{link.icon}</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.78rem', color: 'var(--text-accent)', letterSpacing: '0.08em' }}>{link.label}</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{link.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Seven Sins tracker */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>
          THE SEVEN SOULS OF SIN
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {SINS.map((sin) => (
            <div key={sin.name} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.5rem 0.75rem', background: 'var(--bg-surface)',
              border: '1px solid var(--border)', borderLeft: `3px solid ${sin.color}`,
              borderRadius: '4px',
            }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', color: sin.color, letterSpacing: '0.08em', width: '70px' }}>
                {sin.name.toUpperCase()}
              </span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flex: 1 }}>{sin.host}</span>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>Ch.{sin.ch}</span>
              <span className="badge" style={{ color: '#27ae60', borderColor: '#27ae6044', background: '#27ae6011', fontSize: '0.6rem' }}>
                {sin.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Party at a glance */}
      <div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>
          THE PARTY
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
          {[
            { player: 'Mikey', char: 'Rolando Ornasca', cls: 'Drow Sun Soul Monk', lvl: 3 },
            { player: 'Kilt', char: 'Michael Portsmith', cls: 'Halfling PDK Fighter', lvl: 3 },
            { player: 'Will', char: 'Thornvatore', cls: 'Dwarf Paladin of Devotion', lvl: 3 },
            { player: 'JT', char: 'Drazier "Gabriel"', cls: 'Tiefling Valor Bard', lvl: 3 },
          ].map((pc) => (
            <div key={pc.player} className="card" style={{ borderLeftColor: 'var(--cyan)' }}>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{pc.player}</div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.82rem', color: 'var(--text-accent)', margin: '0.15rem 0' }}>{pc.char}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{pc.cls}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
