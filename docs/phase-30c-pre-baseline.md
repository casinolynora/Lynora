# Phase 30C-PRE — Baseline Documentation

## Current State: CasinoLynora

**Date:** 2026-09-18
**Commit:** (current HEAD)
**Status:** Pre-rebrand baseline

---

## 1. Project Overview

CasinoLynora is a production-grade Next.js casino review platform with:

- 138 verified casinos (0 draft)
- AI-powered casino matching system
- Comparison engine
- GEO architecture (DE, NL, BE, IE, FR)
- B2B operator listing system
- Editorial scoring system
- Player reviews & complaints
- Provenance/source tracking
- Import infrastructure

---

## 2. Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.3.4 | Framework (App Router) |
| React | 19.2.8 | UI |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Drizzle ORM | 0.45.2 | Database ORM |
| SQLite (better-sqlite3) | 13.0.3 | Database |
| Zod | 4.5.4 | Validation |
| Vitest | 5.x | Testing |

---

## 3. Routes

### Core Routes
- `/` — Homepage
- `/casinos` — Casino listing
- `/casino-reviews/[slug]` — Casino profile V2
- `/compare` — Casino comparison
- `/ai-casino-match` — AI matchmaker

### GEO Routes
- `/de` — Germany hub
- `/de/casinos` — German casinos
- `/de/best-casinos` — Verified German casinos
- `/de/guides` — German guides
- `/de/guides/[slug]` — German guide detail
- `/de/compare` — German comparison
- `/nl` — Netherlands hub
- `/be` — Belgium hub
- `/ie` — Ireland hub
- `/fr` — France hub

### B2B Routes
- `/for-casinos` — Operator landing
- `/for-casinos/pricing` — Pricing
- `/for-casinos/list-your-casino` — Submit listing
- `/for-casinos/contact` — Operator contact

### Trust/Policy Routes
- `/about` — About page
- `/methodology` — Scoring methodology
- `/responsible-gambling` — RG resources
- `/affiliate-disclosure` — Affiliate disclosure
- `/privacy-policy` — Privacy policy
- `/terms` — Terms of use
- `/contact` — Contact

### Technical Routes
- `/sitemap.ts` — Dynamic sitemap
- `/robots.ts` — Robots.txt

---

## 4. Components

### Layout Components (`src/components/layout/`)
- `Header.tsx` — Sticky header with navigation
- `Footer.tsx` — Site footer
- `CookieConsent.tsx` — Cookie consent banner

### Casino Components (`src/components/casino/`)
- `CasinoCard.tsx` — Casino list card
- `CasinoGrid.tsx` — Casino grid layout
- `CasinoReviewPage.tsx` — Review page wrapper
- `CasinoComparisonPage.tsx` — Comparison page wrapper
- `AffiliateCTA.tsx` — Affiliate call-to-action
- `AffiliateDisclosure.tsx` — Disclosure component
- `RatingDisplay.tsx` — Rating display
- `TrustBadge.tsx` — Trust badge
- `SearchBar.tsx` — Casino search
- `KeyFacts.tsx` — Quick facts
- `ProsCons.tsx` — Pros/cons display
- `FAQSection.tsx` — FAQ section
- `DataFreshness.tsx` — Data freshness indicator

### Casino V2 Components (`src/components/casino/v2/`)
- `CasinoHero.tsx` — Profile hero
- `CasinoQuickFacts.tsx` — Quick facts sidebar
- `EditorialReview.tsx` — Editorial review content
- `TrustSection.tsx` — Trust/verification section
- `BonusSection.tsx` — Bonus information
- `PaymentMethods.tsx` — Payment methods display
- `GamesSection.tsx` — Games catalog
- `PlayerReviews.tsx` — Player reviews
- `ComplaintSummary.tsx` — Complaint summary
- `ResponsibleGambling.tsx` — RG section
- `CasinoFAQ.tsx` — Casino FAQ
- `RelatedCasinos.tsx` — Related casinos
- `RelatedGuides.tsx` — Related guides

### Compare Components (`src/components/compare/`)
- Comparison table components

### Matchmaker Components (`src/components/matchmaker/`)
- `MatchmakerFlow.tsx` — AI matchmaker flow

### UI Components (`src/components/ui/`)
- `Button.tsx` — Button component
- `Badge.tsx` — Badge component
- `Container.tsx` — Container layout

### SEO Components (`src/components/seo/`)
- SEO-related components

### Analytics Components (`src/components/analytics/`)
- `AnalyticsInit.tsx` — Analytics initialization

