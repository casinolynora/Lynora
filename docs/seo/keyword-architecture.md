# Keyword Architecture — BeInCasinos

> Document scope: Maps keyword clusters to page types, indexation strategy, and unique value propositions.
> Data discipline: All volume/KD/CPC values marked `Volume: NOT VERIFIED` unless sourced from a verified tool export.

---

## 1. Overview

BeInCasinos operates as an international casino review and comparison platform with 138 verified casinos, 168 licenses, and 766 payment methods across 8 European markets. This document defines how every search intent maps to an existing or planned route, ensuring no cannibalization and maximum topical authority.

**Platform facts that anchor the architecture:**

- 138 casino profiles with structured, verified data (not user-generated reviews)
- 168 license records across multiple jurisdictions
- 766 payment method associations
- Deterministic scoring engine with configurable weights (not LLM-dependent)
- 8 country pages (DE, FR, NL, BE, AT, IT, CH, IE)
- 3 editorial guides
- B2B operator section (`/for-casinos/*`)
- AI matchmaker tool (`/ai-casino-match`)

**Core principle:** Every page must answer a specific search intent with data competitors cannot fabricate. We do not publish fake testimonials, inflated ratings, or unverifiable claims.

---

## 2. Keyword Universe by Cluster

### A. Core Commercial

| Cluster | Intent | Example Query | Page Type | Existing Route | Future Route | Index? | Priority | Unique Value |
|---------|--------|---------------|-----------|----------------|--------------|--------|----------|--------------|
| online casino reviews | Commercial investigation | "online casino reviews" | Listing + aggregation | `/casinos` | — | Yes | High | 138 verified profiles with structured scoring, not affiliate-driven rankings |
| best online casinos | Transactional / commercial | "best online casinos" | Curated listing | `/casinos` | — | Yes | High | Deterministic ranking based on verified license, payment, and bonus data |
| casino reviews | Commercial investigation | "casino reviews" | Listing + hub | `/casinos` | — | Yes | High | Every review backed by structured data; no fabricated testimonials |
| online casino comparison | Commercial / comparison | "online casino comparison" | Comparison tool | `/compare` | — | Yes (curated pages only) | High | Side-by-side data comparison across 138 casinos; ad-hoc comparisons noindex |
| best casino sites | Transactional | "best casino sites" | Curated listing | `/casinos` | — | Yes | High | Market-specific rankings per geo; transparent scoring methodology |
| best online casino | Transactional | "best online casino" | Curated listing | `/casinos` | — | Yes | High | Geo-aware results; disclaimer that "best" depends on player preferences |

### B. Casino Brand Intent (Profile V2)

| Cluster | Intent | Example Query | Page Type | Existing Route | Future Route | Index? | Priority | Unique Value |
|---------|--------|---------------|-----------|----------------|--------------|--------|----------|--------------|
| [casino] review | Commercial investigation | "casumo review" | Casino profile | `/casino-reviews/[slug]` | — | Yes | High | Structured review with score breakdown, license verification, payment data — no fake reviews |
| [casino] bonus | Transactional | "casumo bonus" | Casino profile | `/casino-reviews/[slug]` | — | Yes | High | Verified bonus data with T&Cs extracted; not outdated affiliate offers |
| [casino] withdrawal | Informational / investigative | "casumo withdrawal" | Casino profile | `/casino-reviews/[slug]` | — | Yes | High | Actual withdrawal methods, timeframes, and limits from verified data |
| [casino] payments | Informational | "casumo payments" | Casino profile | `/casino-reviews/[slug]` | — | Yes | High | Full payment method breakdown: deposits, withdrawals, limits, processing times |
| [casino] complaints | Investigative | "casumo complaints" | Casino profile | `/casino-reviews/[slug]` | — | Yes | Medium | Trust signals, license status, known issues — transparent, not suppressed |
| [casino] safe / legit | Trust investigation | "is casumo safe" | Casino profile | `/casino-reviews/[slug]` | — | Yes | High | License verification, regulatory status, security features — factual, not opinion |
| [casino] KYC | Informational | "casumo KYC" | Casino profile | `/casino-reviews/[slug]` | — | Yes | Medium | KYC requirements, document types, processing times from verified data |
| [casino] withdrawal time | Informational | "casumo withdrawal time" | Casino profile | `/casino-reviews/[slug]` | — | Yes | High | Actual processing times by payment method — not marketing estimates |

### C. Comparison Intent

