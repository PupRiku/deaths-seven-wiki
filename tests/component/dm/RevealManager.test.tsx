import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RevealManager from '@/components/dm/RevealManager/RevealManager'
import type { RevealRecord } from '@/components/dm/RevealManager/types'
import type { NPC } from '@/types'

const sampleNpc: NPC = {
  id: 'avarus',
  name: 'Baron Avarus',
  race: 'Human',
  role: 'Sin of Greed',
  status: 'Active',
  alignment: 'Enemy',
  location: 'Gildmaw',
  arc: 'Ch.9',
  appearance: 'Tall, gilded.',
  description: 'Long villain story.',
  personality: 'Theatrical.',
  notes: ['note one', 'note two'],
  firstAppearance: 9,
  tags: ['boss', 'greed'],
}

const sampleRecord: RevealRecord = {
  reveal: {
    id: 'r-1',
    entityType: 'npc',
    entityId: 'avarus',
    visibility: 'hidden',
    discoveredName: null,
    chapterAssociation: 9,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  entity: sampleNpc,
  fields: [
    {
      id: 'f-1',
      entityType: 'npc',
      entityId: 'avarus',
      fieldName: 'role',
      isRevealed: false,
      revealedAt: null,
    },
    {
      id: 'f-2',
      entityType: 'npc',
      entityId: 'avarus',
      fieldName: 'notes:0',
      isRevealed: true,
      revealedAt: '2024-01-01',
    },
  ],
  customDetails: [],
}

const fizzleRecord: RevealRecord = {
  reveal: {
    id: 'r-2',
    entityType: 'npc',
    entityId: 'fizzle',
    visibility: 'discovered',
    discoveredName: 'A small flying friend',
    chapterAssociation: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  entity: { ...sampleNpc, id: 'fizzle', name: 'Fizzle', firstAppearance: 1 },
  fields: [],
  customDetails: [],
}

let fetchCalls: Array<{ url: string; init?: RequestInit }> = []

function mockFetch(records: RevealRecord[]) {
  fetchCalls = []
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string, init?: RequestInit) => {
      fetchCalls.push({ url, init })
      if (url === '/api/dm/reveals' && (!init || init.method === undefined)) {
        return Promise.resolve(
          new Response(JSON.stringify(records), { status: 200 })
        )
      }
      // Default success for any PATCH/POST/DELETE.
      return Promise.resolve(new Response(JSON.stringify({ success: true, id: 'new-id' }), { status: 200 }))
    })
  )
}

beforeEach(() => {
  vi.unstubAllGlobals()
})

describe('RevealManager — Filter Bar', () => {
  it('renders type chips, visibility chips, chapter dropdown, and search input', async () => {
    mockFetch([sampleRecord])
    render(<RevealManager />)
    await waitFor(() => screen.getByText('Baron Avarus'))
    expect(screen.getByRole('button', { name: 'NPC' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Location' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Faction' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Item' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Hidden' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Discovered' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Revealed' })).toBeInTheDocument()
    expect(screen.getByLabelText(/chapter filter/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/search by name/i)).toBeInTheDocument()
  })

  it('filtering by type hides non-matching entities', async () => {
    mockFetch([sampleRecord])
    render(<RevealManager />)
    await waitFor(() => screen.getByText('Baron Avarus'))

    // Deselect NPC chip
    fireEvent.click(screen.getByRole('button', { name: 'NPC' }))
    expect(screen.queryByText('Baron Avarus')).not.toBeInTheDocument()
  })

  it('search input narrows the list', async () => {
    mockFetch([sampleRecord, fizzleRecord])
    render(<RevealManager />)
    await waitFor(() => screen.getByText('Baron Avarus'))

    const search = screen.getByPlaceholderText(/search by name/i) as HTMLInputElement
    fireEvent.change(search, { target: { value: 'fizz' } })
    expect(screen.queryByText('Baron Avarus')).not.toBeInTheDocument()
    expect(screen.getByText(/Fizzle/i)).toBeInTheDocument()
  })
})