---

## 5. Design System

### Colors (CSS Custom Properties)
```css
/* Brand palette — deep navy + emerald */
--brand-900: #0a1628;
--brand-800: #0f2240;
--brand-700: #152e54;
--brand-600: #1a3a68;
--brand-500: #1e4d8c;
--brand-400: #3b82f6;
--brand-300: #60a5fa;
--brand-200: #93c5fd;

/* Accent — refined emerald */
--accent-700: #047857;
--accent-600: #059669;
--accent-500: #10b981;
--accent-400: #34d399;
--accent-300: #6ee7b7;

/* Neutrals — warm slate */
--slate-950: #0c0f1a;
--slate-900: #111827;
--slate-800: #1e293b;
--slate-700: #334155;
--slate-600: #475569;
--slate-500: #64748b;
--slate-400: #94a3b8;
--slate-300: #cbd5e1;
--slate-200: #e2e8f0;
--slate-100: #f1f5f9;
--slate-50: #f8fafc;

/* Semantic */
--success: #059669;
--warning: #d97706;
--danger: #dc2626;
--info: #2563eb;

/* Surfaces */
--bg: #fafbfd;
--bg-subtle: #f1f4f9;
--surface: #ffffff;
--surface-elevated: #ffffff;
--surface-hover: #f8fafc;
--border: #e2e8f0;
--border-subtle: #f1f5f9;

/* Text */
--text-primary: #0f172a;
--text-secondary: #334155;
--text-muted: #64748b;
--text-faint: #94a3b8;
```

### Typography
- Display: Geist, Inter, system-ui
- Body: Geist, Inter, system-ui
- Mono: Geist Mono, JetBrains Mono

### Shadows
```css
--shadow-xs: 0 1px 2px rgba(0,0,0,0.04);
--shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
--shadow-md: 0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05);
--shadow-lg: 0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04);
--shadow-xl: 0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04);
```

### Radii
```css
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 14px;
--radius-xl: 20px;
--radius-2xl: 28px;
--radius-full: 9999px;
```

---

## 6. Current Branding

### Brand Name
- **Primary:** CasinoLynora
- **Abbreviation:** CL
- **Tagline:** AI-Powered Casino Matching

### Logo
- Desktop: "CL" gradient box + "CasinoLynora" text
- Mobile: "CL" gradient box only
- Favicon: "CL" on gradient background