| Cluster | Intent | Example Query | Page Type | Existing Route | Future Route | Index? | Priority | Unique Value |
|---------|--------|---------------|-----------|----------------|--------------|--------|----------|--------------|
| casino vs casino | Comparison | "casumo vs betway" | Comparison page | `/compare` | `/compare/[a]-vs-[b]` | Yes (planned) | High | Structured head-to-head: licenses, bonuses, payments, ratings — data not opinion |
| best casinos comparison | Comparison | "best casinos comparison" | Comparison hub | `/compare` | — | Yes | Medium | Tool-based comparison; curated comparisons indexable, ad-hoc noindex |
| payment comparison | Informational / comparison | "visa vs skrill casino" | Future: comparison page | — | `/compare/payments/[method]` | Yes (planned) | Medium | Cross-casino payment method comparison with real limits and times |
| bonus comparison | Commercial | "casino bonus comparison" | Future: comparison page | — | `/compare/bonuses` | Yes (planned) | Medium | Side-by-side bonus terms, wagering requirements, expiry — verified data |
| feature comparison | Comparison | "casino features compared" | Future: comparison page | — | `/compare/features` | Yes (planned) | Low | Game selection, UX, mobile support — structured feature matrix |

### D. Country / International

| Cluster | Intent | Example Query | Page Type | Existing Route | Future Route | Index? | Priority | Unique Value |
|---------|--------|---------------|-----------|----------------|--------------|--------|----------|--------------|
| best online casinos [country] | Transactional | "best online casinos Germany" | Country page | `/[geo]` | — | Yes | High | Geo-filtered casino list with local license awareness, local payment methods |
| online casino [country] | Transactional | "online casino Netherlands" | Country page | `/[geo]` | — | Yes | High | Regulatory context per country; not just a generic list with a flag |
| casino [country] legal | Informational | "online casino Germany legal" | Country page | `/[geo]` | `/[geo]/legality` | Yes | High | Legal status summary per jurisdiction with source citations |
| casinos accepting players from [country] | Transactional | "casinos accepting players from Austria" | Country page | `/[geo]` | — | Yes | High | Actual availability data per casino per market |

### E. Payment Method Intent

| Cluster | Intent | Example Query | Page Type | Existing Route | Future Route | Index? | Priority | Unique Value |
|---------|--------|---------------|-----------|----------------|--------------|--------|----------|--------------|
| casinos accepting [payment] | Transactional | "casinos accepting Skrill" | Future: payment hub | — | `/payments/[method]` | Yes (planned) | High | Filtered casino list with actual deposit/withdrawal support per method |
| [payment] casino | Transactional | "Skrill casino" | Future: payment hub | — | `/payments/[method]` | Yes (planned) | High | Dedicated page per method: casinos, limits, fees, processing times |
| casino withdrawal with [payment] | Informational | "casino withdrawal with PayPal" | Future: payment hub | — | `/payments/[method]` | Yes (planned) | Medium | Withdrawal-specific data: timeframes, limits, success rates |
| fastest casino withdrawals | Informational / transactional | "fastest casino withdrawals" | Future: listing | — | `/guides/fastest-withdrawals` | Yes (planned) | High | Data-driven ranking by actual withdrawal processing times |
| casino deposits with [payment] | Informational | "casino deposits with Neteller" | Future: payment hub | — | `/payments/[method]` | Yes (planned) | Medium | Deposit limits, fees, processing times per method per casino |

### F. Trust / Safety

| Cluster | Intent | Example Query | Page Type | Existing Route | Future Route | Index? | Priority | Unique Value |
|---------|--------|---------------|-----------|----------------|--------------|--------|----------|--------------|
| casino safety | Informational | "are online casinos safe" | Future: guide | — | `/guides/casino-safety` | Yes (planned) | High | Safety checklist based on license verification, data encryption, responsible gambling tools |
| casino licensing | Informational | "online casino licensing" | Future: guide | — | `/guides/casino-licensing` | Yes (planned) | High | License database (168 licenses) with issuer details, jurisdiction scope, enforcement history |
| casino verification | Informational | "online casino verification" | Future: guide | — | `/guides/casino-verification` | Yes (planned) | Medium | How BeInCasinos verifies data; transparency about methodology |
| casino legitimacy | Informational | "how to tell if casino is legit" | Future: guide | — | `/guides/casino-legitimacy` | Yes (planned) | High | Practical checklist: license check, payout history, regulatory complaints |
| casino complaints | Informational | "online casino complaints" | Future: guide | — | `/guides/casino-complaints` | Yes (planned) | Medium | How to file complaints, regulatory bodies, resolution processes |
| KYC casino | Informational | "KYC casino verification" | Future: guide | — | `/guides/kyc-explained` | Yes (planned) | Medium | KYC process explained, document requirements, common delays |
| responsible gambling | Informational | "responsible gambling tools" | Existing page | `/responsible-gambling` | — | Yes | Medium | Self-exclusion links, deposit limits, reality checks — practical tools |

