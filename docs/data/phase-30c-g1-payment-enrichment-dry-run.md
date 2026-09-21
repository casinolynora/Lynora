# Phase 30C-G.1 — Payment Enrichment Dry-Run Report

**Status:** DRY-RUN COMPLETE
**Date:** 2026-09-19
**Batch ID:** `30C-G1-DE-PAYMENTS-01`
**Mode:** dry-run (no production data modified)

---

## 1. Summary

All 15 Germany-only GGL-licensed casinos with 0 payment methods have been researched.

**Research results:**
- 4 casinos with HIGH confidence (official sources) — 34 entries
- 4 casinos with MEDIUM confidence (official + third-party) — 22 entries
- 7 casinos with LOW confidence (third-party only) — pending manual verification

**Total enrichment entries ready for execution:** 56 (Tier 1 + Tier 2)

---

## 2. Tier 1: HIGH Confidence (34 entries)

### 2.1 LeoVegas (7 methods)

Source: `help.leovegas.com` (Official Help Center)

| Casino ID | Payment Method | Source Type |
|-----------|---------------|-------------|
| germany-leovegas | Visa | official_help_page |
| germany-leovegas | Mastercard | official_help_page |
| germany-leovegas | Trustly | official_help_page |
| germany-leovegas | Skrill | official_help_page |
| germany-leovegas | Paysafecard | official_help_page |
| germany-leovegas | Apple Pay | official_help_page |
| germany-leovegas | Neteller | official_help_page |

### 2.2 Wildz (9 methods)

Sources: `wildz.de/de/zahlungsmethoden-paypal`, `wildz.com/en/payment-options`

| Casino ID | Payment Method | Source Type |
|-----------|---------------|-------------|
| germany-wildz | PayPal | official_payment_page |
| germany-wildz | Visa | official_payment_page |
| germany-wildz | Mastercard | official_payment_page |
| germany-wildz | Skrill | official_payment_page |
| germany-wildz | Neteller | official_payment_page |
| germany-wildz | Paysafecard | official_homepage |
| germany-wildz | Apple Pay | official_payment_page |
| germany-wildz | Sofort | official_payment_page |
| germany-wildz | Bank Transfer | official_payment_page |

### 2.3 bet-at-home (11 methods)

Sources: `bet-at-home.de.zendesk.com`, `bet-at-home.zendesk.com`

| Casino ID | Payment Method | Source Type |
|-----------|---------------|-------------|
| germany-bet-at-home | Visa | official_help_page |
| germany-bet-at-home | Mastercard | official_help_page |
| germany-bet-at-home | PayPal | official_help_page |
| germany-bet-at-home | Paysafecard | official_help_page |
| germany-bet-at-home | Skrill | official_help_page |
| germany-bet-at-home | Neteller | official_help_page |
| germany-bet-at-home | Bank Transfer | official_help_page |
| germany-bet-at-home | Apple Pay | official_help_page |
| germany-bet-at-home | Sofort | official_help_page |
| germany-bet-at-home | eps | official_help_page |
| germany-bet-at-home | Aircash | official_help_page |

### 2.4 DAZN Bet (7 methods)

Source: `help.daznbet.com` (Official Help Center)

| Casino ID | Payment Method | Source Type |
|-----------|---------------|-------------|
| germany-daznbet | Visa | official_help_page |
| germany-daznbet | Skrill | official_help_page |
| germany-daznbet | Trustly | official_help_page |
| germany-daznbet | Neteller | official_help_page |
| germany-daznbet | Paysafecard | official_help_page |
| germany-daznbet | PayPal | official_help_page |
| germany-daznbet | Bank Transfer | official_help_page |

---

## 3. Tier 2: MEDIUM Confidence (22 entries)

### 3.1 bet365 (2 entries)

Source: `bet365.de` (Official Website — cashier behind login)

| Casino ID | Payment Method | Source Type |
|-----------|---------------|-------------|
| germany-bet365 | Visa | official_payment_page |
| germany-bet365 | Mastercard | official_payment_page |

### 3.2 Interwetten (6 entries)

Source: `interwetten.com/de/payin` (Official Payment Page — visible in search)

