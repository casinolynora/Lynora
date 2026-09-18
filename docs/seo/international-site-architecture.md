# BeInCasinos — International Site Architecture

**Version:** 1.0
**Last Updated:** 2026-09-18
**Site URL:** https://beincasinos.com
**Current Scale:** 138 verified casinos, 168 licenses, 766 payment methods, 456 provenance records

---

## 1. Navigation Architecture

### 1.1 Primary Navigation (Desktop)

```
[Logo]  Casinos  AI Match  Compare  Guides  For Casinos  [Country Selector ▼]
```

| Slot | Label | Target | Notes |
|------|-------|--------|-------|
| 1 | Casinos | `/casinos` | Full listing, filterable |
| 2 | AI Match | `/ai-casino-match` | Questionnaire entry point |
| 3 | Compare | `/compare` | Ad-hoc comparison builder |
| 4 | Guides | `/guides` | Guide listing |
| 5 | For Casinos | `/for-casinos` | B2B landing |
| 6 | Country Selector | Dropdown → `/{geo}` | Shows 8 current GEOs + "More" link to full list |

### 1.2 Footer Navigation

```
Column 1: About        Column 2: Legal          Column 3: Support       Column 4: For Casinos
─────────────────     ──────────────────       ──────────────────     ──────────────────
About Us               Privacy Policy           Contact                List Your Casino
Methodology            Terms & Conditions      Responsible Gambling   Pricing
Affiliate Disclosure   Cookie Policy           AI Casino Match        B2B Contact
Our Team               Imprint                 Report an Issue        Partners
```

**Country Footer Row:**

```
Germany | Netherlands | Belgium | France | Ireland | Austria | Italy | Switzerland | More Countries →
```

### 1.3 Country Navigation

Each country page (`/{geo}`) renders a localized sub-navigation:

```
[Country Flag] {Country Name}   Best Casinos  Guides  Compare  Licenses  Payments  [Switch Country ▼]
```

| Slot | Label | Target | Notes |
|------|-------|--------|-------|
| 1 | Best Casinos | `/{geo}/best-casinos` | Top-rated for that country |
| 2 | Guides | `/{geo}/guides` | Country-specific guides |
| 3 | Compare | `/{geo}/compare` | Pre-filtered comparison |
| 4 | Licenses | `/{geo}/licenses` | Country licensing info |
| 5 | Payments | `/{geo}/payments` | Local payment methods |
| 6 | Switch Country | Dropdown → all GEOs | Same as global selector |

### 1.4 B2B Navigation

The `/for-casinos` section uses its own sub-nav:

```
For Casinos   Overview  Pricing  List Your Casino  Contact  FAQ
```

---

## 2. URL Hierarchy

### 2.1 Casino Entity URLs

| Pattern | Example | Index | Notes |
|---------|---------|-------|-------|
| `/casinos` | `/casinos` | Yes | Master listing, filterable |
| `/casino-reviews/{slug}` | `/casino-reviews/leo-vegas` | Yes | 1:1 with casino data |
| `/de/casino-reviews/{slug}` | `/de/casino-reviews/leo-vegas` | Yes | German-language review |
| `/de/casinos` | `/de/casinos` | Yes | German casino listing |
| `/de/best-casinos` | `/de/best-casinos` | Yes | Curated top list for DE |

**Canonical rule:** All casino review pages self-canonicalize to their `/casino-reviews/{slug}` path. Geo-prefixed variants (`/de/casino-reviews/{slug}`) canonicalize to the base path.

### 2.2 Country Entity URLs

| Pattern | Example | Index | Notes |
|---------|---------|-------|-------|
| `/{geo}` | `/de` | Yes | Country hub |
| `/{geo}/best-casinos` | `/de/best-casinos` | Yes | Curated top list |
| `/{geo}/casinos` | `/de/casinos` | Yes | Full listing for country |
| `/{geo}/guides` | `/de/guides` | Yes | Country guides listing |
| `/{geo}/guides/{slug}` | `/de/guides/online-casino-gesetze` | Yes | Country guide |
| `/{geo}/compare` | `/de/compare` | Yes | Pre-filtered comparison |
| `/{geo}/licenses` | `/de/licenses` | Yes | Licensing overview |
| `/{geo}/payments` | `/de/payments` | Yes | Local payment methods |
| `/{geo}/responsible-gambling` | `/de/responsible-gambling` | Yes | Country RG resources |