describe('RevealManager — Entity Row', () => {
  it('shows the field reveal count', async () => {
    mockFetch([sampleRecord])
    render(<RevealManager />)
    await waitFor(() => screen.getByText('Baron Avarus'))
    expect(screen.getByText(/1\/2 fields/i)).toBeInTheDocument()
  })

  it('shows discovered_name in parentheses next to the entity name', async () => {
    mockFetch([fizzleRecord])
    render(<RevealManager />)
    await waitFor(() => screen.getByText(/Fizzle \(A small flying friend\)/))
  })

  it('clicking the visibility toggle calls the PATCH endpoint with new visibility', async () => {
    mockFetch([sampleRecord])
    render(<RevealManager />)
    await waitFor(() => screen.getByText('Baron Avarus'))

    fireEvent.click(screen.getByRole('radio', { name: 'Revealed' }))

    await waitFor(() => {
      const patchCalls = fetchCalls.filter((c) => c.init?.method === 'PATCH')
      expect(patchCalls.length).toBe(1)
      expect(patchCalls[0].url).toBe('/api/dm/reveals/npc/avarus')
      const body = JSON.parse(String(patchCalls[0].init!.body))
      expect(body.visibility).toBe('revealed')
    })
  })
})

describe('RevealManager — Detail Panel', () => {
  it('expands to show field reveals and "See as Player" button', async () => {
    mockFetch([sampleRecord])
    render(<RevealManager />)
    await waitFor(() => screen.getByText('Baron Avarus'))

    fireEvent.click(screen.getByRole('button', { name: /Baron Avarus/i }))
    expect(screen.getByText(/field reveals/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /See as Player/i })).toBeInTheDocument()
  })

  it('clicking "See as Player" reveals the live player preview', async () => {
    mockFetch([sampleRecord])
    render(<RevealManager />)
    await waitFor(() => screen.getByText('Baron Avarus'))

    fireEvent.click(screen.getByRole('button', { name: /Baron Avarus/i }))
    fireEvent.click(screen.getByRole('button', { name: /See as Player/i }))
    expect(screen.getByText(/PLAYER VIEW/i)).toBeInTheDocument()
  })

  it("player preview shows 'Hidden' when entity is hidden", async () => {
    mockFetch([sampleRecord]) // hidden by default
    render(<RevealManager />)
    await waitFor(() => screen.getByText('Baron Avarus'))

    fireEvent.click(screen.getByRole('button', { name: /Baron Avarus/i }))
    fireEvent.click(screen.getByRole('button', { name: /See as Player/i }))
    expect(screen.getByText(/Hidden — this entity does not appear/i)).toBeInTheDocument()
  })

  it('toggling a field reveal calls the field PATCH endpoint', async () => {
    mockFetch([sampleRecord])
    render(<RevealManager />)
    await waitFor(() => screen.getByText('Baron Avarus'))

    fireEvent.click(screen.getByRole('button', { name: /Baron Avarus/i }))
    // role field is currently HIDDEN — clicking should toggle to revealed.
    const fieldRow = screen.getByText('role').closest('div')!
    const toggle = within(fieldRow.parentElement!).getByRole('button', { name: /HIDDEN/i })
    fireEvent.click(toggle)

    await waitFor(() => {
      const patchCalls = fetchCalls.filter((c) =>
        c.url.includes('/fields/role') && c.init?.method === 'PATCH'
      )
      expect(patchCalls.length).toBe(1)
      const body = JSON.parse(String(patchCalls[0].init!.body))
      expect(body.isRevealed).toBe(true)
    })
  })

  it('creating a custom detail calls the POST endpoint', async () => {
    mockFetch([sampleRecord])
    const user = userEvent.setup()
    render(<RevealManager />)
    await waitFor(() => screen.getByText('Baron Avarus'))

    fireEvent.click(screen.getByRole('button', { name: /Baron Avarus/i }))
    await user.type(screen.getByPlaceholderText('Title'), 'A note')
    await user.type(screen.getByPlaceholderText('Content'), 'Some content')
    fireEvent.click(screen.getByRole('button', { name: /Add detail/i }))

    await waitFor(() => {
      const post = fetchCalls.find(
        (c) =>
          c.url === '/api/dm/reveals/npc/avarus/details' && c.init?.method === 'POST'
      )
      expect(post).toBeDefined()
      const body = JSON.parse(String(post!.init!.body))
      expect(body.title).toBe('A note')
      expect(body.content).toBe('Some content')
    })
  })

  it('add-detail form preserves typed text when the POST fails', async () => {
    // Init load returns the sample record; POST /details fails with 500.
    fetchCalls = []
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string, init?: RequestInit) => {
        fetchCalls.push({ url, init })
        if (url === '/api/dm/reveals' && (!init || init.method === undefined)) {
          return Promise.resolve(new Response(JSON.stringify([sampleRecord]), { status: 200 }))
        }
        if (url.endsWith('/details') && init?.method === 'POST') {
          return Promise.resolve(
            new Response(JSON.stringify({ error: 'nope' }), { status: 500 })
          )
        }
        return Promise.resolve(new Response('{}', { status: 200 }))
      })
    )
    const user = userEvent.setup()
    render(<RevealManager />)
    await waitFor(() => screen.getByText('Baron Avarus'))

    fireEvent.click(screen.getByRole('button', { name: /Baron Avarus/i }))
    const titleInput = screen.getByPlaceholderText('Title') as HTMLInputElement
    const contentInput = screen.getByPlaceholderText('Content') as HTMLTextAreaElement
    await user.type(titleInput, 'A precious note')
    await user.type(contentInput, 'I do not want to retype this')
    fireEvent.click(screen.getByRole('button', { name: /Add detail/i }))

    // After the failed POST, the typed text must still be there for retry.
    await waitFor(() => {
      expect(titleInput.value).toBe('A precious note')
      expect(contentInput.value).toBe('I do not want to retype this')
    })
  })
})