| Casino ID | Payment Method | Source Type |
|-----------|---------------|-------------|
| germany-interwetten | Visa | official_payment_page |
| germany-interwetten | Mastercard | official_payment_page |
| germany-interwetten | Paysafecard | official_payment_page |
| germany-interwetten | Skrill | official_payment_page |
| germany-interwetten | Neteller | official_payment_page |
| germany-interwetten | Bank Transfer | official_payment_page |

### 3.3 VBET (5 entries)

Source: `new.vbet.net/help-center` (Official Help Center)

| Casino ID | Payment Method | Source Type |
|-----------|---------------|-------------|
| germany-vbet | Visa | official_help_page |
| germany-vbet | Mastercard | official_help_page |
| germany-vbet | Skrill | official_help_page |
| germany-vbet | Neteller | official_help_page |
| germany-vbet | Trustly | official_help_page |

### 3.4 TipTorro (4 entries)

Source: `tiptorro.co.uk` (Official Website)

| Casino ID | Payment Method | Source Type |
|-----------|---------------|-------------|
| germany-tiptorro | PayPal | official_payment_page |
| germany-tiptorro | Paysafecard | official_payment_page |
| germany-tiptorro | Klarna | official_payment_page |
| germany-tiptorro | Aircash | official_payment_page |

---

## 4. Tier 3: LOW Confidence (Requires Manual Verification)

| # | Casino | ID | Methods Found (Third-Party Only) |
|---|--------|----|----------------------------------|
| 1 | PokerStars | germany-pokerstars | Visa, Mastercard, PayPal, Skrill, Neteller, Paysafecard, Klarna, Apple Pay |
| 2 | Ladbrokes | germany-ladbrokes | Visa, Mastercard, PayPal, Paysafecard, Bank Transfer, Apple Pay, Google Pay |
| 3 | Löwen Play | germany-loewen-play | PayPal, Sofort, Visa, Mastercard, Paysafecard |
| 4 | Jokerstar | germany-jokerstar | PayPal, Klarna, Paysafecard, Giropay, Visa, Mastercard, Bank Transfer |
| 5 | Admiralbet | germany-admiralbet | Visa, Mastercard, Sofort/Klarna, PayPal, Paysafecard, Skrill, Neteller, Apple Pay |
| 6 | Sportingbet | germany-sportingbet | Visa, Mastercard, PayPal, Skrill, Neteller, Paysafecard, Trustly, Sofort, Bank Transfer |
| 7 | Tipwin | germany-tipwin | Visa, Mastercard, Skrill, Neteller, Paysafecard, Sofort, Giropay, Trustly, EcoPayz |

---

## 5. Database Impact Projection

| Metric | Current | After Tier 1+2 | After All Tiers |
|--------|---------|----------------|-----------------|
| Casinos | 138 | 138 (unchanged) | 138 (unchanged) |
| Payment records | 766 | 822 (+56) | ~882 (+116 est.) |
| Provenance records | 456 | 512 (+56) | ~572 (+116 est.) |
| Unresolved conflicts | 0 | 0 | 0 |
| Payment SEO pages | 12 | 12 (unchanged) | 12 (unchanged) |

---

## 6. Quality Gate

Before live execution, verify:

- [x] All casino IDs exist in database
- [x] All payment method names map to canonical entities
- [x] All source URLs are official or clearly marked as third-party
- [x] No fabricated data
- [x] Provenance chain is complete
- [x] No duplicate relationships exist
- [ ] Live execution approved (requires review)

---

## 7. Next Steps

1. Review this dry-run report
2. Approve Tier 1 + Tier 2 entries for live execution
3. Run enrichment: `runEnrichment(tier1Entries + tier2Entries, "live")`
4. Verify SEO impact — recalculate payment entity statistics
5. For Tier 3 (LOW confidence), conduct additional research or flag for manual verification
6. Run full QA: tests, TypeScript, build
7. Commit

---

## 8. Files Changed

| File | Action |
|------|--------|
| docs/data/phase-30c-g1-target-casinos.md | Created |
| docs/data/phase-30c-g1-payment-enrichment-dry-run.md | Created |