### Current Colors
- Brand: Deep navy (#0a1628 to #3b82f6)
- Accent: Emerald (#047857 to #34d399)
- Theme color: #0f2240

### Current Fonts
- Sans: Geist, Inter, system-ui
- Mono: Geist Mono, JetBrains Mono

---

## 7. Metadata & SEO

### Homepage Title
```
CasinoLynora — AI-Powered Casino Matching
```

### Template
```
%s | CasinoLynora
```

### Meta Description
```
AI-powered casino discovery platform for European players. Structured, verified data on licenses, payment methods, and responsible gambling features for transparent decision-making.
```

### OpenGraph
- Type: website
- Locale: en_GB
- Site name: CasinoLynora

### Structured Data
- Organization schema
- WebSite schema with SearchAction
- Review schema (per casino)
- FAQPage schema (per casino)
- BreadcrumbList schema

---

## 8. Site Configuration

### Site URL
```
https://casinolynora.com
```

### Site Name
```
CasinoLynora
```

### Contact Emails
```
hello@casinolynora.com
affiliates@casinolynora.com
data@casinolynora.com
support@casinolynora.com
```

---

## 9. Navigation

### Primary Nav
1. Casinos
2. AI Matchmaker (highlighted)
3. Compare
4. Guides
5. About

### GEO Dropdowns
- Germany (DE)
- Netherlands (NL)
- Belgium (BE)

### Footer Sections
1. CasinoLynora (About, Methodology, RG, Contact)
2. Discover (Casinos, AI Matchmaker, Compare, Guides)
3. Germany (Home, Casinos, Verified, Guides)
4. For Operators (List, Pricing, Submit, Contact)
5. Legal (RG, Affiliate, Privacy, Terms)

---

## 10. Casino Card Structure

### Elements
1. Casino name (linked)
2. Tagline
3. Verification badge
4. License badges
5. Feature badges (Live Casino, Sports)
6. Info grid (Min Deposit, Payments, Games, Bonus)
7. Review CTA
8. Affiliate CTA

### Current CTA Text
- "Read Review"
- "Visit Casino" (affiliate)

---

## 11. Casino Profile V2 Structure

### Sections
1. Hero (name, tagline, verification, rating)
2. Quick Facts sidebar
3. Editorial Review
4. Trust Section
5. Bonus Section
6. Payment Methods
7. Games Section
8. Responsible Gambling
9. FAQ
10. Related Casinos
11. Related Guides
12. Affiliate CTA sidebar
13. Affiliate Disclosure

---

## 12. Comparison Page

### Features
- Up to 4 casinos
- Deterministic sorting
- Difference detection
- Payment overlap
- Dynamic URL parameters
- noindex for dynamic comparisons

---

## 13. GEO Pages

### Supported Markets
- Germany (DE) — has casino data
- Netherlands (NL) — has casino data
- Belgium (BE) — has casino data
- Ireland (IE) — no casino data
- France (FR) — no casino data (regulatory notice)

### Structure
1. Country header with flag
2. AI matchmaker CTA
3. Casino grid (if data available)
4. Guides section
5. Regulatory notices (if applicable)

---

## 14. B2B Pages

### Pages
1. `/for-casinos` — Operator landing
2. `/for-casinos/pricing` — Pricing tiers
3. `/for-casinos/list-your-casino` — Submit form
4. `/for-casinos/contact` — Operator contact

### Listing Tiers
- Basic (free)
- Verified
- Featured
- Premium

---

## 15. Public Assets

### Files
- `favicon.svg` — CL gradient icon
- `apple-touch-icon.svg` — Apple touch icon
- `og-image.svg` — OpenGraph image
- `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` — UI icons

---

## 16. Database

### Schema
- casinos (138 verified)
- player_reviews
- complaints
- moderation
- operators (empty)
- payment_methods
- casino_payment_methods

### Current State
- 138 verified casinos
- 0 draft casinos
- 138 production-visible

---

## 17. Tests

### Test Files
- `src/lib/compare/__tests__/compare.test.ts`
- `src/lib/engine/__tests__/scoring.test.ts`
- `src/lib/seo/__tests__/seo-infrastructure.test.ts`
- `src/components/casino/__tests__/CasinoCard.test.tsx`
- `src/components/casino/__tests__/CasinoReviewPage.test.tsx`
- `src/lib/b2b/__tests__/validation.test.ts`

---

## 18. Key Observations

### Strengths
1. Clean, modern design system
2. Strong component architecture
3. Comprehensive SEO setup
4. Clear brand identity (current)
5. Good accessibility foundations
6. Responsive design

### Areas for Rebrand
1. All "CasinoLynora" references need updating
2. Logo/favicon need new design
3. Color scheme may need adjustment
4. Typography choices to review
5. Tagline positioning to refine
6. Brand voice to establish

---

## 19. CasinoLynora References Found

### User-Facing Brand
- Header logo text
- Footer logo text
- Footer section title
- Footer copyright
- Homepage hero
- Homepage "Why CasinoLynora" section
- About page title/content
- All page titles (template)
- All page metadata
- B2B pages
- GEO pages
- Casino profile methodology

### Technical/Config
- `src/lib/config/site.ts` — SITE_NAME
- `src/lib/config/env.ts` — default URL
- `src/lib/analytics/events.ts` — cookie consent key
- `src/lib/seo/__tests__/seo-infrastructure.test.ts` — URL pattern
- `src/lib/b2b/__tests__/validation.test.ts` — test URL

### Structured Data
- Organization schema
- Review schema author
- Breadcrumb schemas
- B2B structured data

### Documentation
- `package.json` — name field
- `AGENTS.md` — project description
- Various `docs/` files

---

## 20. What NOT to Change

Per Phase 30C-PRE instructions:

1. **Database identifiers** — Keep historical IDs
2. **URL structure** — Preserve existing paths
3. **138 verified casinos** — No modifications
4. **Phase 30C batches 04-07** — Do not create
5. **Import infrastructure** — Do not modify
6. **Provenance system** — Do not remove
7. **Review moderation** — Do not remove
8. **B2B functionality** — Do not remove
9. **Comparison engine** — Do not modify
10. **GEO architecture** — Do not expand

---

## 21. Next Steps

1. Create brand direction document
2. Search and catalog all CasinoLynora references
3. Design new BeInCasinos identity
4. Update design system tokens
5. Replace logo/favicon
6. Update global shell
7. Rebuild homepage
8. Align core templates
9. Update SEO identity
10. Run QA
11. Commit

---

*Baseline documented: 2026-09-18*