### G. Informational

| Cluster | Intent | Example Query | Page Type | Existing Route | Future Route | Index? | Priority | Unique Value |
|---------|--------|---------------|-----------|----------------|--------------|--------|----------|--------------|
| how online casinos work | Informational | "how do online casinos work" | Future: guide | — | `/guides/how-casinos-work` | Yes (planned) | Medium | Plain-language explanation with data examples from BeInCasinos dataset |
| casino licensing explained | Informational | "casino licensing explained" | Future: guide | — | `/guides/casino-licensing` | Yes (planned) | High | Jurisdiction-by-jurisdiction breakdown with 168 real license records |
| KYC verification | Informational | "what is KYC in casino" | Future: guide | — | `/guides/kyc-explained` | Yes (planned) | Medium | Step-by-step KYC process, required documents, timeline expectations |
| withdrawal times explained | Informational | "casino withdrawal times" | Future: guide | — | `/guides/withdrawal-times` | Yes (planned) | High | Actual withdrawal times by method and casino — data, not promises |
| wagering requirements | Informational | "wagering requirements explained" | Future: guide | — | `/guides/wagering-requirements` | Yes (planned) | Medium | Calculation examples, typical ranges, how to evaluate bonus value |
| deposit limits | Informational | "casino deposit limits" | Future: guide | — | `/guides/deposit-limits` | Yes (planned) | Low | Deposit limits by method and casino; responsible gambling context |
| self-exclusion | Informational | "online casino self-exclusion" | Future: guide | — | `/guides/self-exclusion` | Yes (planned) | High | Self-exclusion tools, regulatory schemes (GamStop, OASIS, etc.) |

### H. B2B / Operator

| Cluster | Intent | Example Query | Page Type | Existing Route | Future Route | Index? | Priority | Unique Value |
|---------|--------|---------------|-----------|----------------|--------------|--------|----------|--------------|
| list casino site | Commercial (B2B) | "list my casino site" | B2B page | `/for-casinos/list-your-casino` | — | Yes | Medium | Listing process, data requirements, verification standards |
| casino affiliate program | Commercial (B2B) | "casino affiliate program" | B2B page | `/for-casinos` | — | Yes | Low | Not an affiliate program — a listing service with transparent methodology |
| casino listing service | Commercial (B2B) | "casino listing service" | B2B page | `/for-casinos/pricing` | — | Yes | Low | Pricing tiers, what's included, editorial independence guarantee |

---

## 3. Cannibalization Rules

### 3.1 Primary Rule: One Intent, One Page

Each keyword cluster maps to exactly one primary page. If two pages could compete for the same query, consolidate or differentiate.

### 3.2 Specific Rules

| Conflict | Resolution |
|----------|------------|
| `/casinos` vs `/[geo]` for "best online casinos [country]" | `/[geo]` is canonical for geo-modified queries. `/casinos` targets non-geo queries. |
| `/casino-reviews/[slug]` vs `/compare/[a]-vs-[b]` | Profile pages own brand queries. Comparison pages own "vs" queries. |
| `/compare` (ad-hoc) vs curated comparison pages | Ad-hoc comparisons are `noindex`. Only curated, data-rich comparison pages are indexed. |
| `/casinos` vs future `/payments/[method]` | `/casinos` is the general listing. `/payments/[method]` is the payment-filtered view. Different intent, different page. |
| `/guides/*` vs `/casino-reviews/[slug]` | Guides are informational (how-to, explainers). Profiles are commercial investigation (specific casino). |
| Future trust guides vs existing `/responsible-gambling` | `/responsible-gambling` stays focused on tools and self-help. Trust guides cover broader safety/licensing topics. |

### 3.3 Internal Linking Strategy

- Every casino profile links to its country page(s) and relevant payment method pages.
- Country pages link to filtered casino profiles available in that market.
- Guides link to relevant profiles and country pages for deeper exploration.
- Comparison pages link back to individual profiles for full details.
- B2B pages never outrank consumer content; they live in a separate section with distinct navigation.

---

## 4. Content Quality Rules

Every page must satisfy these five criteria before publication:

### 4.1 Why This Page Exists

- What specific user question does it answer?
- What action does it enable (compare, choose, verify, understand)?
- What gap in the current search results does it fill?

### 4.2 What Intent Does It Serve