### 2.3 Payment Entity URLs

| Pattern | Example | Index | Notes |
|---------|---------|-------|-------|
| `/payments` | `/payments` | Yes | Payment methods index |
| `/payments/{slug}` | `/payments/skrill` | Yes | Payment method detail |
| `/payments/{slug}/casinos` | `/payments/skrill/casinos` | Yes | Casinos accepting method |
| `/{geo}/payments` | `/de/payments` | Yes | Local payment methods |
| `/{geo}/payments/{slug}` | `/de/payments/skrill` | Yes | Local payment detail |

### 2.4 Guide URLs

| Pattern | Example | Index | Notes |
|---------|---------|-------|-------|
| `/guides` | `/guides` | Yes | Guide listing |
| `/guides/{slug}` | `/guides/how-to-choose-casino` | Yes | Individual guide |
| `/{geo}/guides` | `/de/guides` | Yes | Country guides |
| `/{geo}/guides/{slug}` | `/de/guides/online-casino-gesetze` | Yes | Country guide |

### 2.5 Comparison URLs

| Pattern | Example | Index | Notes |
|---------|---------|-------|-------|
| `/compare` | `/compare` | Yes | Builder (dynamic content) |
| `/compare/{slug}` | `/compare/leo-vegas-vs-bet365` | Yes | Curated comparison |
| `/{geo}/compare` | `/de/compare` | Yes | Country-filtered builder |
| `/{geo}/compare/{slug}` | `/de/compare/leo-vegas-vs-bet365` | Yes | Country curated |

**Ad-hoc comparisons** built via the UI with query params (`?casinos=a,b,c`) are **noindexed**.
**Curated comparisons** at `/compare/{slug}` are **indexable** and editorially maintained.

### 2.6 B2B URLs

| Pattern | Example | Index | Notes |
|---------|---------|-------|-------|
| `/for-casinos` | `/for-casinos` | Yes | B2B landing |
| `/for-casinos/pricing` | `/for-casinos/pricing` | Yes | Pricing page |
| `/for-casinos/list-your-casino` | `/for-casinos/list-your-casino` | Yes | Submission form |
| `/for-casinos/contact` | `/for-casinos/contact` | Yes | B2B contact |

---

## 3. Entity Hierarchy

### 3.1 Casino (Core Entity)

The casino is the primary entity. Every other entity links to or from it.

```
Casino
├── Licenses (1:N) — issuer, jurisdiction, licenseNumber, status
├── Payment Methods (N:N) — via casino.paymentMethods array
├── Bonuses (1:N) — type, amount, wagering requirements
├── Games (N:N) — via casino.games array (categories, providers)
├── Countries (N:N) — available in / restricted from
├── Reviews (1:1) — editorial review with score breakdown
├── Affiliate Offers (1:N) — per-geo tracking URLs
└── Provenance Records (1:N) — data source tracking per field
```

### 3.2 Country

```
Country (code: DE, NL, BE, FR, IE, AT, IT, CH)
├── Casinos (N:N) — filtered by casino.countries
├── Licenses (N:N) — regulatory bodies + license types
├── Payment Methods (N:N) — locally popular methods
├── Guides (N:N) — country-specific content
├── Responsible Gambling (1:1) — local RG resources
└── Legal Context (1:1) — regulatory summary
```

### 3.3 License

```
License
├── Issuer (e.g., MGA, UKGC, Schleswig-Holstein)
├── Jurisdiction (e.g., Malta, UK, Germany)
├── Casinos (N:N) — casinos holding this license
└── Country (N:1) — primary regulatory jurisdiction
```

### 3.4 Payment Method

```
Payment Method (e.g., Skrill, PayPal, Giropay)
├── Type (e-wallet, card, bank-transfer, crypto, prepaid, mobile)
├── Casinos (N:N) — casinos offering this method
├── Countries (N:N) — regions where available
└── Fees/Limits (per-casino) — min/max deposit/withdrawal
```

### 3.5 Game Provider

```
Game Provider (e.g., NetEnt, Evolution, Pragmatic Play)
├── Games (1:N) — game titles
└── Casinos (N:N) — casinos hosting provider
```

### 3.6 Guide

```
Guide
├── Category (how-to, regulation, payment, strategy)
├── Countries (N:N) — country relevance tags
├── Related Casinos (N:N) — inline links
└── Related Guides (N:N) — internal linking
```

