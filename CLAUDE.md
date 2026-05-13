# Death's Seven Wiki — Claude Code Context

## What This Is
A local Next.js campaign companion for **Death's Seven**, an original D&D 5e campaign. 20 chapters, Levels 3–20, four players. The app is used at the table during sessions and ships **two role-scoped UIs in one process**: the DM wiki under `/dm/*`, and the player companion under `/player/*`.

## Stack
- **Next.js 16 + TypeScript** (App Router, React 19)
- **Tailwind CSS v4** + custom CSS variables (see `app/globals.css`)
- **libSQL** (`@libsql/client`) for local SQLite — session notes, encounter state, auth sessions
- **Vitest + Testing Library** for unit/integration/component tests
- Database file lives at `.wiki-data/wiki.db` (gitignored)

## Running Locally
```bash
npm install
cp .env.local.example .env.local   # then set DM_PASSPHRASE_HASH (see README)
npm run dev
# Opens at http://localhost:3000
```

## Routes & Roles
| URL              | Audience    | Auth gate                           |
|------------------|-------------|-------------------------------------|
| `/`              | anyone      | none — landing / role selector      |
| `/join`          | players     | none — token entry                  |
| `/dm/*`          | DM          | `dm_session` cookie                 |
| `/player/*`      | players     | `player_session` cookie             |
| `/api/auth/*`    | anyone      | none (login + logout)               |
| `/api/dm/*`      | DM          | `dm_session` cookie                 |
| `/api/player/*`  | players     | `player_session` cookie             |

The DM passphrase comes from `DM_PASSPHRASE_HASH` (SHA-256) in `.env.local`. The four player tokens are auto-seeded into `player_tokens` on first DB init and printed once to the dev-server console (`PLAYER_TOKEN_SEEDS` in `lib/db.ts`). Sessions last 30 days, stored in `dm_sessions` / `player_sessions`.

## Project Structure
```
app/
  layout.tsx              # Root layout — html/body/fonts/globals only
  page.tsx                # Landing (role selector + DM passphrase form)
  join/page.tsx           # Player token entry
  dm/
    layout.tsx            # DM layout (sidebar shell)
    page.tsx              # DM dashboard
    chapters/             # Chapter navigator
    npcs/                 # NPC + creature database
    reference/            # Seven tabbed reference sections
    encounter/            # Initiative tracker
    session-log/          # Live note capture + export
    creatures/[id]        # Stat-block popout (used by CreatureLink)
    reveals/              # Reveal Manager (selective reveal control surface)
    players/              # Placeholder: player token management
  player/
    layout.tsx            # Player layout (header + bottom tabs)
    page.tsx              # Dashboard shell
    world/page.tsx        # World shell
    party/page.tsx        # Party shell
    journal/page.tsx      # Journal shell
  api/
    auth/{dm,player,logout}/route.ts   # POST endpoints
    dm/{chapters,npcs,notes,export}/route.ts  # DM data routes (auth-gated)
    dm/reveals/                         # Reveal Manager API: list, visibility/field PATCH, custom details CRUD, bulk, bulk-chapter
    player/profile/route.ts            # Placeholder authenticated player API
    player/{npcs,locations,factions,items}/route.ts  # Player entity endpoints — filtered through lib/reveal-filter.ts

middleware.ts             # Edge-runtime cookie-presence gate for /dm /player /api/dm /api/player

components/
  dm/Sidebar.tsx          # DM left-nav (Tabler icons, sign-out, DM View badge)
  dm/RevealManager/       # Reveal Manager UI (FilterBar, EntityRow, DetailPanel, PlayerPreview, BulkActions, VisibilityToggle)
  player/BottomTabs.tsx   # Player bottom tab bar (Dashboard/World/Party/Journal)
  player/PlayerShell.tsx  # Centered "Coming Soon" stub for empty player routes
  shared/CampaignHeader   # Reusable "Death's Seven" branding
  shared/ThemeProvider    # Stub for future role-based CSS variable overrides
  CreatureLink.tsx        # Inline chapter-prose link → hover card + popout window

data/                     # Chapter, NPC, and reference content. NPC interface now includes `appearance` (physical description, safe at discovered tier).

lib/
  db.ts                   # libSQL client + initDB() (seeds player_tokens; runs syncReveals() on the singleton client). Accepts an optional Client for tests.
  auth.ts                 # Session helpers: hashToken, hashPassphrase, create/validate/deleteSession, getSessionFromCookies, getSessionForRole
  colors.ts               # rgbaFromHex helper
  reveal-sync.ts          # Walks data/ entities and inserts entity_reveals + entity_field_reveals rows. Idempotent. Run from initDB().
  reveal-filter.ts        # SPOILER PROTECTION BOUNDARY. filterEntityForPlayer() — single source of truth for "what does a player see," used by both Player API and DM "See as Player" preview.
  reveal-data.ts          # loadReveals/loadRevealsByType/loadRevealForEntity — DB row → typed objects.
  reveal-entities.ts      # Look up source-of-truth entity by (type, id) from data files; type-guard helpers.

tests/                    # Vitest. helpers/ provide in-memory libSQL DBs and session/token factories.
                          # API integration tests use vi.mock('@/lib/db') + getter to swap in fresh in-memory DBs per test.

types/index.ts            # All TypeScript interfaces (incl. PlayerToken, DmSession, PlayerSession, SessionContext, UserRole)

docs/
  VISUAL_LANGUAGE.md      # Source-of-truth design spec
  IMPLEMENTATION_GUIDE.md
```

