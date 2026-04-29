
# Public Domain Authors Tracker

A new page in this project that tracks authors whose works have entered the public domain, computed per-jurisdiction (Canada, USA, UK, EU baseline) with room to expand. Seeded from Wikidata, with manual curation + override support.

## Scope (per your answers)
- Lives inside this Lovable project as `/public-domain`
- Hybrid data: Wikidata SPARQL seed + manual edits/overrides
- Jurisdictions at launch: **Canada, USA, UK, France, Germany** (easy to add more later)
- No auth gating on viewing; admin-only for editing/seeding

---

## Database (Lovable Cloud / Supabase)

### `pd_authors`
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| wikidata_qid | text unique | e.g. `Q937` (nullable for manual entries) |
| name | text | display name |
| sort_name | text | "Tolkien, J.R.R." |
| birth_year | int | nullable |
| death_year | int | nullable — null = "still living / unknown" |
| death_year_source | text | 'wikidata' \| 'manual' |
| nationality | text[] | ISO country codes |
| occupation | text[] | author, poet, composer, philosopher… |
| notable_works | jsonb | `[{title, year}]` |
| wikipedia_url | text | |
| image_url | text | Wikimedia thumb |
| notes | text | curator notes |
| manual_override | boolean | true = ignore future Wikidata refreshes |
| created_at, updated_at | timestamptz | |

### `pd_jurisdictions` (lookup, seeded)
| code | name | rule | frozen_until |
|---|---|---|---|
| CA | Canada | life + 70 (was 50 pre-2022; non-retroactive) | 2042-12-31 for deaths 1972–2021 |
| US | United States | life + 70, OR published before rolling cutoff (1929 in 2025, advances yearly) | null |
| UK | United Kingdom | life + 70 | null |
| FR | France | life + 70 (+ wartime extensions for some works) | null |
| DE | Germany | life + 70 | null |

### `pd_status` (computed cache, refreshed nightly + on edit)
| column | notes |
|---|---|
| author_id → pd_authors | |
| jurisdiction_code → pd_jurisdictions | |
| status | 'public_domain' \| 'protected' \| 'frozen' \| 'unknown' |
| enters_pd_year | int — when works enter PD in this jurisdiction |
| reasoning | text — short human explanation |

Compound unique on (author_id, jurisdiction_code).

RLS: public SELECT on all three; INSERT/UPDATE/DELETE require admin role (reuse existing `has_privilege_level` function).

---

## Edge functions

1. **`pd-wikidata-seed`** — Admin-triggered. Runs SPARQL against `https://query.wikidata.org/sparql` for authors/poets/composers/philosophers with known death dates. Upserts into `pd_authors` (skips rows where `manual_override = true`). Paginated, resumable, dry-run mode.

2. **`pd-recompute-status`** — Recomputes `pd_status` rows for one author or all. Pure function based on `death_year`, current year, and jurisdiction rules. Called after seed and after manual edits.

Status logic (per jurisdiction):
- Canada: if `death_year < 1972` → PD now. If 1972–2021 → frozen, enters PD `death_year + 70` but no earlier than 2042. If ≥2022 → `death_year + 70`.
- USA: `death_year + 70` for post-1978 works; flag pre-1929 published works as PD regardless.
- UK/FR/DE: `death_year + 70`.
- If `death_year` null → status `unknown`.

---

## UI

### `/public-domain` page
- Hero: short explainer + "as of April 2026" date and the rolling US cutoff year
- Toolbar: jurisdiction tabs (CA / US / UK / FR / DE / All), status filter (PD now / Entering soon / Frozen / Protected), search by name, sort (name, death year, enters PD year)
- Results: responsive table on desktop, card list on mobile. Columns: name, lifespan, nationality, status badge, "Enters PD" year, notable works
- Click row → drawer/dialog with full author detail, all jurisdictions side-by-side, Wikipedia link, curator notes, "Edit" button (admins only)

### `/public-domain/admin` (admin-only)
- "Seed from Wikidata" button (calls edge function with progress)
- Author edit form (override death year, toggle `manual_override`, edit notes)
- Bulk CSV export

### Nav
- Add "Public Domain" entry in `MainNavDropdown.tsx`

---

## Tech notes
- Reuse existing shadcn `Table`, `Tabs`, `Badge`, `Dialog`, `Drawer`, `Input`
- Reuse `useSearch`-style filter pattern from `src/components/filter/`
- Date helpers extend `src/utils/dateUtils.ts`
- Wikidata SPARQL endpoint is free, no key required; throttle to ~1 req/sec, set `User-Agent`

---

## Build phases
1. Migrations: 3 tables + RLS + seed `pd_jurisdictions`
2. `pd-recompute-status` edge function + unit-style test via dry-run param
3. `/public-domain` page (read-only, empty state)
4. `pd-wikidata-seed` edge function + admin trigger
5. Admin edit drawer + CSV export
6. Nav entry, polish, mobile pass

After approval I'll execute phases 1–3 first so you can see the page working with a small manual seed, then run the Wikidata import.