### 3.7 Comparison

```
Comparison
├── Casinos (2-5) — compared entities
├── Category (bonus, payment, games, trust)
├── Country (optional) — localized comparison
└── Verdict (1:1) — editorial summary
```

### 3.8 B2B Operator

```
B2B Operator (casino brand operator)
├── Casinos (1:N) — operated brands
├── Licenses (N:N) — held licenses
└── Listings (1:N) — B2B submissions
```

---

## 4. Country Architecture

### 4.1 Current GEOs

| GEO | Country | Code | Language | Has Dedicated Pages | Casino Count | Rationale |
|-----|---------|------|----------|---------------------|--------------|-----------|
| `/de` | Germany | DE | DE | Full sub-site | 30+ | Regulated market (GlüStV), high search demand, unique licensing |
| `/nl` | Netherlands | NL | NL | Hub + listings | 15+ | Regulated market (KSA), Dutch-language content needed |
| `/be` | Belgium | BE | NL/FR | Hub + listings | 8+ | Regulated market (KSCC), bilingual |
| `/fr` | France | FR | FR | Hub only | 5+ | Regulated (ANJ), but limited casino scope |
| `/ie` | Ireland | IE | EN | Hub only | 5+ | Regulated market, English-speaking |
| `/at` | Austria | AT | DE | Hub only | 5+ | German-speaking, regulatory overlap with DE |
| `/it` | Italy | IT | IT | Hub only | 5+ | Regulated market (ADM), high demand |
| `/ch` | Switzerland | CH | DE/FR/IT | Hub only | 3+ | Regulated (Gespa), small but affluent |

### 4.2 Country Page Creation Rules

A country receives a dedicated page (`/{geo}`) when **at least 4** of these criteria are met:

| # | Criterion | Weight | Evidence Source |
|---|-----------|--------|-----------------|
| 1 | **Search demand** — monthly search volume for "[country] online casino" exceeds 1,000 | High | Ahrefs/SEMrush |
| 2 | **Regulatory relevance** — country has active gambling regulation or recent legislation | High | Legal research |
| 3 | **Available casinos** — 5+ verified casinos serve this country | High | `casino.countries` field |
| 4 | **Licensing context** — country has its own licensing body or recognizes specific licenses | Medium | License data |
| 5 | **Payment methods** — 3+ locally popular payment methods exist (iDEAL, Giropay, Boku, etc.) | Medium | Payment data |
| 6 | **Local restrictions** — country has restrictions that affect casino availability | Medium | `casino.restrictedCountries` |
| 7 | **Unique content** — country-specific regulations, taxes, or player protections justify unique content | Medium | Editorial judgment |
| 8 | **Affiliate availability** — 3+ active affiliate offers for this GEO | Low | `affiliateOffers` data |

### 4.3 Future Country Candidates

| Country | Code | Priority | Barrier | Notes |
|---------|------|----------|---------|-------|
| Spain | ES | High | Licensing (DGOJ) | Large market, regulated |
| Portugal | PT | Medium | Limited casinos | Smaller regulated market |
| Poland | PL | Medium | Restrictive law | Limited casino access |
| Sweden | SE | High | Spelinspektionen | Regulated, mature market |
| Denmark | DG | Medium | Spillemyndigheden | Regulated, smaller |
| Finland | FI | Low | State monopoly | Limited private operators |
| Greece | GR | Medium | EEEP regulation | Emerging market |
| Romania | RO | Medium | ONJN regulation | Growing market |
| Czech Republic | CZ | Low | Restrictive | Limited operators |
| Japan | JP | Low | Complex regulation | Long-term opportunity |

### 4.4 Country Page Content Requirements

Every country page **must** include:

1. **Regulatory overview** — current legal status, licensing body, key laws
2. **Casino listing** — casinos available in that country (from `casino.countries`)
3. **Payment methods** — locally popular deposit/withdrawal options
4. **Responsible gambling** — local RG organizations and helplines
5. **FAQ** — 3-5 country-specific questions with structured data

Country pages **should** include:

6. **Bonus comparison** — welcome bonuses for that country
7. **Tax information** — player tax obligations (if applicable)
8. **Language availability** — which casinos support local language
9. **Mobile gambling** — local mobile adoption context

---

## 5. Payment Architecture

### 5.1 Payment Method Categorization

