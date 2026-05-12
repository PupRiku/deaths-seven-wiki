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
  ui/Sidebar.tsx      # Left nav (Tabler icons)
  CreatureLink.tsx    # Inline creature link in chapter prose — hover card + pop-out window

data/
  chapters/           # chapter01.ts through chapter20.ts + index.ts
  npcs/index.ts       # Full NPC + creature database (~25 entries)
  reference/index.ts  # All reference data (sins, locations, factions, items, mechanics, party, timeline)

lib/
  db.ts               # libSQL client + initDB()
  colors.ts           # rgbaFromHex helper (hex → rgba). For CSS variables use color-mix() inline.

types/
  index.ts            # All TypeScript interfaces

docs/
  VISUAL_LANGUAGE.md  # Source-of-truth design spec (palette, type scale, component patterns)
  IMPLEMENTATION_GUIDE.md
```

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
- Kingdom Hearts midnight-blue aesthetic — no light themes, no warm-black backgrounds
- All DM content should respect the `showDmNotes` toggle
- Maintain Cinzel headings + Inter body throughout
- Use Tabler icons (`@tabler/icons-react`) for new iconography — no emoji in the UI chrome
