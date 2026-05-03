# Death's Seven Wiki — Claude Code Context

## What This Is
A local Next.js DM tool for running **Death's Seven**, an original D&D 5e campaign. 20 chapters, Levels 3–20, four players. The app is used at the table during sessions.

## Stack
- **Next.js 14 + TypeScript** (App Router)
- **Tailwind CSS** + custom CSS variables (see `app/globals.css`)
- **libSQL** (`@libsql/client`) for local SQLite — session notes, encounter state
- Database file lives at `.wiki-data/wiki.db` (gitignored)

## Running Locally
```bash
npm install
npm run dev
# Opens at http://localhost:3000
```

## Project Structure
```
app/
  layout.tsx          # Root layout with Sidebar
  page.tsx            # Home dashboard
  chapters/           # Chapter navigator (lazy loads per chapter)
  npcs/               # NPC + creature database with stat blocks
  reference/          # Seven tabbed sections (Sins, Timeline, Party, etc.)
  encounter/          # Initiative tracker, HP tracking, conditions
  session-log/        # Live note capture + export to .md/.txt
  api/
    chapters/         # GET ?number=N loads individual chapter
    npcs/             # GET with ?q=, ?tag=, ?alignment= filters
    notes/            # CRUD for session notes
    export/           # POST generates .md or .txt download

components/
  ui/Sidebar.tsx      # Left nav

data/
  chapters/           # chapter01.ts through chapter20.ts + index.ts
  npcs/index.ts       # Full NPC + creature database (~25 entries)
  reference/index.ts  # All reference data (sins, locations, factions, items, mechanics, party, timeline)

lib/
  db.ts               # libSQL client + initDB()

types/
  index.ts            # All TypeScript interfaces
```

## Design System
All colors are CSS variables defined in `app/globals.css`:
- `--gold` / `--gold-dim` — primary accent
- `--orange`, `--purple`, `--cyan` — brand palette (Act I/II/III colors)
- `--sin-greed/lust/sloth/gluttony/envy/wrath/pride` — per-sin colors
- `--bg-deep/base/surface/raised/hover` — background hierarchy
- `--font-display` (Cinzel Decorative) / `--font-heading` (Cinzel) / `--font-body` (EB Garamond) / `--font-mono` (JetBrains Mono)

CSS utility classes: `.card`, `.boxed-text`, `.dm-note`, `.badge`, `.btn`, `.btn-primary`, `.btn-ghost`, `.search-input`, `.key-info-item`, `.combatant-row`, `.hp-bar`

## Campaign Context (Brief)
- **Campaign:** Death's Seven — party are reincarnated heroes chosen by Nyx to reap 7 Sins
- **Players:** Mikey (Rolando/Monk), Kilt (Michael/Fighter), Will (Thornvatore/Paladin), JT (Drazier/Bard)
- **Villain:** The Aspirant — used the party to collect all 7 Sins into himself via the Relic Stone
- **Acts:** I (Ch.1-8), II (Ch.9-16, ends "They didn't return"), III (Ch.17-20)
- **Current:** Session 1 of Chapter 1

## Common Tasks

### Add/update NPC or creature
Edit `data/npcs/index.ts` — add to the `npcs` array. The `statBlock` field is optional.

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
- Dark fantasy aesthetic throughout — no light themes
- All DM content should respect the `showDmNotes` toggle
- Maintain Cinzel/EB Garamond typography everywhere
