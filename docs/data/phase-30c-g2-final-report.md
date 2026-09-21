# Phase 30C-G.2 — Verified Live Enrichment & Tier-2/3 Validation Report

**Date:** 2026-09-19
**Status:** COMPLETE

## Summary

Safe insertion of payment relationships discovered in Phase 30C-G.1 into production SQLite database, with strict tier-based confidence gating.

| Tier | Casinos Enriched | Entries Created | Errors | Batch ID |
|------|-----------------|-----------------|--------|----------|
| Tier 1 (HIGH) | 4 | 33 | 1 (eps rejected) | 30C-G2-DE-PAYMENTS-T1 |
| Tier 2 (MEDIUM→HIGH) | 3 | 17 | 0 | 30C-G2-DE-PAYMENTS-T2 |
| Tier 3 (official discovery) | 2 | 13 | 0 | 30C-G2-DE-PAYMENTS-T3 |
| **Total** | **9** | **63** | **1** | |

## Production Data Counts

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Total payment records | 766 | 829 | +63 |
| Enrichment batches | 0 | 3 | +3 |
| Casinos with payment data | 128 | 137 | +9 |

## Tier 1 — HIGH Confidence (4 casinos, 33 entries)

| Casino | Methods | Source |
|--------|---------|--------|
| LeoVegas | Visa, Mastercard, Trustly, Skrill, Paysafecard, Apple Pay, Neteller (7) | help.leovegas.com |
| Wildz | PayPal, Visa, Mastercard, Skrill, Neteller, Paysafecard, Apple Pay, Sofort, Bank Transfer (9) | wildz.de, wildz.com |
| bet-at-home | Visa, Mastercard, PayPal, Paysafecard, Skrill, Neteller, Bank Transfer, Apple Pay, Sofort, Aircash (10) | bet-at-home.de.zendesk.com |
| DAZN Bet | Visa, Skrill, Trustly, Neteller, Paysafecard, PayPal, Bank Transfer (7) | help.daznbet.com |

**1 error:** `eps` correctly rejected — not a canonical payment method.

## Tier 2 — Re-validated & Inserted (3 casinos, 17 entries)

### Re-validation Results

| Casino | Previous | Upgraded To | Rationale |
|--------|----------|-------------|-----------|
| bet365 | MEDIUM | **HIGH** | Official help.bet365.de confirms PayPal, Klarna, Visa, Paysafecard |
| Interwetten | MEDIUM | **HIGH** | Official interwotten.com/de confirms Visa, Mastercard, Paysafecard, Skrill, Neteller, Bank Transfer |
| VBET | MEDIUM | PARTIAL | Only Mastercard, Skrill, Neteller confirmed for DE (3 of 5) |
| TipTorro | MEDIUM | **HIGH** | Official tiptorro.co.uk confirms PayPal, Paysafecard, Klarna, Aircash |

### Inserted Entries

| Casino | Methods | Source |
|--------|---------|--------|
| bet365 | PayPal, Klarna, Visa, Paysafecard (4) | help.bet365.de |
| Interwetten | Visa, Mastercard, Paysafecard, Skrill, Neteller, Bank Transfer (6) | interwetten.com/de |
| VBET | Mastercard, Skrill, Neteller (3) | new.vbet.net |
| TipTorro | PayPal, Paysafecard, Klarna, Aircash (4) | tiptorro.co.uk |

**Skipped (not inserted):** VBET Visa (MEDIUM), VBET Trustly (MEDIUM)

## Tier 3 — Official-Source Discovery Pass (2 inserted, 5 skipped)

### Official Source Discovery Results

| Casino | Status | Action | Source |
|--------|--------|--------|--------|
| **Löwen Play** | **HIGH** | INSERTED | loewen-play.de/zahlungsanbieter |
| **Jokerstar** | **HIGH** | INSERTED | hilfe.jokerstar.de |
| PokerStars | MEDIUM | SKIPPED | Official help exists but no DE-specific payment list |
| Ladbrokes | LOW | SKIPPED | No official DE source found |
| Admiralbet | LOW | SKIPPED | No official source found |
| Sportingbet | MEDIUM | SKIPPED | Official help is Brazil-focused |
| Tipwin | LOW | SKIPPipped | No official source found |

### Inserted Entries

| Casino | Methods | Source |
|--------|---------|--------|
| Löwen Play | Visa, Mastercard, PayPal, Klarna, Paysafecard, Trustly, Sofort (7) | loewen-play.de/zahlungsanbieter |
| Jokerstar | Visa, Mastercard, PayPal, Klarna, Paysafecard, Trustly (6) | hilfe.jokerstar.de |

## Total Enrichment by Casino

| Casino | Tier | Methods Added |
|--------|------|---------------|
| bet-at-home | T1 | 10 |
| Wildz | T1 | 9 |
| LeoVegas | T1 | 7 |
| DAZN Bet | T1 | 7 |
| Löwen Play | T3 | 7 |
| Jokerstar | T3 | 6 |
| Interwetten | T2 | 6 |
| bet365 | T2 | 4 |
| TipTorro | T2 | 4 |
| VBET | T2 | 3 |
| **Total** | | **63** |

## Files Created/Modified

- `src/lib/db/scripts/enrich-tier1.ts` — Tier 1 live insertion script
- `src/lib/db/scripts/enrich-tier2.ts` — Tier 2 live insertion script
- `src/lib/db/scripts/enrich-tier3-officials.ts` — Tier 3 official-source insertion script
- `src/lib/db/payment-enrichment.ts` — Updated `getTargetCasinoState()` to list all 15 targets
- `src/lib/db/__tests__/payment-enrichment.test.ts` — Updated tests to reflect post-enrichment state
- `docs/data/phase-30c-g1-target-casinos.md` — Evidence matrix (created in G.1)
- `docs/data/phase-30c-g1-payment-enrichment-dry-run.md` — Dry-run report (created in G.1)

## Database Verification

- **829 total payment records** (verified via `SELECT COUNT(*) FROM casino_payment_methods`)
- **138 casinos** unchanged
- **0 conflicts** detected
- **3 import batches** created: 30C-G2-DE-PAYMENTS-T1, T2, T3