describe('RevealManager — Bulk Actions', () => {
  it('shows the bulk action bar when items are selected', async () => {
    mockFetch([sampleRecord, fizzleRecord])
    render(<RevealManager />)
    await waitFor(() => screen.getByText('Baron Avarus'))

    const checkbox = screen.getByRole('checkbox', { name: /Select Baron Avarus/i })
    fireEvent.click(checkbox)
    expect(screen.getByText(/1 selected/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Set Hidden/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Set Discovered/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Set Revealed/i })).toBeInTheDocument()
  })

  it('chapter bulk: Preview shows affected entities WITHOUT making the API call', async () => {
    // sampleRecord has chapterAssociation: 9, the default chapter selector value is 1.
    // Switch to chapter 9 first, then preview.
    mockFetch([sampleRecord])
    render(<RevealManager />)
    await waitFor(() => screen.getByText('Baron Avarus'))

    fireEvent.change(screen.getByLabelText(/Chapter for bulk action/i), {
      target: { value: '9' },
    })

    fireEvent.click(screen.getByRole('button', { name: /^Preview$/i }))

    // The preview region should appear listing the affected entity.
    expect(screen.getByRole('region', { name: /Bulk chapter preview/i })).toBeInTheDocument()
    // Apply / Cancel buttons should appear.
    expect(screen.getByRole('button', { name: /^Apply/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^Cancel$/i })).toBeInTheDocument()
    // No POST should have happened yet.
    const postBeforeApply = fetchCalls.find(
      (c) => c.url === '/api/dm/reveals/bulk-chapter' && c.init?.method === 'POST'
    )
    expect(postBeforeApply).toBeUndefined()
  })

  it('chapter bulk: Apply (after Preview) POSTs to the bulk-chapter endpoint', async () => {
    mockFetch([sampleRecord])
    render(<RevealManager />)
    await waitFor(() => screen.getByText('Baron Avarus'))

    fireEvent.change(screen.getByLabelText(/Chapter for bulk action/i), {
      target: { value: '9' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^Preview$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^Apply/i }))

    await waitFor(() => {
      const post = fetchCalls.find(
        (c) => c.url === '/api/dm/reveals/bulk-chapter' && c.init?.method === 'POST'
      )
      expect(post).toBeDefined()
    })
  })

  it('chapter bulk: Cancel dismisses the preview without committing', async () => {
    mockFetch([sampleRecord])
    render(<RevealManager />)
    await waitFor(() => screen.getByText('Baron Avarus'))

    fireEvent.change(screen.getByLabelText(/Chapter for bulk action/i), {
      target: { value: '9' },
    })
    fireEvent.click(screen.getByRole('button', { name: /^Preview$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^Cancel$/i }))

    expect(screen.queryByRole('region', { name: /Bulk chapter preview/i })).not.toBeInTheDocument()
    const post = fetchCalls.find(
      (c) => c.url === '/api/dm/reveals/bulk-chapter' && c.init?.method === 'POST'
    )
    expect(post).toBeUndefined()
  })
})

