import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockPush = vi.fn()
const mockSearch = { get: vi.fn((_key: string): string | null => null) }

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => mockSearch,
}))

import LandingPage from '@/app/page'

beforeEach(() => {
  mockPush.mockReset()
  mockSearch.get.mockImplementation(() => null)
  vi.spyOn(globalThis, 'fetch').mockReset()
})

describe('Landing page', () => {
  it('renders the campaign title', () => {
    render(<LandingPage />)
    expect(screen.getByRole('heading', { name: /Death's Seven/i })).toBeInTheDocument()
  })

  it('shows DM and Player entry options by default', () => {
    render(<LandingPage />)
    expect(screen.getByRole('button', { name: /Enter as Dungeon Master/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Enter as Player/i })).toHaveAttribute('href', '/join')
  })

  it('switches to the DM passphrase form when ?role=dm is present', async () => {
    mockSearch.get.mockImplementation((k: string) => (k === 'role' ? 'dm' : null))
    render(<LandingPage />)
    await waitFor(() => {
      expect(screen.getByLabelText(/DM Passphrase/i)).toBeInTheDocument()
    })
  })

  it('reveals the DM passphrase form when DM option is clicked', async () => {
    const user = userEvent.setup()
    render(<LandingPage />)
    await user.click(screen.getByRole('button', { name: /Enter as Dungeon Master/i }))
    expect(screen.getByLabelText(/DM Passphrase/i)).toBeInTheDocument()
  })

  it('submits passphrase to /api/auth/dm and redirects to /dm on success', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    vi.spyOn(globalThis, 'fetch').mockImplementation(fetchMock as never)

    render(<LandingPage />)
    await user.click(screen.getByRole('button', { name: /Enter as Dungeon Master/i }))
    await user.type(screen.getByLabelText(/DM Passphrase/i), 'secret')
    await user.click(screen.getByRole('button', { name: /Enter the Wiki/i }))

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/auth/dm',
        expect.objectContaining({ method: 'POST' })
      )
      expect(mockPush).toHaveBeenCalledWith('/dm')
    })
  })

  it('shows an error message on failed DM login', async () => {
    const user = userEvent.setup()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'Invalid passphrase' }), { status: 401 })
    )

    render(<LandingPage />)
    await user.click(screen.getByRole('button', { name: /Enter as Dungeon Master/i }))
    await user.type(screen.getByLabelText(/DM Passphrase/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /Enter the Wiki/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/Invalid passphrase/i)
    expect(mockPush).not.toHaveBeenCalled()
  })
})