Of 766 payment methods, organize into tiers:

| Tier | Criteria | Count (est.) | Page Strategy |
|------|----------|-------------|---------------|
| **Tier 1: Major** | Available in 50+ countries, 100+ casinos | ~15 | Individual page (`/payments/{slug}`) |
| **Tier 2: Regional** | Available in 10-49 countries, 20-99 casinos | ~50 | Individual page if search demand > 500/mo |
| **Tier 3: Niche** | Available in <10 countries, <20 casinos | ~200 | Category pages only |
| **Tier 4: Deprecated** | No longer active or <5 casinos | ~500 | No dedicated pages |

### 5.2 Tier 1 Payment Methods (Individual Pages)

These deserve dedicated pages with full content:

| Method | Type | Slug | Priority |
|--------|------|------|----------|
| PayPal | e-wallet | `paypal` | Critical |
| Skrill | e-wallet | `skrill` | Critical |
| Neteller | e-wallet | `neteller` | Critical |
| Visa | card | `visa` | Critical |
| Mastercard | card | `mastercard` | Critical |
| Bank Transfer | bank-transfer | `bank-transfer` | High |
| Bitcoin | crypto | `bitcoin` | High |
| Apple Pay | mobile | `apple-pay` | High |
| Giropay | bank-transfer | `giropay` | High (DE) |
| iDEAL | bank-transfer | `ideal` | High (NL) |
| Trustly | bank-transfer | `trustly` | High |
| PaySafeCard | prepaid | `paysafecard` | Medium |
| EcoPayz | e-wallet | `ecopayz` | Medium |
| MuchBetter | e-wallet | `muchbetter` | Medium |
| Interac | bank-transfer | `interac` | Medium (CA) |

### 5.3 Payment Method Page Template

```
/payments/{slug}
├── Hero: Method name, logo, type badge
├── Overview: What is {method}, how it works
├── Casinos: Table of casinos accepting (linked from casino.paymentMethods)
├── Fees & Limits: Min/max deposit/withdrawal across casinos
├── Pros & Cons: Editorial assessment
├── How to Deposit: Step-by-step guide
├── How to Withdraw: Step-by-step guide
├── Security: Encryption, buyer protection
├── FAQ: 3-5 questions with FAQPage schema
├── Related Methods: Similar payment options
└── BreadcrumbList: Home > Payments > {method}
```

### 5.4 Payment Page Creation Rules

A payment method receives a dedicated page when:

1. **Availability** — available at 20+ verified casinos
2. **Search demand** — monthly search volume for "{method} casino" exceeds 500
3. **Casino data** — payment method name matches a canonical entry in `casino.paymentMethods`
4. **Country relevance** — primary market has a dedicated country page

**Canonical name mapping:** Normalize payment method names (e.g., "Skrill" not "Skrill Limited", "PayPal" not "PayPal Holdings").

### 5.5 Payment Index Pages

| URL | Content | Index |
|-----|---------|-------|
| `/payments` | All payment methods, grouped by type | Yes |
| `/payments/{slug}` | Individual method detail | Yes |
| `/payments/{slug}/casinos` | Casinos accepting method | Yes |
| `/{geo}/payments` | Country-specific payment methods | Yes |

---

## 6. Comparison Architecture

### 6.1 Ad-Hoc Comparisons (Dynamic)

Built via the comparison UI at `/compare`. User selects 2-5 casinos.

| Aspect | Rule |
|--------|------|
| URL pattern | `/compare?casinos=leo-vegas,bet365,casino888` |
| Indexing | **noindex** via `<meta name="robots" content="noindex, nofollow">` |
| Canonical | Self-referencing (each unique param set is its own canonical) |
| Crawlability | Not linked from sitemap; internal links use `nofollow` |
| Content | Dynamic rendering from casino data, no unique editorial |

### 6.2 Curated Comparisons (Indexable)

Editorially created, permanent comparison pages.

| Aspect | Rule |
|--------|------|
| URL pattern | `/compare/{slug}` (e.g., `/compare/leo-vegas-vs-bet365`) |
| Indexing | **index** |
| Canonical | Self-referencing to `/compare/{slug}` |
| Sitemap | Included in sitemap |
| Content | Unique editorial text, score breakdown, verdict |
| Casino limit | Maximum 5 per comparison |
| Schema | ComparisonReview or ItemList schema |

