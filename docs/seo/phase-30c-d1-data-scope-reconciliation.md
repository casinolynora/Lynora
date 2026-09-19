# Phase 30C-D.1 — Data Scope Reconciliation

## Date
2026-09-19

## Executive Summary

The 49/166 figures in Phase 30C-D are a **scoped analysis subset** from the in-memory composite provider. Production data is intact: **138 verified casinos, 766 payment relationships, 456 provenance records** in `casino.db`. No data was lost. Commit `053d471` added only new files — no data modifications.

**Classification: A — No issue (scoped subset)**

---

## Historical Baseline

| Metric | Baseline | 30C-D Report | Actual (DB) | Explanation |
|--------|----------|-------------|-------------|-------------|
| Verified casinos | 138 | 49 | **138** | 49 = in-memory subset |
| Payment records | 766 | 166 | **766** | 166 = in-memory subset |
| Provenance | 456 | n/r | **456** | Unchanged |
| Conflicts | 0 | n/r | **0** | Unchanged |
| Licenses | 168 | n/r | **168** | Unchanged |
| GEO availability | 212 | n/r | **212** | Unchanged |

---

## Why 49 Casinos

`composite-provider.ts` imports from 3 GEO directories:
- `germany/index.ts` — 27 casinos
- `netherlands/index.ts` — 14 casinos
- `belgium/index.ts` — 8 casinos
- **Total: 49**

The SQLite database (`casino.db`) contains all 138 verified casinos across 17 GEOs. When `DATABASE_PROVIDER=sqlite`, `server-init.ts` swaps to `db-provider.ts` which reads from the database. Tests and Phase 30C-D used the default in-memory provider.

---

## Why 166 Payment Records

`payment-entities.ts` calls `casinoDb.getAllCasinos()` which returns 49 casinos from the composite provider. Those 49 casinos have 166 payment method associations. The database has 766 relationships across 138 casinos.

---

## GEO Scope

Composite provider covers: DE, NL, BE (3 GEOs).
Database covers: AT, BE, BG, CH, DE, DK, ES, FI, FR, GB, GR, IE, MT, NL, NO, RO, SE (17 GEOs).

---

## Git Analysis — `053d471`

5 new files only. No modifications to `src/lib/data/`, `src/lib/db/`, or `casino.db`. **No destructive changes.**

---

## Tier A Recalculation (Database — 138 casinos)

| Entity | Casinos (DB) | GEOs | Type | 30C-D Report |
|--------|-------------|------|------|-------------|
| Visa | 110 | 17 | card | 21 |
| Mastercard | 109 | 17 | card | 20 |
| PayPal | 108 | 17 | e-wallet | 19 |
| Skrill | 87 | 17 | e-wallet | 8 |
| Paysafecard | 82 | 17 | prepaid | 15 |
| Neteller | 51 | 17 | e-wallet | 7 |
| Trustly | 40 | 11 | bank-transfer | 9 |
| Apple Pay | 37 | 10 | mobile | 8 |
| Klarna | 31 | 6 | bank-transfer | 7 |
| Bancontact | 27 | 1 | bank-transfer | 8 |
| Bank Transfer | 14 | 4 | bank-transfer | 8 |
| iDEAL | 36 | 1 | bank-transfer | 14 |
| Sofort | 8 | 1 | bank-transfer | 8 |

### Revised Tier Classification

**Tier A (10+ casinos, 2+ GEOs):** Visa, Mastercard, PayPal, Skrill, Paysafecard, Neteller, Trustly, Apple Pay, Klarna, iDEAL, Bank Transfer — **11 entities**

**Tier B (5-9 casinos):** Bancontact, Sofort, Google Pay — **3 entities**

**Tier C (1-4 casinos):** AirCash, Creditcard, Wero, Brite, Giropay, Maestro, MuchBetter, Neosurf, Tink — **9 entities**

**Tier D:** 0

---

## Data Integrity

138 verified casinos unchanged. 766 payment relationships unchanged. 456 provenance records unchanged. No data loss.

---

## Conclusion

**Category A — No issue.** The 49/166 figures are the in-memory analysis subset. Production data (138/766) is intact in `casino.db`. The payment entity utilities should be updated to use the SQLite provider for full-dataset analysis in future phases.
