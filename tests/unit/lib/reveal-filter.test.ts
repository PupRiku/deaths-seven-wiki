import { describe, it, expect } from 'vitest'
import { filterEntityForPlayer } from '@/lib/reveal-filter'
import type {
  EntityCustomDetail,
  EntityFieldReveal,
  EntityReveal,
  Faction,
  Item,
  NPC,
  ReferenceLocation,
} from '@/types'

function reveal(
  overrides: Partial<EntityReveal> & {
    entityType: EntityReveal['entityType']
    entityId: string
  }
): EntityReveal {
  return {
    id: 'r-1',
    visibility: 'hidden',
    discoveredName: null,
    chapterAssociation: null,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
    ...overrides,
  }
}

function field(
  entityType: EntityFieldReveal['entityType'],
  entityId: string,
  fieldName: string,
  isRevealed: boolean
): EntityFieldReveal {
  return {
    id: `f-${fieldName}`,
    entityType,
    entityId,
    fieldName,
    isRevealed,
    revealedAt: isRevealed ? '2024-01-01' : null,
  }
}

function detail(
  entityType: EntityCustomDetail['entityType'],
  entityId: string,
  id: string,
  title: string,
  isRevealed: boolean,
  sortOrder = 0
): EntityCustomDetail {
  return {
    id,
    entityType,
    entityId,
    title,
    content: `${title}-content`,
    isRevealed,
    revealedAt: isRevealed ? '2024-01-01' : null,
    createdAt: '2024-01-01',
    sortOrder,
  }
}

const sampleNpc: NPC = {
  id: 'avarus',
  name: 'Baron Avarus',
  race: 'Human (formerly)',
  role: 'Host - Sin of Greed',
  status: 'Active',
  alignment: 'Enemy',
  location: 'Gildmaw',
  arc: 'Ch.9 - Greed',
  appearance: 'Tall figure in fur-trimmed coat. Cane glows.',
  description: 'Long villain backstory.',
  personality: 'Performative excess.',
  notes: ['note-zero', 'note-one', 'note-two'],
  firstAppearance: 9,
  statBlock: {
    name: 'Baron Avarus',
    cr: '13',
    ac: 18,
    hp: 180,
    speed: '30ft',
    str: 16,
    dex: 14,
    con: 18,
    int: 16,
    wis: 12,
    cha: 20,
  },
  tags: ['boss', 'greed'],
}

