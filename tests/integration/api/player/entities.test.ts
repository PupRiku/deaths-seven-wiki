import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createClient, type Client } from '@libsql/client'

const memory: { db: Client | null } = { db: null }

vi.mock('@/lib/db', async () => {
  const actual = await vi.importActual<typeof import('@/lib/db')>('@/lib/db')
  return {
    ...actual,
    get db() {
      return memory.db!
    },
    initDB: async () => actual.initDB(memory.db!),
  }
})

const cookieJar: { entries: Record<string, string> } = { entries: {} }
vi.mock('next/headers', () => ({
  cookies: async () => ({
    get(name: string) {
      const v = cookieJar.entries[name]
      return v === undefined ? undefined : { value: v }
    },
  }),
}))

import {
  createTestPlayerToken,
  createTestPlayerSession,
} from '../../../helpers/auth'
import { syncReveals, _resetSyncLatchForTests } from '@/lib/reveal-sync'

beforeEach(async () => {
  memory.db = createClient({ url: ':memory:' })
  cookieJar.entries = {}
  _resetSyncLatchForTests()
  const { initDB } = await import('@/lib/db')
  await initDB()
  await syncReveals(memory.db!, { force: true, logger: { warn: () => {} } })
})

async function authedPlayer() {
  const tok = await createTestPlayerToken(memory.db!, {
    characterId: 'test-rolando',
  })
  const { sessionId } = await createTestPlayerSession(memory.db!, tok.id)
  cookieJar.entries.player_session = sessionId
}

async function setVisibility(
  entityType: string,
  entityId: string,
  visibility: string,
  discoveredName: string | null = null
) {
  await memory.db!.execute({
    sql: `UPDATE entity_reveals SET visibility = ?, discovered_name = ?
          WHERE entity_type = ? AND entity_id = ?`,
    args: [visibility, discoveredName, entityType, entityId],
  })
}

async function revealField(
  entityType: string,
  entityId: string,
  fieldName: string
) {
  await memory.db!.execute({
    sql: `UPDATE entity_field_reveals SET is_revealed = 1
          WHERE entity_type = ? AND entity_id = ? AND field_name = ?`,
    args: [entityType, entityId, fieldName],
  })
}