describe('RevealManager — accessibility & keyboard', () => {
  it('row expander button exposes aria-expanded', async () => {
    mockFetch([sampleRecord])
    render(<RevealManager />)
    await waitFor(() => screen.getByText('Baron Avarus'))

    const expander = screen.getByRole('button', { name: /Expand details for Baron Avarus/i })
    expect(expander).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(expander)
    // After expansion, the same button should report expanded=true and the
    // accessible name should flip to "Collapse details for Baron Avarus".
    const collapser = screen.getByRole('button', { name: /Collapse details for Baron Avarus/i })
    expect(collapser).toHaveAttribute('aria-expanded', 'true')
  })

  it('VisibilityToggle responds to ArrowRight / ArrowLeft to change selection', async () => {
    mockFetch([sampleRecord]) // hidden by default
    render(<RevealManager />)
    await waitFor(() => screen.getByText('Baron Avarus'))

    const radiogroup = screen.getByRole('radiogroup', { name: /Visibility/i })
    // Hidden is selected initially.
    expect(within(radiogroup).getByRole('radio', { name: /Hidden/i })).toHaveAttribute(
      'aria-checked',
      'true'
    )
    // Press ArrowRight on the radiogroup — should advance to Discovered.
    fireEvent.keyDown(radiogroup, { key: 'ArrowRight' })
    await waitFor(() => {
      const patch = fetchCalls.find(
        (c) =>
          c.url === '/api/dm/reveals/npc/avarus' &&
          c.init?.method === 'PATCH' &&
          JSON.parse(String(c.init!.body)).visibility === 'discovered'
      )
      expect(patch).toBeDefined()
    })
  })
})

describe('RevealManager — optimistic UI rollback', () => {
  // Use a focused fetch mock that succeeds for the initial GET but FAILS the
  // mutation, so we can assert the local state rolls back.
  function mockFetchWithFailingMutations(records: RevealRecord[]) {
    fetchCalls = []
    vi.stubGlobal(
      'fetch',
      vi.fn((url: string, init?: RequestInit) => {
        fetchCalls.push({ url, init })
        if (url === '/api/dm/reveals' && (!init || init.method === undefined)) {
          return Promise.resolve(new Response(JSON.stringify(records), { status: 200 }))
        }
        // Every mutation fails.
        return Promise.resolve(new Response(JSON.stringify({ error: 'nope' }), { status: 500 }))
      })
    )
  }

  it('visibility toggle rolls back when the API call fails', async () => {
    mockFetchWithFailingMutations([sampleRecord]) // hidden
    render(<RevealManager />)
    await waitFor(() => screen.getByText('Baron Avarus'))

    fireEvent.click(screen.getByRole('radio', { name: 'Revealed' }))

    // After the failed PATCH, the toggle should revert to hidden.
    await waitFor(() => {
      const radio = screen.getByRole('radio', { name: 'Hidden' })
      expect(radio).toHaveAttribute('aria-checked', 'true')
    })
  })
})
