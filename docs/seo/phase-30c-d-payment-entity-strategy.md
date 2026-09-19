# Payment Entity SEO Foundation — Strategy Document

## Executive Summary

Phase 30C-D establishes the deterministic data foundation for a future `/payments/[method]` page architecture. The existing 166 payment method records across 49 verified casinos were normalized into 23 canonical payment entities. Four entities qualify as Tier A future page candidates. No mass pages were created.

---

## Current Payment Dataset

| Metric | Value |
|--------|-------|
| Verified casinos (production-visible) | 49 |
| Total payment method records | 166 |
| Unique payment method names (raw) | 24 |
| Canonical entities (after normalization) | 23 |
| Aliases resolved | 1 (Aircash → AirCash) |
| Case inconsistencies detected | 1 (AirCash / Aircash) |
| GEOs represented | 3 (DE, NL, BE) |
| Payment types | bank-transfer: 57, card: 44, e-wallet: 39, mobile: 10, prepaid: 16 |

---

## Entity Normalization

### Normalization Rules

1. **Case normalization**: Input names are compared case-insensitively for alias detection
2. **Alias resolution**: Only aliases with verified identity equivalence are merged (Aircash → AirCash)
3. **Explicitly distinct entities**: Sofort/Klarna, Creditcard/Visa/Mastercard, Giropay/Bank Transfer are kept separate — they represent distinct brands/methods in their respective markets
4. **Slug generation**: `name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")`

### Alias/Duplicate Analysis

| Raw Name | Resolved To | Reason |
|----------|-------------|--------|
| Aircash | AirCash | Case inconsistency (verified in betano vs stargames data) |

### Explicitly Distinct (Not Merged)

| Entity A | Entity B | Reason |
|----------|----------|--------|
| Sofort | Klarna | Sofort is a Klarna subsidiary but used as distinct brand in DE market |
| Creditcard | Visa/Mastercard | Dutch-language generic term; distinct from branded card networks |
| Giropay | Bank Transfer | German-specific bank transfer brand, distinct from general bank transfer |
| Brite | Trustly | Both are open banking but distinct providers (Nordic vs. Baltic) |
| Tink | Trustly | Both are open banking but distinct providers |

---

## Canonical Entity Rules

A payment entity is canonical when:

1. It has a unique, non-aliased identity in the verified dataset
2. Its name is not a case variant of another entity
3. Its type category is确定able from the existing schema

Canonical entities receive:
- A deterministic slug
- A type classification
- Casino/GEO coverage metrics
- Eligibility tier assignment

---

## Payment → Casino Graph

Built from verified `casino.paymentMethods` data. Each canonical payment entity maps to the set of verified casinos that list it.

| Entity | Casinos | GEOs | Type |
|--------|---------|------|------|
| Visa | 21 | 3 | card |
| Mastercard | 20 | 3 | card |
| PayPal | 19 | 3 | e-wallet |
| Paysafecard | 15 | 2 | prepaid |
| iDEAL | 14 | 1 | bank-transfer |
| Trustly | 9 | 2 | bank-transfer |
| Apple Pay | 8 | 1 | mobile |
| Bancontact | 8 | 1 | card |
| Bank Transfer | 8 | 2 | bank-transfer |
| Skrill | 8 | 2 | e-wallet |
| Sofort | 8 | 1 | bank-transfer |
| Klarna | 7 | 1 | bank-transfer |
| Neteller | 7 | 2 | e-wallet |
| AirCash | 2 | 1 | e-wallet |
| Creditcard | 2 | 1 | card |
| Google Pay | 2 | 1 | mobile |
| Wero | 2 | 1 | bank-transfer |
| Brite | 1 | 1 | bank-transfer |
| Giropay | 1 | 1 | bank-transfer |
| Maestro | 1 | 1 | card |
| MuchBetter | 1 | 1 | e-wallet |
| Neosurf | 1 | 1 | prepaid |
| Tink | 1 | 1 | bank-transfer |

---

## Casino → Payment Graph

Each verified casino maps to its deduplicated set of canonical payment methods. The graph is bidirectional with the Payment → Casino graph.

---

## GEO → Payment Graph

Derived from verified Casino → GEO relationships crossed with Casino → Payment relationships.

**Among verified casinos currently listed:**

- **Germany (DE)**: Visa, Mastercard, PayPal, Paysafecard, Trustly, Skrill, Sofort, Klarna, Bank Transfer, Apple Pay, Bancontact, iDEAL, AirCash, Brite, Giropay, MuchBetter, Tink + more
- **Netherlands (NL)**: Visa, Mastercard, PayPal, Paysafecard, iDEAL, Trustly, Neteller, Skrill, Bank Transfer, Maestro, Wero, Creditcard
- **Belgium (BE)**: Visa, Mastercard, PayPal, Paysafecard, Bancontact, Skrill, Neteller, Klarna, Sofort, Neosurf

---

## Guide → Payment Graph

Payment entities are linked to guides based on type-based relevance:

| Payment Type | Relevant Guides |
|-------------|-----------------|
| e-wallet | payment-methods-guide, online-casino-basics |
| card | payment-methods-guide, online-casino-basics |
| bank-transfer | payment-methods-guide, online-casino-basics |
| crypto | payment-methods-guide |
| prepaid | payment-methods-guide, online-casino-basics |
| mobile | payment-methods-guide |

---

## Payment → Guide Graph