### 6.3 Curated Comparison URL Patterns

```
/compare/leo-vegas-vs-bet365
/compare/best-paypal-casinos
/compare/best-live-casinos-2026
/compare/no-wagering-bonus-casinos
/compare/fastest-withdrawal-casinos
```

**Slug conventions:**
- Head-to-head: `{casino-a}-vs-{casino-b}` (alphabetical order)
- Category: `best-{category}-{year}` or `best-{category}-casinos`

### 6.4 Maximum 5 Casinos Per Comparison

This constraint ensures:
- Page remains scannable and useful
- No thin-content risk (each casino has real data to compare)
- Structured comparison tables stay readable on mobile
- Affiliate disclosure remains proportionate

---

## 7. Guide Architecture

### 7.1 Current State

3 guides at `/guides/{slug}`. Each guide page includes:
- Long-form editorial content
- Internal links to related casino profiles
- BreadcrumbList schema
- Last updated date

### 7.2 Guide Categories

| Category | Slug Prefix | Content Type | Examples |
|----------|-------------|--------------|----------|
| **How-To** | (none) | Player guides | "How to Choose an Online Casino" |
| **Regulation** | `regulation-` | Legal/country guides | "German Online Casino Laws 2026" |
| **Payment** | `payment-` | Payment method guides | "How to Deposit with Skrill" |
| **Strategy** | `strategy-` | Game strategy | "Blackjack Basic Strategy" |
| **Country** | `country-` | Country-specific | "Best Casinos in the Netherlands" |

### 7.3 Guide-to-Entity Linking

Every guide must link to at least:

1. **2-3 casino profiles** — using `casino-reviews/{slug}` links
2. **1-2 country pages** — if country-relevant, link to `/{geo}`
3. **1-2 payment methods** — if payment-relevant, link to `/payments/{slug}`

**Bidirectional linking:** Casino profiles link back to relevant guides via "Related Guides" section.

### 7.4 Guide Scaling Rules

| Scale | Guide Count | Content Requirement |
|-------|-------------|---------------------|
| Current | 3 | 1,500+ words, 3+ casino links |
| Medium | 15-25 | 1,500+ words, 5+ casino links, schema |
| Large | 50-100 | 2,000+ words, 5+ casino links, FAQ schema |

---

## 8. Internal Linking Rules

### 8.1 Homepage Linking

The homepage (`/`) must link to:

| Target | Link Text | Section |
|--------|-----------|---------|
| `/casinos` | "Browse All Casinos" | Hero or primary CTA |
| `/ai-casino-match` | "Find Your Perfect Casino" | Hero CTA |
| `/compare` | "Compare Casinos" | Secondary CTA |
| `/guides` | "Read Our Guides" | Content section |
| `/de` | "Deutsche Casinos" | Country flags section |
| `/nl` | "Nederlandse Casino's" | Country flags section |
| `/for-casinos` | "List Your Casino" | Footer or B2B CTA |
| Top 5 casino profiles | Casino names | Featured section |

### 8.2 Casino Profile Linking

Each `/casino-reviews/{slug}` page must link to:

| Target | Section | Notes |
|--------|---------|-------|
| `/casinos` | Breadcrumb | Back to listing |
| Related casino profiles | "Related Casinos" | 3-5 via `getRelatedCasinos()` |
| `/{geo}/casino-reviews/{slug}` | Language switcher | If geo content exists |
| Relevant guides | "Related Guides" | 2-3 contextual links |
| `/payments/{slug}` | Payment section | For each payment method |
| `/compare/{slug}` | CTA or footer | If curated comparison exists |
| `/responsible-gambling` | Footer / RG section | Always |

### 8.3 Country Page Linking

Each `/{geo}` page must link to:

| Target | Section |
|--------|---------|
| `/casinos` | "View All Casinos" |
| `/{geo}/best-casinos` | Hero CTA |
| `/{geo}/casinos` | Country casino listing |
| `/{geo}/guides` | Country guides |
| `/{geo}/payments` | Local payment methods |
| `/{geo}/licenses` | Licensing info |
| `/{geo}/compare` | Country comparison |
| Other country pages | "More Countries" section |

### 8.4 Payment Page Linking

Each `/payments/{slug}` page must link to:

| Target | Section |
|--------|---------|
| `/payments` | Breadcrumb |
| Casinos accepting method | Table / listing |
| Related payment methods | Sidebar or footer |
| `/{geo}/payments/{slug}` | If geo variant exists |

