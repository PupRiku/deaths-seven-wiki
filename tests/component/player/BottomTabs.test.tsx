import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

const mockPathname = vi.fn(() => '/player')
vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

import BottomTabs from '@/components/player/BottomTabs'

beforeEach(() => {
  mockPathname.mockReturnValue('/player')
})

describe('BottomTabs', () => {
  it('renders four tabs', () => {
    render(<BottomTabs />)
    for (const label of ['Dashboard', 'World', 'Party', 'Journal']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
  })

  it('points each tab to its correct route', () => {
    render(<BottomTabs />)
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('href', '/player')
    expect(screen.getByRole('link', { name: 'World' })).toHaveAttribute('href', '/player/world')
    expect(screen.getByRole('link', { name: 'Party' })).toHaveAttribute('href', '/player/party')
    expect(screen.getByRole('link', { name: 'Journal' })).toHaveAttribute('href', '/player/journal')
  })

  it('marks the Dashboard tab active when pathname is /player', () => {
    mockPathname.mockReturnValue('/player')
    render(<BottomTabs />)
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'World' })).not.toHaveAttribute('aria-current')
  })

  it('marks the World tab active when pathname is /player/world', () => {
    mockPathname.mockReturnValue('/player/world')
    render(<BottomTabs />)
    expect(screen.getByRole('link', { name: 'World' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Dashboard' })).not.toHaveAttribute('aria-current')
  })

  it('exposes a navigation landmark', () => {
    render(<BottomTabs />)
    expect(screen.getByRole('navigation', { name: /Player navigation/i })).toBeInTheDocument()
  })
})
