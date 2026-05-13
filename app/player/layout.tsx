import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import BottomTabs from '@/components/player/BottomTabs'
import { initDB } from '@/lib/db'
import { getSessionForRole } from '@/lib/auth'

export const metadata = {
  title: "Death's Seven — Player",
}

// Defense-in-depth: the Edge-runtime middleware can only check cookie presence,
// so we deep-validate the player_session against the DB here. Any forged or
// expired cookie sends the player back to /join.
export default async function PlayerLayout({ children }: { children: React.ReactNode }) {
  await initDB()
  const ctx = await getSessionForRole(await cookies(), 'player')
  if (!ctx) redirect('/join')

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-deep)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          background: 'var(--bg-base)',
          borderBottom: '0.5px solid var(--border)',
          padding: '0.85rem 1rem',
          textAlign: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 30,
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            color: 'var(--text-primary)',
            letterSpacing: '0.06em',
          }}
        >
          Death&apos;s Seven
        </div>
      </header>
      <main
        style={{
          flex: 1,
          width: '100%',
          maxWidth: '720px',
          marginInline: 'auto',
          padding: '1.25rem 1rem 5rem',
        }}
      >
        {children}
      </main>
      <BottomTabs />
    </div>
  )
}