describe('filterEntityForPlayer - NPC', () => {
  it('returns null for hidden NPC', () => {
    const out = filterEntityForPlayer(
      sampleNpc,
      'npc',
      reveal({ entityType: 'npc', entityId: 'avarus', visibility: 'hidden' }),
      [],
      []
    )
    expect(out).toBeNull()
  })

  it('returns discovered shape: pid + appearance + displayName only — no name/role/description/tags/image/firstAppearance', () => {
    const out = filterEntityForPlayer(
      sampleNpc,
      'npc',
      reveal({
        entityType: 'npc',
        entityId: 'avarus',
        visibility: 'discovered',
        discoveredName: 'The Golden Man',
      }),
      [],
      []
    )
    expect(out).not.toBeNull()
    expect(out!.entityType).toBe('npc')
    expect(out!.visibility).toBe('discovered')
    expect(out!.displayName).toBe('The Golden Man')
    // Spoiler protection: every potentially-revealing field must be absent.
    const flat = out as unknown as Record<string, unknown>
    expect(flat.id).toBeUndefined() // source id is never returned — pid only
    expect(flat.name).toBeUndefined()
    expect(flat.role).toBeUndefined()
    expect(flat.description).toBeUndefined()
    expect(flat.personality).toBeUndefined()
    expect(flat.revealedFields).toBeUndefined()
    expect(flat.tags).toBeUndefined()
    expect(flat.image).toBeUndefined()
    expect(flat.firstAppearance).toBeUndefined()
    expect(flat.appearance).toBe(sampleNpc.appearance)
    // pid is opaque, deterministic, and does not equal the source id.
    expect(typeof flat.pid).toBe('string')
    expect(flat.pid).not.toBe(sampleNpc.id)
    expect((flat.pid as string).length).toBeGreaterThan(0)
  })

  it('emits the same opaque pid for the same (entityType, entityId) across calls', () => {
    const out1 = filterEntityForPlayer(
      sampleNpc,
      'npc',
      reveal({ entityType: 'npc', entityId: 'avarus', visibility: 'discovered' }),
      [],
      []
    )
    const out2 = filterEntityForPlayer(
      sampleNpc,
      'npc',
      reveal({ entityType: 'npc', entityId: 'avarus', visibility: 'revealed' }),
      [],
      []
    )
    expect(out1!.pid).toBe(out2!.pid)
  })

  it('returns null when entity.id does not match reveal.entityId (defensive)', () => {
    const wrong: typeof sampleNpc = { ...sampleNpc, id: 'someone-else' }
    const out = filterEntityForPlayer(
      wrong,
      'npc',
      reveal({ entityType: 'npc', entityId: 'avarus', visibility: 'revealed' }),
      [],
      []
    )
    expect(out).toBeNull()
  })

  it('falls back to "???" for displayName when discovered_name is blank or whitespace', () => {
    for (const blank of [null, '', '   ', '\t\n']) {
      const out = filterEntityForPlayer(
        sampleNpc,
        'npc',
        reveal({
          entityType: 'npc',
          entityId: 'avarus',
          visibility: 'discovered',
          discoveredName: blank,
        }),
        [],
        []
      )
      expect(out!.displayName).toBe('???')
    }
  })

  it('falls back to "???" for displayName when discovered_name is null', () => {
    const out = filterEntityForPlayer(
      sampleNpc,
      'npc',
      reveal({ entityType: 'npc', entityId: 'avarus', visibility: 'discovered' }),
      [],
      []
    )
    expect(out!.displayName).toBe('???')
  })

  it('returns revealed shape with base fields and revealedFields gating', () => {
    const out = filterEntityForPlayer(
      sampleNpc,
      'npc',
      reveal({ entityType: 'npc', entityId: 'avarus', visibility: 'revealed' }),
      [
        field('npc', 'avarus', 'role', true),
        field('npc', 'avarus', 'personality', false),
        field('npc', 'avarus', 'stat_block', false),
      ],
      []
    )
    expect(out).not.toBeNull()
    expect(out!.visibility).toBe('revealed')
    const flat = out as unknown as Record<string, unknown> & {
      revealedFields: Record<string, unknown>
    }
    expect(flat.name).toBe(sampleNpc.name)
    expect(flat.description).toBe(sampleNpc.description)
    expect(flat.race).toBe(sampleNpc.race)
    expect(flat.alignment).toBe(sampleNpc.alignment)
    expect(flat.location).toBe(sampleNpc.location)
    expect(flat.status).toBe(sampleNpc.status)
    // role: revealed -> present in both base and revealedFields
    expect(flat.role).toBe(sampleNpc.role)
    expect(flat.revealedFields.role).toBe(sampleNpc.role)
    // personality: not revealed -> null in revealedFields, NOT in base
    expect(flat.revealedFields.personality).toBeNull()
    // statBlock: not revealed -> null in revealedFields
    expect(flat.revealedFields.stat_block).toBeNull()
  })

  it('hides role in base response when role field reveal is off', () => {
    const out = filterEntityForPlayer(
      sampleNpc,
      'npc',
      reveal({ entityType: 'npc', entityId: 'avarus', visibility: 'revealed' }),
      [field('npc', 'avarus', 'role', false)],
      []
    )
    const flat = out as unknown as Record<string, unknown> & {
      revealedFields: Record<string, unknown>
    }
    expect(flat.role).toBeNull()
    expect(flat.revealedFields.role).toBeNull()
  })

  it('includes only individually revealed notes by index', () => {
    const out = filterEntityForPlayer(
      sampleNpc,
      'npc',
      reveal({ entityType: 'npc', entityId: 'avarus', visibility: 'revealed' }),
      [
        field('npc', 'avarus', 'notes:0', false),
        field('npc', 'avarus', 'notes:1', true),
        field('npc', 'avarus', 'notes:2', true),
      ],
      []
    )
    const flat = out as unknown as Record<string, unknown> & {
      revealedFields: { notes: string[] }
    }
    expect(flat.revealedFields.notes).toEqual(['note-one', 'note-two'])
  })

  it('includes only revealed custom details, sorted by sort_order', () => {
    const out = filterEntityForPlayer(
      sampleNpc,
      'npc',
      reveal({ entityType: 'npc', entityId: 'avarus', visibility: 'revealed' }),
      [],
      [
        detail('npc', 'avarus', 'd2', 'Second', true, 1),
        detail('npc', 'avarus', 'd1', 'First', true, 0),
        detail('npc', 'avarus', 'd3', 'Hidden', false, 2),
      ]
    )
    const flat = out as unknown as Record<string, unknown> & {
      customDetails: Array<{ id: string }>
    }
    expect(flat.customDetails.map((d) => d.id)).toEqual(['d1', 'd2'])
  })

  it('drops field/detail rows that belong to a different entity', () => {
    // Defensive: even if caller passes mismatched rows, filter should not leak.
    const out = filterEntityForPlayer(
      sampleNpc,
      'npc',
      reveal({ entityType: 'npc', entityId: 'avarus', visibility: 'revealed' }),
      [
        field('npc', 'wrong-id', 'role', true), // wrong entity_id
      ],
      []
    )
    const flat = out as unknown as Record<string, unknown> & {
      revealedFields: Record<string, unknown>
    }
    expect(flat.role).toBeNull()
    expect(flat.revealedFields.role).toBeNull()
  })
})

