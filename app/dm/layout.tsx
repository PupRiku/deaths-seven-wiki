import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/dm/Sidebar'
import { initDB } from '@/lib/db'
import { getSessionForRole } from '@/lib/auth'

export const metadata = {
  title: "Death's Seven — DM Wiki",
}

// Defense-in-depth: the Edge-runtime middleware can only check cookie presence,
// so we deep-validate the dm_session against the DB here in the server layout.
// Any forged or expired cookie sends the user back to the role picker.
export default async function DmLayout({ children }: { children: React.ReactNode }) {
  await initDB()
  const ctx = await getSessionForRole(await cookies(), 'dm')
  if (!ctx) redirect('/?role=dm')

  return (
    <div className="wiki-layout">
      <Sidebar />
      <main className="wiki-main">{children}</main>
    </div>
  )
}
