import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

import JoinPage from '@/app/join/page'

beforeEach(() => {
  mockPush.mockReset()
  vi.spyOn(globalThis, 'fetch').mockReset()
  vi.useRealTimers()
})

describe('Join page', () => {
  it('renders a token input and submit button', () => {
    render(<JoinPage />)
    expect(screen.getByLabelText(/Your Token/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Enter the Realm/i })).toBeInTheDocument()
  })

  it('focuses the input on mount (mobile UX)', () => {
    render(<JoinPage />)
    expect(screen.getByLabelText(/Your Token/i)).toHaveFocus()
  })

  it('uppercases input as the user types', async () => {
    const user = userEvent.setup()
    render(<JoinPage />)
    const input = screen.getByLabelText(/Your Token/i) as HTMLInputElement
    await user.type(input, 'rolando')
    expect(input.value).toBe('ROLANDO')
  })

  it('shows the welcome message and redirects to /player on success', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime.bind(vi) })
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true, characterName: 'Rolando Ornasca' }), { status: 200 })
    )
    render(<JoinPage />)
    await user.type(screen.getByLabelText(/Your Token/i), 'rolando')
    await user.click(screen.getByRole('button', { name: /Enter the Realm/i }))

    expect(await screen.findByText('Rolando Ornasca')).toBeInTheDocument()

    vi.advanceTimersByTime(1600)
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/player')
    })
  })

  it('shows an error on invalid token and stays on the page', async () => {
    const user = userEvent.setup()
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 })
    )
    render(<JoinPage />)
    await user.type(screen.getByLabelText(/Your Token/i), 'NOPE')
    await user.click(screen.getByRole('button', { name: /Enter the Realm/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent(/Invalid token/i)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('submits to /api/auth/player', async () => {
    const user = userEvent.setup()
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    vi.spyOn(globalThis, 'fetch').mockImplementation(fetchMock as never)
    render(<JoinPage />)
    await user.type(screen.getByLabelText(/Your Token/i), 'rolando')
    await user.click(screen.getByRole('button', { name: /Enter the Realm/i }))
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        '/api/auth/player',
        expect.objectContaining({ method: 'POST' })
      )
    })
  })
})
