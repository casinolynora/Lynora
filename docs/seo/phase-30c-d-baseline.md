# Phase 30C-D — Payment Entity SEO Foundation — Pre-Implementation Baseline

## Date
2026-09-19

## Commit
`7874288`

## Current Payment Dataset

| Metric | Count |
|--------|-------|
| Verified casinos (production-visible) | 49 |
| Total payment method records | 166 |
| Unique payment method names | 24 |
| Canonical entities (after AirCash/Aircash merge) | 23 |
| GEOs represented in payment data | 3 (DE, NL, BE) |
| Payment types | bank-transfer: 57, card: 44, e-wallet: 39, mobile: 10, prepaid: 16 |

## Unique Payment Method Names
AirCash, Aircash, Apple Pay, Bancontact, Bank Transfer, Brite, Creditcard, Giropay, Google Pay, Klarna, Maestro, Mastercard, MuchBetter, Neosurf, Neteller, PayPal, Paysafecard, Skrill, Sofort, Tink, Trustly, Visa, Wero, iDEAL

## Case Inconsistency
- "AirCash" (stargames) vs "Aircash" (betano) — same entity, different casing

## Payment Method Coverage (Casinos → GEOs)
| Method | Casinos | GEOs | Type |
|--------|---------|------|------|
| Visa | 21 | 3 | card |
| Mastercard | 20 | 3 | card |
| PayPal | 19 | 3 | e-wallet |
| Paysafecard | 15 | 2 | prepaid |
| iDEAL | 14 | 1 | bank-transfer |
| Trustly | 9 | 2 | bank-transfer |
| Skrill | 8 | 2 | e-wallet |
| Apple Pay | 8 | 1 | mobile |
| Bancontact | 8 | 1 | card |
| Klarna | 7 | 1 | bank-transfer |
| Neteller | 7 | 2 | e-wallet |
| Sofort | 8 | 1 | bank-transfer |
| Bank Transfer | 8 | 2 | bank-transfer |
| Google Pay | 2 | 1 | mobile |
| Creditcard | 2 | 1 | card |
| Wero | 2 | 1 | bank-transfer |
| AirCash | 1 | 1 | e-wallet |
| Aircash | 1 | 1 | e-wallet |
| Brite | 1 | 1 | bank-transfer |
| Giropay | 1 | 1 | bank-transfer |
| Maestro | 1 | 1 | card |
| MuchBetter | 1 | 1 | e-wallet |
| Neosurf | 1 | 1 | prepaid |
| Tink | 1 | 1 | bank-transfer |

## Existing Payment Schema
```typescript
PaymentMethodSchema = {
  name: string,
  type: "e-wallet" | "card" | "bank-transfer" | "crypto" | "prepaid" | "mobile",
  minDeposit?: number,
  maxDeposit?: number,
  minWithdrawal?: number,
  maxWithdrawal?: number,
  withdrawalTime?: string,
  fees?: string,
}
```

## Database Schema
- `payment_methods` table: id, name (UNIQUE), slug (UNIQUE), type, createdAt
- `casino_payment_methods` junction: casinoId, paymentMethodId, per-casino details
- No aliases table, no normalization rules, no categories table

## Current Cross-Links
- Casino → Payment: via `casino.paymentMethods` array (displayed as badges)
- Payment → Casino: ❌ not implemented
- GEO → Payment: ❌ not implemented
- Guide → Payment: ❌ not implemented (guide mentions payment methods in text only)
- Payment → Guide: ❌ not implemented

## Current Sitemap
- 0 payment-related URLs
- Total routes: ~50 pages

## Tests
- 606/606 passing (27 files)

## TypeScript
- Clean

## Build
- 50 pages

## Lint
- 20 problems (13 errors, 7 warnings — all pre-existing)