### 8.5 Guide Linking

Each `/guides/{slug}` page must link to:

| Target | Section |
|--------|---------|
| `/guides` | Breadcrumb |
| Casino profiles | Inline editorial links |
| Country pages | If country-relevant |
| Payment methods | If payment-relevant |
| Related guides | "Related Guides" section |

### 8.6 Cross-Entity Linking Matrix

| From ↓ / To → | Casino | Country | Payment | Guide | Comparison |
|----------------|--------|---------|---------|-------|------------|
| **Casino** | — | Via `countries` | Via `paymentMethods` | Editorial | Via `compare/{slug}` |
| **Country** | Via listing | — | Via local methods | Via guides | Via `/{geo}/compare` |
| **Payment** | Via casino table | Via availability | — | Editorial | — |
| **Guide** | Editorial | Editorial | Editorial | — | — |
| **Comparison** | Via casino list | Via geo variant | — | — | — |

---

## 9. Canonical Rules

### 9.1 Self-Referencing Canonicals

Every indexable page must have a self-referencing canonical:

```html
<link rel="canonical" href="https://beincasinos.com/casino-reviews/leo-vegas" />
```

### 9.2 Geo-Canonical Rules

| Page | Canonical Target | Reason |
|------|------------------|--------|
| `/de/casino-reviews/leo-vegas` | `/casino-reviews/leo-vegas` | Content is translated, not unique |
| `/de/best-casinos` | `/de/best-casinos` | Unique curated content for DE |
| `/de/guides/{slug}` | `/guides/{slug}` | Translated guide, not unique |
| `/{geo}` | `/{geo}` | Unique country hub |
| `/{geo}/best-casinos` | `/{geo}/best-casinos` | Unique curated content |

**Rule:** If a geo-prefixed page contains the same editorial content as the base page (translated), canonicalize to the base. If it contains unique geo-specific content, self-canonicalize.

### 9.3 Pagination Canonicals

| Scenario | Canonical | Rules |
|----------|-----------|-------|
| `/casinos?page=2` | `/casinos?page=2` | Each page self-canonicalizes |
| `/de/casinos?page=2` | `/casinos?page=2` | Geo pagination canonicalizes to base |
| No page param | `/casinos` | Default page is canonical |

### 9.4 Parameter Canonicals

| Parameter | Example | Canonical Rule |
|-----------|---------|----------------|
| `?casinos=` | `/compare?casinos=a,b` | Ad-hoc → noindex (canonical irrelevant) |
| `?country=` | `/casinos?country=DE` | Canonicalize without param; param is for UX only |
| `?sort=` | `/casinos?sort=rating` | Canonicalize without param; sort is for UX only |
| `?page=` | `/casinos?page=2` | Self-canonicalize with param |

### 9.5 Canonical Implementation

```typescript
// In each page component:
export const metadata = {
  alternates: {
    canonical: `${SITE_URL}/casino-reviews/${casino.slug}`,
  },
};
```

---

## 10. Indexing Rules

### 10.1 Pages to Index

| Page | Priority | Change Frequency |
|------|----------|------------------|
| `/` | 1.0 | weekly |
| `/casinos` | 0.9 | weekly |
| `/casino-reviews/{slug}` | 0.8 | weekly |
| `/ai-casino-match` | 0.9 | monthly |
| `/compare` | 0.8 | monthly |
| `/compare/{slug}` | 0.7 | monthly |
| `/guides` | 0.7 | monthly |
| `/guides/{slug}` | 0.7 | monthly |
| `/{geo}` | 0.9 | weekly |
| `/{geo}/best-casinos` | 0.8 | weekly |
| `/{geo}/casinos` | 0.8 | weekly |
| `/{geo}/guides` | 0.7 | monthly |
| `/{geo}/guides/{slug}` | 0.7 | monthly |
| `/{geo}/compare` | 0.7 | monthly |
| `/{geo}/licenses` | 0.6 | monthly |
| `/{geo}/payments` | 0.6 | monthly |
| `/payments` | 0.6 | monthly |
| `/payments/{slug}` | 0.5 | monthly |
| `/for-casinos` | 0.6 | monthly |
| `/for-casinos/pricing` | 0.5 | monthly |
| `/for-casinos/list-your-casino` | 0.5 | monthly |
| `/about` | 0.5 | monthly |
| `/methodology` | 0.5 | monthly |
| `/responsible-gambling` | 0.5 | monthly |
| `/affiliate-disclosure` | 0.3 | monthly |
| `/contact` | 0.3 | monthly |
| `/privacy-policy` | 0.3 | monthly |
| `/terms` | 0.3 | monthly |

