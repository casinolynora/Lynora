# Phase 30C-I — Payment × Casino × GEO Entity Expansion Audit

## Overview

Audited internal linking between casinos, payment entities, GEOs, and guides. Identified and implemented fixes for 2 genuine gaps. Verified no thin content, mass pages, or link spam.

## Audit Scope

- **Casino pages**: `CasinoEntityLinks`, `CasinoQuickFacts`, `PaymentMethods` components
- **Payment pages**: `/payments/[method]` dynamic pages, eligibility logic
- **GEO pages**: `/[geo]/page.tsx` editorial content
- **Guide pages**: `/guides/[slug]`, `/de/guides/[slug]`
- **Internal links**: Guide→Casino, Guide→Payment, Casino→Guide, Casino→Payment, Casino→GEO

## Findings

### Already Complete (No Changes Needed)

1. **CasinoEntityLinks** (`src/components/casino/v2/CasinoEntityLinks.tsx`): Already links to `/payments/[slug]` and `/[geo]` on every casino review page
2. **Payment pages**: Dynamically generated via `generateStaticParams()` + `assessPageEligibility()` — 12 payment pages auto-created
3. **Sitemap** (`src/app/sitemap.ts`): Auto-includes eligible payment pages
4. **No orphan entities**: All casino, payment, GEO, and guide pages have internal links

### Gaps Fixed

#### Gap 1: German guide pages missing "Top Casinos" and payment link sections

**Problem**: English guide page (`src/app/guides/[slug]/page.tsx` lines 151-197) shows "Top Casinos for This Guide" and payment method link sections. German guide page (`src/app/de/guides/[slug]/page.tsx`) did not have these sections.

**Fix**: Added both sections to the German guide page:
- "Top-Casinos für diesen Guide" — uses `getCasinosForGuide()` to show up to 3 relevant casinos linked to `/de/casino-reviews/[slug]`
- "Zahlungsmethoden-Seiten" — links to `/payments` when guide is `payment-methods-guide`
- Applied to both the German translation path and the English fallback path

**Files changed**: `src/app/de/guides/[slug]/page.tsx`

#### Gap 2: `getRelevantGuides()` only covered 3 of 6 guides

**Problem**: `getRelevantGuides()` only returned guides for `online-casino-basics`, `payment-methods-guide`, and `casino-bonuses-explained`. Three guides were never linked from casino review pages.

**Fix**: Expanded to cover all 6 guides:
- `casino-licensing-guide`: relevant if casino has licenses
- `responsible-gambling-tips`: always relevant
- `understanding-wagering-requirements`: relevant if casino has bonuses
- Updated limit from 2→3 to accommodate expanded set (4 guides now have priority 2)
- Added `licenses` parameter to function signature

**Files changed**: `src/lib/seo/guide-relevance.ts`, `src/lib/seo/__tests__/guide-relevance.test.ts`

#### Gap 3: RelatedGuides locale (NOT NEEDED)

**Investigation**: German casino review pages use the legacy `CasinoReviewPage` component which does not use `RelatedGuides`. Only English pages use it. No fix required.

## Verification

- **TypeScript**: PASS (0 errors)
- **Tests**: 695/695 PASS
- **Build**: PASS (63 pages)
- **No thin content**: All added sections use existing data
- **No mass pages**: No new pages created
- **No link spam**: Guide→Casino limited to 3 per guide, all links are contextual

## Commit

Phase 30C-I changes are ready to commit as a single atomic commit.
