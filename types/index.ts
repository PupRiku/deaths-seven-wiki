// ============================================================
// DEADLY SEVEN WIKI — TYPE DEFINITIONS
// ============================================================

// --- CHAPTERS ---

export type SectionType = 'prose' | 'scene' | 'encounter' | 'npc'

export interface Section {
  title: string
  type: SectionType
  content?: string
  boxedText?: string
  boxedText2?: string
  keyInfo?: string[]
  creatures?: string[]
  tactics?: string | string[]
  dmNote?: string
  bucket?: {
    discovery: string
    encounter?: string
    aftermath?: string
    dmNote: string
  }
}

export interface Chapter {
  number: number
  title: string
  act: 1 | 2 | 3
  levelStart: number
  levelEnd: number
  summary: string
  sessions?: number
  sections: Section[]
  tags?: string[]
}

// Lightweight chapter metadata for index/navigation (no section content)
export interface ChapterMeta {
  number: number
  title: string
  act: 1 | 2 | 3
  levelStart: number
  levelEnd: number
  sectionCount: number
  summary: string
}



// --- NPCS ---

export type NPCStatus = 'Active' | 'Deceased' | 'Unknown' | 'Imprisoned'
export type NPCAlignment = 'Ally' | 'Enemy' | 'Neutral' | 'Complex'

export interface NPC {
  id: string
  name: string
  race: string
  role: string
  status: NPCStatus
  alignment: NPCAlignment
  location: string
  arc: string
  // Physical-description-only field. Safe to show at the discovered reveal
  // tier — must not contain plot, story context, or spoilers.
  appearance: string
  description: string
  personality: string
  notes: string[]
  firstAppearance: number // chapter number
  statBlock?: StatBlock
  tags: string[]
}

// --- STAT BLOCKS ---

export interface StatBlock {
  name: string
  cr: string
  ac: number
  hp: number | string
  speed: string
  str: number
  dex: number
  con: number
  int: number
  wis: number
  cha: number
  savingThrows?: string[]
  skills?: string[]
  damageImmunities?: string[]
  damageResistances?: string[]
  conditionImmunities?: string[]
  senses?: string
  languages?: string
  traits?: { name: string; description: string | string[] }[]
  actions?: { name: string; description: string | string[] }[]
  bonusActions?: { name: string; description: string | string[] }[]
  reactions?: { name: string; description: string | string[] }[]
  legendaryActions?: { name: string; description: string | string[] }[]
  legendaryResistances?: number
  image?: string // Path under /public — e.g. '/images/scavengerGoblin.png'
}

// --- SINS ---

export type SinName =
  | 'Greed'
  | 'Lust'
  | 'Sloth'
  | 'Gluttony'
  | 'Envy'
  | 'Wrath'
  | 'Pride'

export type SinStatus = 'Active' | 'Reaped' | 'Unknown'

export interface Sin {
  sin: SinName
  virtue: string
  host: string
  hostDescription: string
  location: string
  chapter: number
  status: SinStatus
  concept: string
  siphonEffect: string
  notes: string[]
  color: string
}

// --- PLAYER CHARACTERS ---

export interface PlayerCharacter {
  player: string
  characterName: string
  pastName: string
  pastRace: string
  pastClass: string
  newRace: string
  newClass: string
  background: string
  hp: number
  ac: number
  stats: {
    str: number
    dex: number
    con: number
    int: number
    wis: number
    cha: number
  }
  keyVulnerabilities: string[]
  keyStrengths: string[]
  personalArc: string
  homeland: string
  notes: string[]
}

// --- LOCATIONS ---

export interface Location {
  id: string
  name: string
  altName?: string
  type: string
  description: string
  sinArc?: SinName
  chapterIntroduced: number
  npcsPresent: string[]
  notes: string[]
  tags: string[]
}

// --- SESSION LOG ---

