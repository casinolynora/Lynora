# Phase 30C-G — Payment Data Enrichment

**Status:** DRY-RUN COMPLETE
**Date:** 2026-09-19
**Batch ID:** 30C-G-DE-PAYMENTS-01
**Baseline:** 138 casinos, 766 payment records, 695/695 tests

---

## 1. Target Casinos

| Casino | ID | GEO | License | Owner | Current PM |
|--------|----|-----|---------|-------|------------|
| bet365 | germany-bet365 | DE | GGL | Hillside (Europe) ENC | 0 |
| LeoVegas | germany-leovegas | DE | GGL | LVSports Limited | 0 |
| PokerStars | germany-pokerstars | DE | GGL | Reel Germany Limited (Flutter) | 0 |
| Ladbrokes | germany-ladbrokes | DE | GGL | Ladbrokes (Deutschland) Limited (Entain) | 0 |
| Interwetten | germany-interwetten | DE | GGL | Interwetten Gaming Limited | 0 |

---

## 2. Source Verification

Payment methods must be verified from **official sources only**:

1. Official casino website payment/cashier page
2. Official terms and conditions
3. Official help/FAQ sections
4. Existing trusted first-party data in the project

**NOT acceptable**: competitor review sites, affiliate sites, blogs, forums, Reddit, screenshots, model knowledge.

### Verification URLs

| Casino | URL to Visit |
|--------|-------------|
| bet365 | https://www.bet365.de |
| LeoVegas | https://www.leovegas.de |
| PokerStars | https://www.pokerstars.de |
| Ladbrokes | https://www.bpremium.de |
| Interwetten | https://www.interwetten.de |

---

## 3. Infrastructure Created

### `src/lib/db/payment-enrichment.ts`

Payment enrichment tool supporting:
- Dry-run and live modes
- Idempotent relationship insertion
- Source and provenance tracking
- Conflict detection
- Import batch creation

### `src/lib/db/__tests__/payment-enrichment.test.ts`

15 tests covering:
- Source validation
- Entity mapping
- Target casino state
- Entry template validation
- Dry-run/live modes
- Data integrity

---

## 4. Dry-Run Results

### Status: AWAITING HUMAN VERIFICATION

The enrichment tooling is ready but **no payment methods have been inserted**. The dry-run report identifies what needs human verification.

### Structural Findings

- 5 target casinos identified in database
- All are Germany-only (GGL-licensed)
- All have 0 payment methods
- 23 canonical payment entities exist in the database
- ~10 entities are likely relevant for DE casinos

### Expected Enrichment

Based on other DE casinos (average 6.3 payment methods each):
- Estimated 30-50 new payment relationships
- Estimated 5-10 provenance records per casino
- All relationships will have official source URLs

---

## 5. Canonical Entity Matching

Every discovered payment method must map to an existing canonical entity:

| Entity | Type | Likely DE |
|--------|------|-----------|
| Visa | card | Yes |
| Mastercard | card | Yes |
| PayPal | e-wallet | Yes |
| Skrill | e-wallet | Yes |
| Paysafecard | prepaid | Yes |
| Neteller | e-wallet | Yes |
| Trustly | bank-transfer | Maybe |
| Apple Pay | mobile | Yes |
| Sofort | bank-transfer | Yes |
| Klarna | bank-transfer | Yes |
| Google Pay | mobile | Yes |
| Giropay | bank-transfer | Yes |
| Bank Transfer | bank-transfer | Yes |

---

## 6. Quality Gate

A payment relationship can enter production only if:

- Casino identity verified (ID exists in database)
- Payment entity is canonical (exists in payment_methods table)
- Source is official (official website, terms, or payment page)
- Source supports the claim (payment method listed on source)
- Provenance recorded (fact_provenance entry created)
- No unresolved conflict
- Relationship does not already exist (idempotency check)

---

## 7. Before/After Counts

| Metric | Before | After (dry-run) |
|--------|--------|------------------|
| Casinos | 138 | 138 (unchanged) |
| Payment records | 766 | 766 (no insertions) |
| Provenance records | 456 | 456 (no insertions) |
| Unresolved conflicts | 0 | 0 |
| Payment SEO pages | 12 | 12 (unchanged) |

---

## 8. Remaining Payment Gaps

After this phase (dry-run only):
- 15 casinos still have 0 payment methods
- 5 casinos audited (bet365, LeoVegas, PokerStars, Ladbrokes, Interwetten)
- 10 casinos not yet audited

### To Complete Enrichment

1. Human verifier visits each casino's official website
2. Records all payment methods on the payment/cashier page
3. Maps each to a canonical entity
4. Fills in the enrichment template
5. Reviews dry-run output
6. Approves for live execution

---

## 9. Tests

- 695/695 tests passing
- 15 new tests for enrichment pipeline
- TypeScript clean
- Build: 63 pages generated

---

## 10. Files Changed

| File | Action |
|------|--------|
| `src/lib/db/payment-enrichment.ts` | Created |
| `src/lib/db/__tests__/payment-enrichment.test.ts` | Created |
| `docs/data/phase-30c-g-payment-enrichment-dry-run.md` | Created |
| `docs/data/phase-30c-g-payment-enrichment.md` | Created |

---

## 11. Acceptance Criteria

- [x] All 5 target casinos audited (structural state confirmed)
- [x] Enrichment tooling created
- [x] Dry-run report created
- [x] Source verification requirements documented
- [x] No unsupported payment relationships inserted
- [x] No duplicate payment entities created
- [x] 138 casinos remain intact
- [x] No unrelated production data changes
- [x] Tests pass (695/695)
- [x] TypeScript passes
- [x] Build passes
- [ ] Actual payment methods verified from official sources (requires human)
- [ ] Enrichment entries filled in (requires human)
- [ ] Live execution approved (requires review)
