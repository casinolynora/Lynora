# Phase 28: Casino Profile V2

**Date**: 2026-09-17
**Status**: Complete

## Objective

Build CasinoLynora's next-generation Casino Profile V2 architecture — a reusable, scalable template that supports 100 → 3,000+ casinos.

## Profile Architecture

### Sections Implemented

| Section | Component | Data Source |
|---------|-----------|-------------|
| Hero / Quick Facts | `CasinoHero` | Casino data + player rating |
| Editorial Review | `EditorialReview` | `casino.review` JSON |
| Trust & Licensing | `TrustSection` | `casino.licenses`, verification |
| Key Facts | `CasinoQuickFacts` | All casino fields |
| Bonuses | `BonusSection` | `casino.bonuses` JSON |
| Payments | `PaymentMethods` | Normalized payment tables |
| Games | `GamesSection` | `casino.games` JSON |
| Responsible Gambling | `ResponsibleGambling` | `casino.responsibleGambling` JSON |
| FAQ | `CasinoFAQ` | Auto-generated + `casino.review.faq` |
| Related Casinos | `RelatedCasinos` | Provider similarity query |
| Affiliate CTA | Existing `AffiliateCTA` | `casino.affiliateOffers` |
| Affiliate Disclosure | Existing `AffiliateDisclosure` | Static |
| Breadcrumbs | Inline | Route-based |
| Structured Data | Inline JSON-LD | Review, FAQPage, BreadcrumbList |

### Component Architecture

```
CasinoProfileV2 (page)
├── Breadcrumbs
├── CasinoHero
│   ├── TrustBadge
│   ├── License badges
│   ├── Editorial Rating (separate)
│   ├── Player Rating (separate, labeled)
│   └── AffiliateCTA
├── Main Content (2/3 width)
│   ├── EditorialReview
│   │   ├── Overview
│   │   ├── Score Breakdown
│   │   ├── Pros & Cons
│   │   └── Verdict
│   ├── TrustSection
│   │   ├── Licenses with status
│   │   ├── Operator
│   │   └── Verification status
│   ├── BonusSection
│   ├── PaymentMethods (normalized)
│   ├── GamesSection
│   ├── ResponsibleGambling
│   ├── CasinoFAQ (auto-generated)
│   └── Methodology
├── Sidebar (1/3 width)
│   ├── Sticky AffiliateCTA
│   ├── AffiliateDisclosure
│   └── CasinoQuickFacts
├── AffiliateDisclosure (banner)
└── RelatedCasinos
```

## Data Sources

### Normalized Tables (Phase 26)
- `paymentMethods` → deposit/withdrawal methods
- `casinoPaymentMethods` → per-casino details
- `geoAvailability` → GEO filtering
- `casinoLicenses` → license data

### Trust Tables (Phase 27)
- `playerReviews` → approved reviews for display
- `complaints` → public complaint summary
- `moderationActions` → audit trail

### JSON Columns (Existing)
- `casino.review` → editorial content
- `casino.bonuses` → bonus terms
- `casino.games` → game categories
- `casino.responsibleGambling` → RG features

## Editorial vs Player Separation

### In Hero Section
```
Casinoname
★★★★★ CasinoLynora Rating: 85/100
─────────────────
Player Rating: 4.2/5
Based on 18 approved reviews
```

### Key Rules
- Editorial rating displayed prominently
- Player rating displayed separately, clearly labeled
- Player rating only shown when approved reviews exist
- No automatic merging of player ratings into editorial scores
- Commercial placement never affects either rating

## SEO Strategy

### Metadata
- Title: `{Name} Review — Is It Worth Playing? | CasinoLynora`
- Description: First 150 chars of overview + rating + license
- OpenGraph: Article type
- Canonical: `/casino-reviews/{slug}`

### Structured Data
- `Review` schema (editorial, not player)
- `FAQPage` schema (auto-generated from data)
- `BreadcrumbList` schema
- No fabricated `AggregateRating`

### GEO Handling
- Single canonical profile per casino
- No GEO-specific duplicate pages
- GEO availability shown in quick facts

## Conversion

### Affiliate CTA
- Sticky sidebar CTA
- Verdict section CTA
- Hero section CTA
- All use existing `AffiliateCTA` component
- Proper `rel="noopener noreferrer sponsored"` attributes

### B2B Separation
- Featured/Premium status never affects editorial score
- Paid placement clearly labeled
- Affiliate disclosure on every profile

## Performance

### Query Strategy
- Single `getCasinoBySlug` query
- Single `getRelatedCasinos` query
- No N+1 queries
- No loading all reviews into memory
- Pagination for reviews (future)

### Data Access
```
UI Components
    ↓
accessor/provider layer
    ↓
Database (SQLite/PostgreSQL)
```

## Empty States

| Scenario | Behavior |
|----------|----------|
| No reviews | "No player reviews yet." |
| No bonuses | "Bonus information not available." |
| No licenses | "License information not verified." |
| No payment data | Section hidden |
| No games | Section hidden |
| No FAQ | Section hidden |

## Security

- Player-generated content never rendered as raw HTML
- Affiliate URLs use `rel="noopener noreferrer sponsored"`
- No XSS vectors in review content
- Structured data validated against actual content

## Test Results

| Metric | Result |
|--------|--------|
| Total tests | 412 |
| TypeScript | Pass |
| Lint | Pass |
| Build | Pass |

## Files Created

### Components (13 new)
- `src/components/casino/v2/CasinoHero.tsx`
- `src/components/casino/v2/CasinoQuickFacts.tsx`
- `src/components/casino/v2/EditorialReview.tsx`
- `src/components/casino/v2/TrustSection.tsx`
- `src/components/casino/v2/BonusSection.tsx`
- `src/components/casino/v2/PaymentMethods.tsx`
- `src/components/casino/v2/GamesSection.tsx`
- `src/components/casino/v2/PlayerReviews.tsx`
- `src/components/casino/v2/ComplaintSummary.tsx`
- `src/components/casino/v2/ResponsibleGambling.tsx`
- `src/components/casino/v2/CasinoFAQ.tsx`
- `src/components/casino/v2/RelatedCasinos.tsx`
- `src/components/casino/v2/RelatedGuides.tsx`
- `src/components/casino/v2/index.ts`

### Page (modified)
- `src/app/casino-reviews/[slug]/page.tsx` — V2 profile

### Documentation
- `docs/phase-28-casino-profile-v2.md`

## Future Enhancements

1. **Player Reviews Integration** — Connect to Phase 27 review data
2. **Complaint Summary** — Display public complaints
3. **Pagination** — For reviews and complaints
4. **Mobile App Info** — If evidence exists
5. **Related Guides** — Connect to guide data
6. **Comparison Ready** — Components reusable for comparison pages
7. **AI Matchmaker** — Profile data ready for AI integration