describe('GET /api/player/npcs', () => {
  it('returns 401 without player_session', async () => {
    const { GET } = await import('@/app/api/player/npcs/route')
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('does not return hidden NPCs', async () => {
    await authedPlayer()
    // All NPCs default to hidden after sync.
    const { GET } = await import('@/app/api/player/npcs/route')
    const res = await GET()
    const data = await res.json()
    expect(data).toEqual([])
  })

  it('returns discovered NPCs with appearance only — no name, role, description, notes, statBlock', async () => {
    await authedPlayer()
    await setVisibility('npc', 'avarus', 'discovered', 'The Golden Man')
    const { GET } = await import('@/app/api/player/npcs/route')
    const res = await GET()
    const data = await res.json()
    expect(data.length).toBe(1)
    const a = data[0]
    expect(a.entityType).toBe('npc')
    expect(a.visibility).toBe('discovered')
    expect(a.displayName).toBe('The Golden Man')
    expect(a.appearance).toContain('fur-trimmed')
    expect(a.name).toBeUndefined()
    expect(a.role).toBeUndefined()
    expect(a.description).toBeUndefined()
    expect(a.personality).toBeUndefined()
    expect(a.revealedFields).toBeUndefined()
  })

  it('falls back to "???" for displayName when discovered_name is null', async () => {
    await authedPlayer()
    await setVisibility('npc', 'avarus', 'discovered', null)
    const { GET } = await import('@/app/api/player/npcs/route')
    const res = await GET()
    const data = await res.json()
    expect(data[0].displayName).toBe('???')
  })

  it('returns revealed NPCs with base fields and only revealed fields populated', async () => {
    await authedPlayer()
    await setVisibility('npc', 'avarus', 'revealed')
    await revealField('npc', 'avarus', 'role')
    const { GET } = await import('@/app/api/player/npcs/route')
    const res = await GET()
    const data = await res.json()
    const a = data[0]
    expect(a.name).toBe('Baron Avarus')
    expect(a.race).toBe('Human (formerly)')
    expect(a.description).toBeTruthy()
    // role revealed — should appear in both base and revealedFields
    expect(a.role).toContain('Greed')
    expect(a.revealedFields.role).toContain('Greed')
    // personality not revealed — null in revealedFields
    expect(a.revealedFields.personality).toBeNull()
    expect(a.revealedFields.stat_block).toBeNull()
    expect(a.revealedFields.notes).toEqual([])
  })

  it('does not leak hidden entity ids in any form', async () => {
    await authedPlayer()
    await setVisibility('npc', 'avarus', 'discovered')
    // fizzle stays hidden
    const { GET } = await import('@/app/api/player/npcs/route')
    const res = await GET()
    const body = JSON.stringify(await res.json())
    expect(body).not.toContain('fizzle')
    expect(body).not.toContain('Fizzle')
  })
})

describe('GET /api/player/locations', () => {
  it('returns 401 without player_session', async () => {
    const { GET } = await import('@/app/api/player/locations/route')
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('discovered locations show type only — not full description', async () => {
    await authedPlayer()
    await setVisibility('location', 'gildmaw', 'discovered', 'A casino city')
    const { GET } = await import('@/app/api/player/locations/route')
    const res = await GET()
    const data = await res.json()
    expect(data.length).toBe(1)
    expect(data[0].displayName).toBe('A casino city')
    expect(data[0].description).toBe('City — Sin Arc')
    expect(data[0].name).toBeUndefined()
  })

  it('revealed locations include real description and gated keyLocations', async () => {
    await authedPlayer()
    await setVisibility('location', 'gildmaw', 'revealed')
    await revealField('location', 'gildmaw', 'keyLocations:0')
    const { GET } = await import('@/app/api/player/locations/route')
    const res = await GET()
    const data = await res.json()
    expect(data[0].name).toBe('Gildmaw')
    expect(data[0].description).toContain('MagiPunk')
    expect(data[0].revealedFields.keyLocations.length).toBe(1)
  })
})

describe('GET /api/player/factions', () => {
  it('discovered factions show type and alignment only', async () => {
    await authedPlayer()
    await setVisibility('faction', 'nova-sentinels', 'discovered', 'A friendly group')
    const { GET } = await import('@/app/api/player/factions/route')
    const res = await GET()
    const data = await res.json()
    const f = data[0]
    expect(f.displayName).toBe('A friendly group')
    expect(f.type).toBe('Military / Intelligence')
    expect(f.alignment).toBe('Ally')
    expect(f.leader).toBeUndefined()
    expect(f.description).toBeUndefined()
    expect(f.name).toBeUndefined()
  })

  it('revealed factions show description and gate leader/founder', async () => {
    await authedPlayer()
    await setVisibility('faction', 'nova-sentinels', 'revealed')
    await revealField('faction', 'nova-sentinels', 'leader')
    const { GET } = await import('@/app/api/player/factions/route')
    const res = await GET()
    const data = await res.json()
    const f = data[0]
    expect(f.name).toBe('Nova Sentinels')
    expect(f.description).toBeTruthy()
    expect(f.revealedFields.leader).toBe('Commander Nazura')
    expect(f.revealedFields.founder).toBeNull()
  })
})

describe('GET /api/player/items', () => {
  it('discovered items show found-name, not true name', async () => {
    await authedPlayer()
    await setVisibility('item', 'relic-stone', 'discovered', 'A strange stone')
    const { GET } = await import('@/app/api/player/items/route')
    const res = await GET()
    const data = await res.json()
    const item = data[0]
    expect(item.displayName).toBe('A strange stone')
    expect(item.name).toBeUndefined()
    expect(item.description).toBeUndefined()
  })

  it('revealed items show true name and gated properties', async () => {
    await authedPlayer()
    await setVisibility('item', 'relic-stone', 'revealed')
    await revealField('item', 'relic-stone', 'properties:0')
    const { GET } = await import('@/app/api/player/items/route')
    const res = await GET()
    const data = await res.json()
    const item = data[0]
    expect(item.name).toBe('The Relic Stone')
    expect(item.displayName).toBe('The Relic Stone')
    expect(item.revealedFields.properties.length).toBe(1)
  })
})
