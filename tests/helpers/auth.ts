import crypto from 'crypto'
import type { Client } from '@libsql/client'
import { sha256 } from './db'

const DAY_MS = 24 * 60 * 60 * 1000

export interface TestPlayerToken {
  id: string
  characterId: string
  characterName: string
  playerName: string
  token: string
  hash: string
}

export async function createTestPlayerToken(
  client: Client,
  overrides: Partial<{
    characterId: string
    characterName: string
    playerName: string
    token: string
  }> = {}
): Promise<TestPlayerToken> {
  const id = crypto.randomUUID()
  const characterId = overrides.characterId ?? `char-${id.slice(0, 8)}`
  const characterName = overrides.characterName ?? 'Test Character'
  const playerName = overrides.playerName ?? 'Test Player'
  const token = overrides.token ?? `TOKEN-${id.slice(0, 6).toUpperCase()}`
  const hash = sha256(token)

  await client.execute({
    sql: `INSERT INTO player_tokens (id, character_id, character_name, player_name, token_hash)
          VALUES (?, ?, ?, ?, ?)`,
    args: [id, characterId, characterName, playerName, hash],
  })

  return { id, characterId, characterName, playerName, token, hash }
}

export async function createTestDmSession(client: Client): Promise<{ sessionId: string; cookie: string }> {
  const sessionId = crypto.randomUUID()
  const expires = new Date(Date.now() + 30 * DAY_MS).toISOString()
  await client.execute({
    sql: `INSERT INTO dm_sessions (id, expires_at) VALUES (?, ?)`,
    args: [sessionId, expires],
  })
  return { sessionId, cookie: `dm_session=${sessionId}` }
}

export async function createTestPlayerSession(
  client: Client,
  playerTokenId: string
): Promise<{ sessionId: string; cookie: string }> {
  const sessionId = crypto.randomUUID()
  const expires = new Date(Date.now() + 30 * DAY_MS).toISOString()
  await client.execute({
    sql: `INSERT INTO player_sessions (id, player_token_id, expires_at) VALUES (?, ?, ?)`,
    args: [sessionId, playerTokenId, expires],
  })
  return { sessionId, cookie: `player_session=${sessionId}` }
}

export async function expiredSession(
  client: Client,
  role: 'dm' | 'player',
  playerTokenId?: string
): Promise<string> {
  const sessionId = crypto.randomUUID()
  const expired = new Date(Date.now() - DAY_MS).toISOString()
  if (role === 'dm') {
    await client.execute({
      sql: `INSERT INTO dm_sessions (id, expires_at) VALUES (?, ?)`,
      args: [sessionId, expired],
    })
  } else {
    if (!playerTokenId) throw new Error('playerTokenId required for expired player session')
    await client.execute({
      sql: `INSERT INTO player_sessions (id, player_token_id, expires_at) VALUES (?, ?, ?)`,
      args: [sessionId, playerTokenId, expired],
    })
  }
  return sessionId
}
