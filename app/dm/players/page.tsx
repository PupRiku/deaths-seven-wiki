export const metadata = {
  title: "Manage Players — Death's Seven",
}

export default function DmPlayersPage() {
  return (
    <div className="wiki-content fade-in">
      <div style={{ paddingBottom: '1rem', borderBottom: '0.5px solid var(--border)', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Manage Players</h1>
        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            fontWeight: 600,
            marginTop: '0.5rem',
          }}
        >
          Player tokens & sessions
        </p>
      </div>

      <div className="card">
        <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
          Player token management is coming soon. For now, the four player tokens are
          seeded automatically on first run and printed to the dev-server console.
        </p>
      </div>
    </div>
  )
}