const sampleLocation: ReferenceLocation = {
  id: 'gildmaw',
  name: 'Gildmaw',
  altName: 'Formerly Casa Ornasca',
  type: 'City - Sin Arc',
  description: 'MagiPunk Las Vegas.',
  sinArc: 'Greed',
  chapters: [9],
  keyLocations: ['The Fold', 'The Strip', 'The Gilded Cage'],
  npcsPresent: ['avarus'],
  notes: 'Rolando kingdom.',
  tags: ['greed'],
}

describe('filterEntityForPlayer - Location', () => {
  it('returns null for hidden location', () => {
    expect(
      filterEntityForPlayer(
        sampleLocation,
        'location',
        reveal({ entityType: 'location', entityId: 'gildmaw', visibility: 'hidden' }),
        [],
        []
      )
    ).toBeNull()
  })

  it('discovered shape exposes type as basic description, not full description', () => {
    const out = filterEntityForPlayer(
      sampleLocation,
      'location',
      reveal({
        entityType: 'location',
        entityId: 'gildmaw',
        visibility: 'discovered',
        discoveredName: 'A casino city',
      }),
      [],
      []
    )
    expect(out!.displayName).toBe('A casino city')
    const flat = out as unknown as Record<string, unknown>
    expect(flat.description).toBe(sampleLocation.type) // basic type, not real description
    expect(flat.name).toBeUndefined()
  })

  it('revealed shape gates altName, keyLocations, notes per field reveal', () => {
    const out = filterEntityForPlayer(
      sampleLocation,
      'location',
      reveal({ entityType: 'location', entityId: 'gildmaw', visibility: 'revealed' }),
      [
        field('location', 'gildmaw', 'altName', true),
        field('location', 'gildmaw', 'keyLocations:0', true),
        field('location', 'gildmaw', 'keyLocations:1', false),
        field('location', 'gildmaw', 'keyLocations:2', true),
        field('location', 'gildmaw', 'notes', false),
      ],
      []
    )
    const flat = out as unknown as Record<string, unknown> & {
      revealedFields: { keyLocations: string[]; notes: string | null }
    }
    expect(flat.altName).toBe(sampleLocation.altName)
    expect(flat.revealedFields.keyLocations).toEqual(['The Fold', 'The Gilded Cage'])
    expect(flat.revealedFields.notes).toBeNull()
  })

  it('revealed npcsPresent returns opaque pids, not raw NPC source IDs', () => {
    const out = filterEntityForPlayer(
      sampleLocation,
      'location',
      reveal({ entityType: 'location', entityId: 'gildmaw', visibility: 'revealed' }),
      [field('location', 'gildmaw', 'npcsPresent', true)],
      []
    )
    const flat = out as unknown as {
      revealedFields: { npcsPresent: string[] | null }
    }
    expect(flat.revealedFields.npcsPresent).not.toBeNull()
    // Source ids "avarus" must NOT appear in the response.
    for (const id of flat.revealedFields.npcsPresent!) {
      expect(id).not.toBe('avarus')
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    }
    expect(JSON.stringify(flat.revealedFields.npcsPresent)).not.toContain('avarus')
  })
})