| Intent Type | Page Must Provide |
|-------------|-------------------|
| Informational | Clear explanation, step-by-step guidance, definitions |
| Commercial investigation | Comparison data, pros/cons, structured scoring |
| Transactional | Direct path to action (visit casino, start comparison) |
| Navigational | Clear site structure, breadcrumbs, related content |

### 4.3 What Unique Information It Contains

- **Structured data only:** Ratings, license counts, payment method counts, bonus terms — all from verified sources.
- **No fabricated content:** No fake player reviews, no invented testimonials, no unverifiable claims.
- **Methodology transparency:** Every score is explainable. Every data point has a verification date.
- **Cross-referenced data:** Casino profiles reference real licenses (168 total), real payment methods (766 total), and real bonus terms.

### 4.4 What Evidence Supports It

| Content Type | Required Evidence |
|--------------|-------------------|
| Casino rating | Score breakdown across verified categories |
| License claim | License issuer, number, jurisdiction, verification date |
| Payment method | Deposit/withdrawal support, limits, processing times |
| Bonus offer | Bonus amount, wagering requirement, expiry, T&Cs link |
| Legal status | Regulatory body name, relevant legislation, official sources |

### 4.5 What Entities Are Referenced

- Casino names (138 verified)
- License issuers (e.g., MGA, UKGC, Curaçao, Gibraltar)
- Payment providers (e.g., Visa, Skrill, PayPal, bank transfer)
- Regulatory bodies per jurisdiction
- Responsible gambling organizations (GamStop, GamCare, OASIS, etc.)

### 4.6 How It Helps the User

Every page must answer: **"After reading this, can the user make a better-informed decision than before?"**

If the answer is no, the page should not exist.

---

## 5. Mapping Principles

### 5.1 Page Type Hierarchy

```
Homepage (/)
  ├── Casino Listing (/casinos)
  │     └── Casino Profile (/casino-reviews/[slug])  × 138
  ├── Comparison Hub (/compare)
  │     └── Curated Comparisons (/compare/[a]-vs-[b])  (future, indexed)
  │     └── Ad-hoc Comparisons (/compare?casinos=...)  (noindex)
  ├── Country Pages (/[geo])  × 8
  │     └── (future: /[geo]/legality, /[geo]/payments)
  ├── Guides (/guides/[slug])  × 3 (future: +12 planned)
  ├── Payment Pages (/payments/[method])  (future)
  ├── Trust & Safety (/guides/casino-safety, etc.)  (future)
  ├── B2B Section (/for-casinos/*)
  ├── AI Matchmaker (/ai-casino-match)
  └── Policy Pages (/privacy-policy, /terms, /responsible-gambling, etc.)
```

### 5.2 Indexation Decision Matrix

| Factor | Index | Noindex |
|--------|-------|---------|
| Unique, valuable content | Yes | — |
| Duplicate or thin content | — | Yes |
| Ad-hoc / parameterized pages | — | Yes |
| Stale or outdated data | — | Yes (until updated) |
| Curated editorial content | Yes | — |
| B2B / commercial pages | Yes (if distinct from consumer) | — |

### 5.3 Geo Routing Rules

- English content is the default (`/`, `/casinos`, `/casino-reviews/[slug]`).
- German mirror exists at `/de/*` — uses `hreflang` to signal language variant.
- Country pages (`/[geo]`) target "best casinos in [country]" — geo-specific, not language-specific.
- Future: Each geo page may expand into sub-routes (`/[geo]/legality`, `//[geo]/payments`).

### 5.4 Scalability Notes

| Current State | Future State | Trigger |
|---------------|--------------|---------|
| 138 casino profiles | 200+ profiles | New verified casino data added |
| 3 guides | 15+ guides | Trust, safety, payment guides published |
| 8 country pages | 15+ country pages | New market data verified |
| No payment pages | 20+ payment pages | Payment method data structured and verified |
| No curated comparisons | 50+ comparison pages | Head-to-head data generated from profiles |
| Ad-hoc comparisons (noindex) | Same | Keep noindex — thin, parameterized content |

### 5.5 Data Freshness Requirements

| Data Type | Max Age Before Warning | Action |
|-----------|----------------------|--------|
| Casino rating | 90 days | Re-verify or flag as "data may be outdated" |
| License status | 180 days | Re-check with regulatory source |
| Bonus offers | 30 days | Mark as "check current offer on casino site" |
| Payment methods | 180 days | Re-verify with casino or provider |
| Withdrawal times | 90 days | Re-verify or use community-reported range |

---

*Document version: 1.0 — Created 2026-09-18*
