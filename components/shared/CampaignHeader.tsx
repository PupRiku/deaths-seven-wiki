interface Props {
  subtitle?: string
  size?: 'sm' | 'md' | 'lg'
  align?: 'left' | 'center'
}

const TITLE_SIZES = {
  sm: '1.5rem',
  md: '2.25rem',
  lg: '3rem',
}

export default function CampaignHeader({ subtitle, size = 'lg', align = 'center' }: Props) {
  return (
    <header
      style={{
        textAlign: align,
        padding: align === 'center' ? '0 1rem' : 0,
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: TITLE_SIZES[size],
          color: 'var(--text-primary)',
          letterSpacing: '0.06em',
          margin: 0,
          lineHeight: 1.1,
        }}
      >
        Death&apos;s Seven
      </h1>
      {subtitle && (
        <p
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontWeight: 600,
            marginTop: '0.5rem',
          }}
        >
          {subtitle}
        </p>
      )}
    </header>
  )
}