export interface SessionNote {
  id: string
  sessionNumber: number
  chapter: number
  date: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

// --- INITIATIVE TRACKER ---

export interface Combatant {
  id: string
  name: string
  initiative: number
  hp: number
  maxHp: number
  ac: number
  conditions: string[]
  isPlayer: boolean
  isEnemy: boolean
  notes: string
  color?: string
}

export interface EncounterState {
  id: string
  name: string
  round: number
  turn: number
  combatants: Combatant[]
  isActive: boolean
  createdAt: string
}

// --- SEARCH ---

export interface SearchResult {
  type: 'chapter' | 'npc' | 'location' | 'sin' | 'note'
  id: string
  title: string
  subtitle: string
  excerpt: string
  url: string
}

// --- EXPORT ---

export type ExportFormat = 'txt' | 'md'

export interface ExportOptions {
  format: ExportFormat
  includeChapters?: boolean
  includeSessions?: boolean
  sessionRange?: { start: number; end: number }
  chapterRange?: { start: number; end: number }
}

// === Auth & Session Types ===

export interface PlayerToken {
  id: string
  characterId: string
  characterName: string
  playerName: string
  tokenHash: string
  createdAt: string
  lastActiveAt: string | null
}

export interface DmSession {
  id: string
  createdAt: string
  expiresAt: string
}

export interface PlayerSession {
  id: string
  playerTokenId: string
  createdAt: string
  expiresAt: string
}

export type UserRole = 'dm' | 'player'

export interface SessionContext {
  role: UserRole
  characterId?: string      // Only present for player role
  characterName?: string    // Only present for player role
  playerName?: string       // Only present for player role
}

// === Selective Reveal System ===

export type EntityType = 'npc' | 'location' | 'faction' | 'item'
export type Visibility = 'hidden' | 'discovered' | 'revealed'

export interface EntityReveal {
  id: string
  entityType: EntityType
  entityId: string
  visibility: Visibility
  discoveredName: string | null
  chapterAssociation: number | null
  createdAt: string
  updatedAt: string
}

export interface EntityFieldReveal {
  id: string
  entityType: EntityType
  entityId: string
  fieldName: string
  isRevealed: boolean
  revealedAt: string | null
}

export interface EntityCustomDetail {
  id: string
  entityType: EntityType
  entityId: string
  title: string
  content: string
  isRevealed: boolean
  revealedAt: string | null
  createdAt: string
  sortOrder: number
}

// Faction and Item are stored in data/reference/index.ts as untyped const
// objects. Re-declare the shapes the reveal system uses so we don't have to
// retype them in lib/reveal-sync.ts or lib/reveal-filter.ts.
export interface Faction {
  id: string
  name: string
  type: string
  alignment: string
  color: string
  leader: string
  founder: string | null
  description: string
  keyMembers: string[]
  notes: string[]
  tags: string[]
}

export interface Item {
  id: string
  name: string
  type: string
  description: string
  properties: string[]
  notes: string
  location?: string
  chapter: number
  tags: string[]
}

// LOCATIONS in data/reference uses `chapters: number[]` plus `keyLocations`
// and a single `notes` string — a slight divergence from the typed Location
// interface. The reveal system treats `chapters[0]` as the chapter association
// and `notes` as a single field.
export interface ReferenceLocation {
  id: string
  name: string
  altName?: string
  type: string
  description: string
  sinArc: SinName | null
  chapters: number[]
  keyLocations: string[]
  npcsPresent?: string[]
  notes: string
  tags: string[]
}

// What a player sees. Hidden entities never become a PlayerEntity — they are
// simply absent from the API response.
export interface PlayerEntityBase {
  id: string
  entityType: EntityType
  visibility: 'discovered' | 'revealed'
  displayName: string
  tags: string[]
}

export interface PlayerNpcDiscovered extends PlayerEntityBase {
  entityType: 'npc'
  visibility: 'discovered'
  appearance: string
  image?: string
  firstAppearance: number
}

export interface PlayerNpcRevealed extends PlayerEntityBase {
  entityType: 'npc'
  visibility: 'revealed'
  name: string
  race: string
  role: string | null
  appearance: string
  description: string
  alignment: NPCAlignment
  location: string
  status: NPCStatus
  image?: string
  firstAppearance: number
  revealedFields: {
    role: string | null
    personality: string | null
    stat_block: StatBlock | null
    notes: string[]
  }
  customDetails: Array<{ id: string; title: string; content: string }>
}

export interface PlayerLocationDiscovered extends PlayerEntityBase {
  entityType: 'location'
  visibility: 'discovered'
  description: string // basic type info only
}

export interface PlayerLocationRevealed extends PlayerEntityBase {
  entityType: 'location'
  visibility: 'revealed'
  name: string
  altName: string | null
  type: string
  description: string
  sinArc: SinName | null
  chapters: number[]
  revealedFields: {
    keyLocations: string[]
    npcsPresent: string[] | null
    notes: string | null
  }
  customDetails: Array<{ id: string; title: string; content: string }>
}

export interface PlayerFactionDiscovered extends PlayerEntityBase {
  entityType: 'faction'
  visibility: 'discovered'
  type: string
  alignment: string
  color: string
}

export interface PlayerFactionRevealed extends PlayerEntityBase {
  entityType: 'faction'
  visibility: 'revealed'
  name: string
  type: string
  alignment: string
  color: string
  description: string
  revealedFields: {
    leader: string | null
    founder: string | null
    keyMembers: string[]
    notes: string[]
  }
  customDetails: Array<{ id: string; title: string; content: string }>
}

export interface PlayerItemDiscovered extends PlayerEntityBase {
  entityType: 'item'
  visibility: 'discovered'
  type: string
}

export interface PlayerItemRevealed extends PlayerEntityBase {
  entityType: 'item'
  visibility: 'revealed'
  name: string
  type: string
  description: string
  revealedFields: {
    properties: string[]
    notes: string | null
  }
  customDetails: Array<{ id: string; title: string; content: string }>
}

export type PlayerEntity =
  | PlayerNpcDiscovered
  | PlayerNpcRevealed
  | PlayerLocationDiscovered
  | PlayerLocationRevealed
  | PlayerFactionDiscovered
  | PlayerFactionRevealed
  | PlayerItemDiscovered
  | PlayerItemRevealed