### Auth/session model (cheat sheet)
- **Two-layer gate.** Middleware (Edge runtime) only checks **cookie presence** — it can't hit libSQL. It redirects (`/dm/*` → `/?role=dm`, `/player/*` → `/join`) or returns 401 (`/api/dm/*`, `/api/player/*`) when the cookie is missing. Then **every** role-scoped surface re-validates against the DB:
  - `app/dm/layout.tsx` and `app/player/layout.tsx` (async server components) call `getSessionForRole(await cookies(), role)` and `redirect()` on null.
  - `/api/player/profile` and all four `/api/dm/*` handlers (`chapters`, `npcs`, `notes`, `export`) do the same and return 401 on null. `notes` factors this into a local `dmGuard()` helper since it has 4 method exports.
- Use `getSessionForRole(cookieStore, role)` for role-scoped surfaces (no DM-priority shadowing). Use `getSessionFromCookies(cookieStore)` only for "any valid session" lookups (none today).
- `createDmSession` / `createPlayerSession` insert a row with a 30-day expiry and return a `crypto.randomUUID()`. The session ID is the cookie value.
- DM passphrase is hashed at compare time only — only the hash lives on disk in `.env.local`. Player tokens are stored as SHA-256 hashes in `player_tokens.token_hash`; plaintext only ever appears in console seed output and `lib/db.ts` `PLAYER_TOKEN_SEEDS`.
- To rotate a player token: edit `PLAYER_TOKEN_SEEDS` then `DELETE FROM player_tokens` and restart the dev server (it'll reseed and reprint).

### Test setup
- `npm test` (one-off), `npm run test:watch`, `npm run test:coverage`.
- Tests live under `tests/` mirroring `app/`, `lib/`, `components/`, `middleware.ts`.
- DB tests use `tests/helpers/db.ts` `createTestDb()` for an isolated in-memory libSQL instance; **never** touch `.wiki-data/wiki.db` from tests.
- Auth API integration tests pattern: `vi.mock('@/lib/db', ...)` exposes a getter for `db` and a wrapped `initDB()` that points at a per-test in-memory client (see `tests/integration/api/auth/dm.test.ts`).
- libSQL gotcha: `db.transaction('write')` opens a separate connection that doesn't share schema with `:memory:` test databases. Use `db.batch(stmts, 'write')` instead for atomic multi-statement updates (see `app/api/dm/reveals/bulk/route.ts`).
- Reveal-system tests call `syncReveals(memory.db, { force: true, logger: { warn: () => {} } })` after `initDB()` because `initDB()` only auto-syncs the singleton client.

### Selective Reveal System

Player-facing visibility for NPCs / Locations / Factions / Items is gated by three database tables (`entity_reveals`, `entity_field_reveals`, `entity_custom_details`). The data files (`data/npcs/`, `data/reference/`) remain the source of truth for content; the DB only controls visibility.

**Visibility tiers (`entity_reveals.visibility`):**
- `hidden` — completely absent from `/api/player/*` responses
- `discovered` — only physical/observable info: NPC `appearance`, location type, faction type+alignment, item type. Display name comes from `discovered_name` (falls back to `???`).
- `revealed` — full base data + per-field reveals (notes, properties, key members, etc.) controlled by `entity_field_reveals`

**Field naming:** Array fields use `notes:0`, `notes:1`, `keyLocations:0`, `properties:0`, etc. Indexes are stable as long as the data file's array order doesn't change — if the DM reorders notes in `data/npcs/index.ts`, the indexes shift and any existing reveal toggles will mismatch their content. Acceptable tradeoff for the local single-DM use case.

**The filter is the source of truth:** [lib/reveal-filter.ts](lib/reveal-filter.ts) `filterEntityForPlayer()` is called by both Player API routes AND the DM "See as Player" preview. If the preview shows it, the player sees it. Don't add filtering anywhere else.

**Sync:** [lib/reveal-sync.ts](lib/reveal-sync.ts) walks the data files and inserts reveal rows for any entity that doesn't have one. Idempotent — never overwrites existing visibility/field state. Runs from `initDB()` on the singleton client (with a per-process latch). Tests must call it explicitly via `syncReveals(memory.db, { force: true })`.

**DM API routes** (under `/api/dm/reveals/`):
- `GET /` — full reveal records with filters (type, visibility, chapter, search)
- `PATCH /:type/:id` — visibility + discoveredName
- `PATCH /:type/:id/fields/:fieldName` — toggle one field
- `POST /bulk` — multi-entity visibility set (uses `db.batch()`, not `transaction()`)
- `POST /bulk-chapter` — set every entity for a chapter
- `POST/PATCH/DELETE /:type/:id/details[/...]` — custom detail CRUD + reorder

**Player API routes** (`/api/player/{npcs,locations,factions,items}`): each calls `loadRevealsByType` + `filterEntityForPlayer` and returns only visible entities.

**Editing the NPC interface:** `appearance` is a required physical-only field. When adding a new NPC, write a concise physical description with no plot/story context — that's what players see at the discovered tier.

## Design System
Kingdom Hearts-inspired midnight-blue palette. Full spec at [docs/VISUAL_LANGUAGE.md](docs/VISUAL_LANGUAGE.md) — that file is the source of truth; this section is the cheat sheet.

All tokens are CSS variables in `app/globals.css`:
- `--orange` / `--cyan` / `--purple` — brand palette (orange=warmth/action, cyan=wayfinding, purple=arcane). Acts I/II/III use cyan/orange/purple respectively.
- `--orange-dim`/`-bright`, `--cyan-dim`/`-bright`, `--purple-dim`/`-bright` — scale variants
- `--sin-greed/lust/sloth/gluttony/envy/wrath/pride` — per-sin colors
- `--status-success/warning/danger/info` — semantic UI states (HP, badges, etc.)
- `--bg-deep/base/surface/raised/hover` — midnight-blue background hierarchy
- `--text-primary` (cool white-blue) / `-secondary` / `-muted` / `-accent` (orange)
- `--border` / `--border-bright` / `--border-accent`
- `--glow-orange/cyan/purple/success/warning/danger` — rgba tokens for `box-shadow` glow only
- `--font-display` (Cinzel Decorative) / `--font-heading` (Cinzel) / `--font-body` (Inter) / `--font-mono` (JetBrains Mono)
- `--space-xs..2xl`, `--radius-sm/md/lg/xl/pill`, `--sidebar-w`

CSS utility classes: `.card`, `.boxed-text`, `.dm-note` (+ `.dm-note-label`), `.badge`, `.btn`/`.btn-primary`/`.btn-ghost`/`.btn-danger`, `.search-input`, `.key-info-item`, `.combatant-row` (+ `.active`/`.player`/`.enemy`), `.hp-bar` (+ `.hp-bar-fill.healthy`/`.wounded`/`.critical`), `.chapter-tab`, `.section-header`, `.section-type-bar.scene/.encounter/.prose/.npc`, `.nav-logo/.nav-section/.nav-item`, `.fade-in`, `.glow-pulse`.

### Tinting a color with opacity
The data files mix raw hex (`#f39c12`) and CSS vars (`var(--cyan)`) in the same `.color` fields. Pick the right helper:
- **Hex source** → `rgbaFromHex(hex, alpha)` from `@/lib/colors` (or the badge pattern: `color: X`, `border: rgba(X, 0.25)`, `bg: rgba(X, 0.08)`)
- **CSS var source** → `color-mix(in srgb, ${color} ${percent}%, transparent)` (see `app/reference/page.tsx` `tint()` helper)
- ❌ Never `color + '22'` / `${color}55` — silently produces invalid CSS for var() inputs.

### Glow rules (from spec)
- Glows are `box-shadow` only — never `filter: blur()` or `text-shadow`.
- Glow only on interactive/active states: `.btn-primary:hover`, `.card:hover`, `.search-input:focus`, `.nav-item.active`, `.combatant-row.active`, HP bars. Static cards/text get zero glow.
- `@keyframes glowPulse` reads `var(--pulse-color, var(--glow-cyan))` — override `--pulse-color` on an element to recolor the pulse (e.g. `.combatant-row.active` sets it to `--glow-orange`).

### Typography rules
- Cinzel never below 11px (0.6875rem). Smaller labels use Inter.
- At 11px Cinzel, set explicit `font-weight: 600` so the serifs still read.
- 0.5px default borders. The only 2px border is the left accent on cards/boxed-text/dm-notes/`.nav-item.active`.

## Campaign Context (Brief)
- **Campaign:** Death's Seven — party are reincarnated heroes chosen by Nyx to reap 7 Sins
- **Players:** Mikey (Rolando/Monk), Kilt (Michael/Fighter), Will (Thornvatore/Paladin), JT (Drazier/Bard)
- **Villain:** The Aspirant — used the party to collect all 7 Sins into himself via the Relic Stone
- **Acts:** I (Ch.1-8), II (Ch.9-16, ends "They didn't return"), III (Ch.17-20)
- **Current:** Session 1 of Chapter 1

## Common Tasks

### Add/update NPC or creature
Edit `data/npcs/index.ts` — add to the `npcs` array. The `statBlock` field is optional. Always include an `appearance` field (physical description only, no plot/story context — this is what players see at the discovered reveal tier). On the next dev-server restart, `syncReveals()` will create matching `entity_reveals` + `entity_field_reveals` rows defaulting to hidden.

### Update chapter content
Edit the relevant `data/chapters/chapterNN.ts`. Served via `/api/chapters?number=N`.

### Add a reference section tab
1. Add data to `data/reference/index.ts`
2. Add component function in `app/reference/page.tsx`
3. Add to `TABS` array at top of page

### Fix a stat block or NPC note
Edit `data/npcs/index.ts` — find by `id`, update `statBlock` or `notes`.

## Important Type Notes
- `tactics` in `Section` is `string | string[]` — handle both
- `bucket` in `Section` is optional — only appears in Ch.1
- `sessions` in `Chapter` is optional
- Chapter files are large (some 30KB+) — API lazy-loads, don't import all 20 at once

## Style Notes
- Kingdom Hearts midnight-blue aesthetic — no light themes, no warm-black backgrounds
- All DM content should respect the `showDmNotes` toggle
- Maintain Cinzel headings + Inter body throughout
- Use Tabler icons (`@tabler/icons-react`) for new iconography — no emoji in the UI chrome
