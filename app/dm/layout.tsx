import Sidebar from '@/components/dm/Sidebar'

export const metadata = {
  title: "Death's Seven — DM Wiki",
}

export default function DmLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="wiki-layout">
      <Sidebar />
      <main className="wiki-main">{children}</main>
    </div>
  )
}