Each payment entity type maps to relevant guide content for future cross-linking.

---

## Payment Page Eligibility Rules

A payment entity receives a future `/payments/[method]` page only when it meets ALL criteria:

### Tier A — Future SEO Page Candidate
- **10+** verified casinos supporting the method
- **2+** GEOs with verified casino/payment relationships
- Unique user value beyond "casinos that accept X"
- Canonical, stable identity

### Tier B — Entity Only
- **5-9** verified casinos
- **1+** GEOs
- Useful structured entity, but not enough coverage for independent SEO page yet

### Tier C — Needs Review
- **2-4** verified casinos
- Insufficient data for independent assessment
- May become Tier B with more verified casino data

### Tier D — Duplicate/Alias
- Entity resolves to another canonical entity
- Or has ≤1 casino with alias status

### Signals NOT Used
- No fake search volume
- No invented CPC
- No keyword difficulty
- No traffic estimates
- No affiliate payout influence
- No CPA influence
- No B2B tier influence
- No sponsored placement

---

## Tier Classification Results

### Tier A — 4 Entities (Future SEO Page Candidates)

| Entity | Casinos | GEOs | Type |
|--------|---------|------|------|
| Visa | 21 | 3 | card |
| Mastercard | 20 | 3 | card |
| PayPal | 19 | 3 | e-wallet |
| Paysafecard | 15 | 2 | prepaid |

### Tier B — 9 Entities

| Entity | Casinos | GEOs | Type |
|--------|---------|------|------|
| iDEAL | 14 | 1 | bank-transfer |
| Trustly | 9 | 2 | bank-transfer |
| Apple Pay | 8 | 1 | mobile |
| Bancontact | 8 | 1 | card |
| Bank Transfer | 8 | 2 | bank-transfer |
| Skrill | 8 | 2 | e-wallet |
| Sofort | 8 | 1 | bank-transfer |
| Klarna | 7 | 1 | bank-transfer |
| Neteller | 7 | 2 | e-wallet |

### Tier C — 10 Entities

| Entity | Casinos | GEOs | Type |
|--------|---------|------|------|
| AirCash | 2 | 1 | e-wallet |
| Creditcard | 2 | 1 | card |
| Google Pay | 2 | 1 | mobile |
| Wero | 2 | 1 | bank-transfer |
| Brite | 1 | 1 | bank-transfer |
| Giropay | 1 | 1 | bank-transfer |
| Maestro | 1 | 1 | card |
| MuchBetter | 1 | 1 | e-wallet |
| Neosurf | 1 | 1 | prepaid |
| Tink | 1 | 1 | bank-transfer |

### Tier D — 0 Entities

No entities currently qualify as Tier D (alias with insufficient独立 coverage). The Aircash → AirCash alias was resolved during normalization.

---

## Future `/payments/[method]` Architecture

### URL Patterns (Designed, Not Created)

| Pattern | Purpose | Indexable |
|---------|---------|-----------|
| `/payments` | Payment method index | Yes (future) |
| `/payments/{slug}` | Payment method detail | Yes (Tier A only) |
| `/{geo}/payments/{slug}` | GEO-specific payment | Yes (future) |

### Page Template (Designed, Not Created)

1. Hero: Method name + type badge
2. Overview: What the method is
3. Casinos table: Verified casinos accepting the method
4. GEO availability: Countries where available
5. Fees & Limits: Where verified data exists
6. How to Deposit: Step-by-step
7. How to Withdraw: Step-by-step
8. Security: Method-specific security features
9. FAQ: With FAQPage schema
10. Related Methods: Similar payment types
11. BreadcrumbList schema
12. Responsible Gambling link

### Quality Gate

A payment page is created ONLY when:
1. Entity is Tier A
2. Page contains 1,000+ words of genuine editorial content
3. Content includes verified facts (no fabricated information)
4. FAQ section uses real questions with accurate answers
5. Casino table is sourced from verified data only
6. No thin affiliate page patterns

### Indexability Rules

- Tier A pages: Indexable
- Tier B pages: Not created yet (would be noindex until Tier A)
- `/payments` index: Indexable (future)
- No payment page is created without meeting quality gate

### Sitemap Rules

- Only Tier A payment pages are added to sitemap
- Payment pages use `weekly` change frequency
- Payment pages use `0.8` priority

---

## Provenance/Freshness

Payment entity data inherits provenance from the casino records it's derived from. The `fact_provenance` table tracks verification for `paymentMethods` fields on each casino.

- Payment method names: Verified as part of casino data verification
- Deposit/withdrawal limits: Per-casino, verified when available
- Processing times: Per-casino, verified when available
- Fees: Per-casino, verified when available

No new provenance records were created in this phase. No existing provenance was deleted.

---

## Remaining Gaps

1. **No `/payments` index page** — Designed but not created
2. **No `/payments/[method]` pages** — Foundation only, pages require future phase
3. **No GEO-specific payment pages** — `/{geo}/payments/{slug}` designed but not created
4. **Limited deposit/withdrawal details** — Most verified casinos have minimal payment details
5. **3 GEOs only** — Payment data currently covers DE, NL, BE; FR, AT, IT, CH, IE have no verified payment data
6. **No payment guide content** — Future: "Payment Methods Guide" expansion with payment-specific pages
7. **AirCash/Aircash case inconsistency** — Detected, canonical entity established, raw data not modified