const sampleFaction: Faction = {
  id: 'sentinels',
  name: 'Nova Sentinels',
  type: 'Military',
  alignment: 'Ally',
  color: 'var(--cyan)',
  leader: 'Nazura',
  founder: 'Leocraes',
  description: 'Intel org.',
  keyMembers: ['Nazura', 'Leocraes'],
  notes: ['note-zero', 'note-one'],
  tags: ['ally'],
}

describe('filterEntityForPlayer - Faction', () => {
  it('returns null for hidden faction', () => {
    expect(
      filterEntityForPlayer(
        sampleFaction,
        'faction',
        reveal({ entityType: 'faction', entityId: 'sentinels', visibility: 'hidden' }),
        [],
        []
      )
    ).toBeNull()
  })

  it('discovered shape returns type + alignment but not color, leader, or description', () => {
    const out = filterEntityForPlayer(
      sampleFaction,
      'faction',
      reveal({
        entityType: 'faction',
        entityId: 'sentinels',
        visibility: 'discovered',
        discoveredName: 'A friendly group',
      }),
      [],
      []
    )
    const flat = out as unknown as Record<string, unknown>
    expect(flat.type).toBe(sampleFaction.type)
    expect(flat.alignment).toBe(sampleFaction.alignment)
    // color is intentionally absent at the discovered tier — source values
    // include CSS variable names like `var(--sin-envy)` that leak the
    // sin/arc association of the faction.
    expect(flat.color).toBeUndefined()
    expect(flat.leader).toBeUndefined()
    expect(flat.description).toBeUndefined()
    expect(flat.name).toBeUndefined()
  })

  it('revealed shape gates leader/founder/keyMembers per field reveal', () => {
    const out = filterEntityForPlayer(
      sampleFaction,
      'faction',
      reveal({ entityType: 'faction', entityId: 'sentinels', visibility: 'revealed' }),
      [
        field('faction', 'sentinels', 'leader', true),
        field('faction', 'sentinels', 'founder', false),
        field('faction', 'sentinels', 'keyMembers:0', true),
        field('faction', 'sentinels', 'keyMembers:1', false),
      ],
      []
    )
    const flat = out as unknown as Record<string, unknown> & {
      revealedFields: { leader: string | null; founder: string | null; keyMembers: string[] }
    }
    expect(flat.revealedFields.leader).toBe('Nazura')
    expect(flat.revealedFields.founder).toBeNull()
    expect(flat.revealedFields.keyMembers).toEqual(['Nazura'])
  })
})

const sampleItem: Item = {
  id: 'relic',
  name: 'The Relic Stone',
  type: 'Artifact',
  description: 'Designed by the Aspirant.',
  properties: ['REAPER FUNCTION', 'COLLECTOR FUNCTION'],
  notes: 'Two moulds.',
  chapter: 1,
  tags: ['artifact'],
}

describe('filterEntityForPlayer - Item', () => {
  it('returns null for hidden item', () => {
    expect(
      filterEntityForPlayer(
        sampleItem,
        'item',
        reveal({ entityType: 'item', entityId: 'relic', visibility: 'hidden' }),
        [],
        []
      )
    ).toBeNull()
  })

  it('discovered shape uses found-name, not true name', () => {
    const out = filterEntityForPlayer(
      sampleItem,
      'item',
      reveal({
        entityType: 'item',
        entityId: 'relic',
        visibility: 'discovered',
        discoveredName: 'A strange stone',
      }),
      [],
      []
    )
    const flat = out as unknown as Record<string, unknown>
    expect(flat.displayName).toBe('A strange stone')
    expect(flat.name).toBeUndefined()
    expect(flat.description).toBeUndefined()
    expect(flat.type).toBe(sampleItem.type)
  })

  it('revealed shape exposes true name and gates properties per field reveal', () => {
    const out = filterEntityForPlayer(
      sampleItem,
      'item',
      reveal({ entityType: 'item', entityId: 'relic', visibility: 'revealed' }),
      [
        field('item', 'relic', 'properties:0', true),
        field('item', 'relic', 'properties:1', false),
        field('item', 'relic', 'notes', true),
      ],
      []
    )
    const flat = out as unknown as Record<string, unknown> & {
      revealedFields: { properties: string[]; notes: string | null }
    }
    expect(flat.displayName).toBe('The Relic Stone')
    expect(flat.name).toBe('The Relic Stone')
    expect(flat.revealedFields.properties).toEqual(['REAPER FUNCTION'])
    expect(flat.revealedFields.notes).toBe('Two moulds.')
  })
})

