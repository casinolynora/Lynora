# Phase 30C-C — GEO Content & Entity Enhancement — Pre-Implementation Baseline

## Date
2026-09-19

## Purpose
Snapshot the current state of GEO pages, cross-linking, and related content prior to Phase 30C-C implementation.

---

## Current GEO Page Implementation

### Supported GEOs
- **DE** (Germany) — hasCasinoData: true
- **FR** (France) — hasCasinoData: false (legal notice for restricted online casino games)
- **NL** (Netherlands) — hasCasinoData: true
- **BE** (Belgium) — hasCasinoData: true
- **AT** (Austria) — hasCasinoData: false
- **IT** (Italy) — hasCasinoData: false
- **CH** (Switzerland) — hasCasinoData: false
- **IE** (Ireland) — hasCasinoData: false

### GEO Page Structure (`src/app/[geo]/page.tsx`)
1. **BreadcrumbList schema** — Home → {Country}
2. **Flag + title** — "Best Online Casinos in {Country}"
3. **Intro paragraph** — Generic BeInCasinos intro
4. **Legal notice** (FR only) — ANJ regulatory notice
5. **Casino list** (DE/NL/BE only) — Linked cards with license badges, payment methods
6. **"Online Gambling in {Country}"** — Generic single-paragraph description (same across all GEOs)
7. **"How We Match Casinos for {Country}"** — Generic bullet list (same across all GEOs)
8. **Responsible Gambling** — Link to /responsible-gambling

### Current Weaknesses
- Content sections 6-7 are generic templates with zero country-specific detail
- No regulatory/licensing context per country
- No payment landscape section
- No cross-links to guides, compare, or methodology from GEO pages
- No FAQ schema for country-specific questions
- No "popular guides for {Country}" section
- No "compare casinos in {Country}" CTA

---

## Current Cross-Link Structure (from Phase 30C-B)

### Casino → GEO
✅ Implemented via `CasinoEntityLinks.tsx` — links to GEO countries

### Casino → Guide
✅ Implemented via `RelatedGuides.tsx` — deterministic by casino attributes

### Casino → Compare CTA
✅ Implemented via `CasinoCompareCTA.tsx`

### GEO → Casino
✅ Casino listing cards on GEO pages (DE/NL/BE)

### GEO → Guide
❌ Not implemented

### GEO → Compare
❌ Not implemented

### GEO → Methodology
❌ Not implemented

### Guide → Casino
❌ Not implemented

### Guide → Guide
❌ Not implemented (cross-linking between guides)

---

## Available Guides
1. `online-casino-basics` — Getting Started (always relevant)
2. `payment-methods-guide` — Payments
3. `casino-bonuses-explained` — Bonuses
4. `responsible-gambling-tips` — Responsible Gambling
5. `understanding-wagering-requirements` — Wagering
6. `casino-licensing-guide` — Licensing

---

## Test Status (Pre-Phase 30C-C)
- 593 tests passing
- TypeScript clean
- Build: 50 pages
- 8 pre-existing lint errors (unrelated)
