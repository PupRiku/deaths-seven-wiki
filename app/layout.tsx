import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "Death's Seven",
  description: "Campaign companion for Death's Seven",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}
