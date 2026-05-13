import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import CampaignHeader from '@/components/shared/CampaignHeader'

describe('CampaignHeader', () => {
  it('renders the campaign title', () => {
    render(<CampaignHeader />)
    expect(screen.getByRole('heading', { name: /Death's Seven/i })).toBeInTheDocument()
  })

  it('uses the display font on the heading', () => {
    render(<CampaignHeader />)
    const heading = screen.getByRole('heading')
    expect(heading.getAttribute('style') ?? '').toContain('var(--font-display)')
  })

  it('renders an optional subtitle', () => {
    render(<CampaignHeader subtitle="Player Companion" />)
    expect(screen.getByText('Player Companion')).toBeInTheDocument()
  })

  it('omits the subtitle when not provided', () => {
    render(<CampaignHeader />)
    expect(screen.queryByText('Player Companion')).toBeNull()
  })
})
