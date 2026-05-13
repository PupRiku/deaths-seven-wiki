interface Props {
  title: string
  message?: string
}

export default function PlayerShell({ title, message = 'Coming Soon' }: Props) {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '50vh',
        gap: '0.75rem',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.75rem',
          color: 'var(--text-primary)',
          letterSpacing: '0.06em',
          margin: 0,
        }}
      >
        {title}
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 600,
          margin: 0,
        }}
      >
        {message}
      </p>
    </section>
  )
}
