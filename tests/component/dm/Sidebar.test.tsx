import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/navigation', () => ({
  usePathname: () => '/dm',
}))

import Sidebar from '@/components/dm/Sidebar'

describe('DM Sidebar', () => {
  it('points each nav link at a /dm/* route', () => {
    render(<Sidebar />)
    expect(screen.getByRole('link', { name: /Chapters/i })).toHaveAttribute('href', '/dm/chapters')
    expect(screen.getByRole('link', { name: /^NPCs$/i })).toHaveAttribute('href', '/dm/npcs')
    expect(screen.getByRole('link', { name: /Reference/i })).toHaveAttribute('href', '/dm/reference')
    expect(screen.getByRole('link', { name: /Encounter/i })).toHaveAttribute('href', '/dm/encounter')
    expect(screen.getByRole('link', { name: /Session Log/i })).toHaveAttribute('href', '/dm/session-log')
  })

  it('contains a "Manage Players" link to /dm/players', () => {
    render(<Sidebar />)
    expect(screen.getByRole('link', { name: /Manage Players/i })).toHaveAttribute('href', '/dm/players')
  })

  it('contains a "Reveals" link to /dm/reveals', () => {
    render(<Sidebar />)
    expect(screen.getByRole('link', { name: /Reveals/i })).toHaveAttribute('href', '/dm/reveals')
  })

  it('shows a DM View indicator', () => {
    render(<Sidebar />)
    expect(screen.getByLabelText(/DM View/i)).toBeInTheDocument()
  })

  it('exposes a sign-out button', () => {
    render(<Sidebar />)
    expect(screen.getByRole('button', { name: /Sign out/i })).toBeInTheDocument()
  })
})