### 10.2 Pages to Noindex

| Page | Reason |
|------|--------|
| `/compare?casinos=...` (ad-hoc) | Dynamic, thin, duplicate risk |
| `/api/*` | Not user-facing |
| `/for-casinos/contact` | Form page, low SEO value |

### 10.3 robots.txt Rules

```typescript
// Current implementation in src/app/robots.ts
{
  userAgent: "*",
  allow: "/",
  disallow: ["/api/"],
}
```

**Future additions:**

```
Disallow: /compare?*casinos=    # Ad-hoc comparisons
Disallow: /*?sort=              # Sort params
Disallow: /*?page=              # Pagination (keep crawlable, but disallow to save budget)
```

### 10.4 Sitemap Rules

The sitemap (`/sitemap.xml`) must include:

1. **Static pages** — all indexable static routes
2. **Casino pages** — all `verified` status casinos
3. **Guide pages** — all published guides
4. **Geo pages** — all active country hubs + country-specific listings
5. **Curated comparisons** — all `/compare/{slug}` pages
6. **Payment pages** — all Tier 1 + Tier 2 payment pages

**Exclude from sitemap:**
- `/compare?casinos=...` (ad-hoc)
- `/api/*`
- Draft/pending casino pages
- Pages with `noindex` meta

**Sitemap scaling:** If total URLs exceed 50,000, split into sitemap index:

```
/sitemap.xml                    → sitemap index
/sitemap-pages.xml              → static pages
/sitemap-casinos.xml            → casino profiles
/sitemap-guides.xml              → guides
/sitemap-de.xml                 → DE-specific pages
/sitemap-nl.xml                 → NL-specific pages
/sitemap-payments.xml           → payment pages
/sitemap-comparisons.xml        → curated comparisons
```

---

## 11. Scaling Model

### 11.1 Current Scale: 138 Casinos

| Metric | Count |
|--------|-------|
| Casino profiles | 138 |
| Country pages | 8 |
| Guide pages | 3 |
| Payment pages | 0 (planned: 15) |
| Comparison pages | 0 (planned: 10) |
| **Total indexable URLs** | ~170 |

**Status:** Manageable. All data in-memory TypeScript. No performance concerns.

### 11.2 Medium Scale: 500+ Casinos

| Metric | Count |
|--------|-------|
| Casino profiles | 500+ |
| Country pages | 15-20 |
| Guide pages | 25 |
| Payment pages | 50 |
| Comparison pages | 30 |
| **Total indexable URLs** | ~650 |

**Required changes:**

1. **Database migration** — Move from in-memory to SQLite/PostgreSQL
2. **Sitemap splitting** — Sitemap index with 6+ child sitemaps
3. **Guide content** — Scale to 25 guides with unique content per country
4. **Payment pages** — 50 payment method pages with editorial content
5. **Comparison pages** — 30 curated comparisons with verdicts
6. **Internal linking automation** — Dynamic "Related Casinos" via data queries
7. **Page generation** — ISR (Incremental Static Regeneration) for casino pages

### 11.3 Large Scale: 1,000+ Casinos

| Metric | Count |
|--------|-------|
| Casino profiles | 1,000+ |
| Country pages | 25-30 |
| Guide pages | 75 |
| Payment pages | 100 |
| Comparison pages | 75 |
| **Total indexable URLs** | ~1,300 |

**Required changes:**

1. **Thin-page prevention** — Only index casinos with `verificationStatus: "verified"`
2. **Content depth** — Casino profiles must have 500+ words of unique review content
3. **Programmatic SEO** — Template-based pages with data injection (NOT auto-generated thin content)
4. **Internal linking graph** — Database-backed link graph, pre-computed
5. **Sitemap optimization** — Split by country, priority-based refresh
6. **Crawl budget** — Monitor Google Search Console; disallow low-value paths if needed
7. **Duplicate detection** — Canonical rules strict; no duplicate content across geo variants

### 11.4 Anti-Pattern: Thin-Page Factory

**Never do this:**

