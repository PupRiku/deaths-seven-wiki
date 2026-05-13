import RevealManager from '@/components/dm/RevealManager/RevealManager'

export const metadata = { title: "Reveals — Death's Seven DM" }

// Server-side gating happens in the parent /dm layout. The Reveal Manager
// itself is fully client-side because it's interactive (filters, toggles,
// optimistic updates).
export default function RevealsPage() {
  return <RevealManager />
}
