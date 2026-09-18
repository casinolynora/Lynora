# Phase 30C-B Baseline — Casino Profile Entity & Internal-Link Enhancement

> Commit: `e82aa51` (Phase 30C-A)
> Date: Phase 30C-B start

---

## Current State

### Route Count
- Static pages: 16
- Casino profiles (EN): 138 (`/casino-reviews/[slug]`)
- Casino profiles (DE): ~30+ (`/de/casino-reviews/[slug]`)
- Guide hub: 1 (`/guides`)
- Guide detail (EN): 3 (`/guides/[slug]`)
- Guide detail (DE): 3 (`/de/guides/[slug]`)
- GEO hubs: 8 (`/de`, `/fr`, `/nl`, `/be`, `/at`, `/it`, `/ch`, `/ie`)
- DE sub-pages: 4 (`/de/casinos`, `/de/best-casinos`, `/de/compare`, `/de/guides`)
- **Total: ~200+ routes**

### Sitemap Entries
- Static: 27
- Casino pages (EN): 138
- Guide pages (EN): 3
- DE casino pages: ~30+ (filtered by `c.countries.includes("DE")`)
- DE guide pages: 3
- **Total: ~200+ entries**

### Indexable URLs
All routes above are indexable except:
- `/api/*` (blocked by robots)
- Ad-hoc comparison states (`?casinos=`) — `noindex`

### Casino Profile Structure
Current casino profile (`/casino-reviews/[slug]`) contains:
1. Breadcrumbs: Home → Casinos → [Name]
2. CasinoHero: name, tagline, trust badges, license badges, stats, rating, CTA
3. EditorialReview
4. TrustSection: licenses, operator, verification status
5. BonusSection
6. PaymentMethods: deposit methods (badges), withdrawal methods (badges)
7. GamesSection
8. ResponsibleGambling
9. CasinoFAQ
10. Methodology section (text link to /methodology)
11. Sidebar: AffiliateCTA, CasinoQuickFacts
12. AffiliateDisclosure
13. RelatedCasinos

### Current Internal Links from Casino Profile
- → `/` (breadcrumb)
- → `/casinos` (breadcrumb)
- → `/methodology` (text link in methodology section)
- → `/casino-reviews/[slug]` (related casinos)
- External: affiliate links

### Missing Internal Links (Opportunities)
- ❌ Casino → GEO pages (based on `casino.countries`)
- ❌ Casino → Guide pages (contextual relevance)
- ❌ Casino → Comparison tool (CTA)
- ❌ Casino → Payment method detail pages (future)

### Related Casinos Logic
Current implementation (`composite-provider.ts`):
```
similarity = country overlap + live casino match + game overlap
```
- Country overlap: +1 per shared country
- Live casino match: +1 if both have/don't have live casino
- Game overlap: +1 per shared game category

**Missing:** Payment method overlap signal

### GEO Page Broken Link Issue
GEO page (`/[geo]/page.tsx`) links to `/${geo}/${casino.slug}` but no route exists at `src/app/[geo]/[slug]`. This is a **broken link** that must be fixed.

### AI Casino Match Indexing
`/ai-casino-match` is currently indexable with priority 0.7 in sitemap. This is a client-rendered tool page — should be `noindex`.

### Sitemap vs Indexable Reconciliation
Sitemap contains: static pages + casino pages + guide pages + DE sub-pages
Indexable pages: all routes that are not noindex/blocked

Categories:
- **A (Indexable + Sitemap):** All main pages ✓
- **B (Indexable + Intentionally excluded):** None currently
- **C (Not indexable + in Sitemap):** `/ai-casino-match` should be noindex but IS in sitemap
- **D (Canonical/excluded):** Ad-hoc comparisons are correctly noindex

### Tests
576/576 passing

### TypeScript
CLEAN

### Build
SUCCESS (50 pages)