- ❌ Create `/casinos/paypal- casinos` by listing all PayPal casinos with no unique content
- ❌ Auto-generate `/de/casino-reviews/{slug}` pages that are 100% translated copies
- ❌ Create comparison pages with no editorial verdict
- ❌ Create payment pages with just a list of casinos and no guide content
- ❌ Create country pages with just a filtered casino listing

**Instead, do this:**

- ✅ Each casino profile has 500+ words of unique editorial review
- ✅ Each payment page has 1,000+ words of guide content
- ✅ Each country page has 1,500+ words of regulatory + practical content
- ✅ Each comparison has a unique verdict and score breakdown
- ✅ Each guide has 1,500+ words of original advice

### 11.5 Content Quality Gates

Before any new page type is added to the sitemap, verify:

| Gate | Requirement |
|------|-------------|
| **Unique content** | Page has 500+ words of editorial content not found elsewhere |
| **Data richness** | Page references 3+ data fields from casino records |
| **Internal links** | Page links to 3+ other entity pages |
| **Schema markup** | Page includes appropriate structured data |
| **Affiliate disclosure** | Page includes disclosure if affiliate links present |
| **Mobile UX** | Page renders correctly on 375px viewport |
| **Page speed** | Page loads in <3s on 3G |

---

## Appendix A: Entity Relationship Diagram

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐
│   CASINO    │────▶│   LICENSE    │◀────│   COUNTRY    │
│  (138)      │     │  (168)       │     │  (8 current) │
└──────┬──────┘     └──────────────┘     └──────┬───────┘
       │                                         │
       │  ┌──────────────┐     ┌──────────────┐  │
       ├──│ PAYMENT METHOD│◀───▶│   GUIDE      │◀─┘
       │  │  (766)        │     │  (3 current) │
       │  └──────────────┘     └──────────────┘
       │
       │  ┌──────────────┐     ┌──────────────┐
       ├──│    BONUS     │     │  COMPARISON  │
       │  └──────────────┘     │  (ad-hoc +   │
       │                       │   curated)   │
       │  ┌──────────────┐     └──────────────┘
       ├──│  AFFILIATE   │
       │  │   OFFER      │     ┌──────────────┐
       │  └──────────────┘     │  B2B         │
       │                       │  OPERATOR    │
       │  ┌──────────────┐     └──────────────┘
       └──│   PROVENANCE │
          │   RECORD     │
          │   (456)      │
          └──────────────┘
```

## Appendix B: URL Inventory (Current)

### Static Pages (17)
```
/
/about
/affiliate-disclosure
/ai-casino-match
/casinos
/compare
/contact
/guides
/methodology
/privacy-policy
/responsible-gambling
/terms
/for-casinos
/for-casinos/pricing
/for-casinos/list-your-casino
/for-casinos/contact
```

### Casino Pages (138)
```
/casino-reviews/{slug}  × 138
```

### Guide Pages (3)
```
/guides/{slug}  × 3
```

### GEO Pages (Current: ~20)
```
/de                          (hub)
/de/casinos                  (listing)
/de/best-casinos             (curated)
/de/guides                   (listing)
/de/guides/{slug}            × 3
/de/compare                  (builder)
/de/casino-reviews/{slug}    × ~30 (DE casinos)
/nl                          (hub)
/be                          (hub)
/fr                          (hub)
/ie                          (hub)
/at                          (hub)
/it                          (hub)
/ch                          (hub)
```

### Total Indexable URLs (Current): ~210

---

## Appendix C: Implementation Priority

| Phase | Action | URLs Added | Timeline |
|-------|--------|------------|----------|
| **Phase 1** | Geo hubs for NL, BE, FR, IE, AT, IT, CH | +7 | Week 1-2 |
| **Phase 2** | Payment method pages (Tier 1) | +15 | Week 3-4 |
| **Phase 3** | Curated comparison pages | +10 | Week 5-6 |
| **Phase 4** | Guide expansion (regulation, payment) | +12 | Week 7-10 |
| **Phase 5** | Geo sub-pages (/{geo}/best-casinos, licenses, payments) | +40 | Week 11-14 |
| **Phase 6** | Payment Tier 2 pages | +35 | Week 15-18 |
| **Phase 7** | Additional country pages (ES, SE, PT) | +3 hubs | Week 19-22 |

**Projected total at Phase 7:** ~330 indexable URLs
