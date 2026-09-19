# Phase 30C-G — Payment Enrichment Dry-Run Report

**Status:** DRY-RUN
**Date:** 2026-09-19
**Batch ID:** `30C-G-DE-PAYMENTS-01`
**Mode:** dry-run (no production data modified)

---

## 1. Target Casinos

| # | Casino | ID | Slug | GEO | License | Owner | Current PM Count |
|---|--------|----|------|-----|---------|-------|------------------|
| 1 | bet365 | germany-bet365 | bet365 | DE | GGL | Hillside (Europe) ENC | 0 |
| 2 | LeoVegas | germany-leovegas | leovegas | DE | GGL | LVSports Limited | 0 |
| 3 | PokerStars | germany-pokerstars | pokerstars | DE | GGL | Reel Germany Limited (Flutter) | 0 |
| 4 | Ladbrokes | germany-ladbrokes | ladbrokes | DE | GGL | Ladbrokes (Deutschland) Limited (Entain) | 0 |
| 5 | Interwetten | germany-interwetten | interwetten | DE | GGL | Interwetten Gaming Limited | 0 |

---

## 2. Source Policy

Payment methods must be verified from **official sources only**:

1. Official casino website payment/cashier page
2. Official terms and conditions
3. Official help/FAQ sections
4. Existing trusted first-party data in the project

**NOT acceptable**: competitor review sites, affiliate sites, blogs, forums, Reddit, screenshots, model knowledge.

---

## 3. Verification Requirements

For each casino, a human verifier must:

1. Visit the official website (e.g., `https://www.bet365.de`)
2. Navigate to the payment/cashier/deposit section
3. Record all payment methods listed
4. Note the source URL
5. Note the date of verification
6. Confirm each method maps to a canonical entity

### Canonical Payment Entities (23 total)

The following canonical entities exist in the database and can be matched:

| Entity | Type | Casinos | Notes |
|--------|------|---------|-------|
| Visa | card | 110 | Major card |
| Mastercard | card | 109 | Major card |
| PayPal | e-wallet | 108 | Major e-wallet |
| Skrill | e-wallet | 87 | Major e-wallet |
| Paysafecard | prepaid | 82 | Prepaid card |
| Neteller | e-wallet | 51 | Major e-wallet |
| Trustly | bank-transfer | 40 | Bank transfer |
| Apple Pay | mobile | 37 | Mobile payment |
| iDEAL | bank-transfer | 36 | NL-specific |
| Klarna | bank-transfer | 31 | Buy now pay later |
| Bancontact | bank-transfer | 27 | BE-specific |
| Bank Transfer | bank-transfer | 14 | Generic bank transfer |
| Sofort | bank-transfer | 8 | DE-specific |
| Google Pay | mobile | 3 | Mobile payment |
| Creditcard | card | 2 | Generic card |
| Wero | e-wallet | 2 | New e-wallet |
| AirCash | e-wallet | 1 | Regional |
| Tink | bank-transfer | 1 | Nordic |
| Brite | bank-transfer | 1 | Nordic |
| MuchBetter | e-wallet | 1 | E-wallet |
| Giropay | bank-transfer | 1 | DE-specific |
| Maestro | card | 1 | Debit card |
| Neosurf | prepaid | 1 | Prepaid |

### Likely DE-Relevant Entities

For Germany (GGL-licensed casinos), the following are most likely to be relevant:
- Visa, Mastercard (card)
- PayPal, Skrill, Neteller (e-wallet)
- Paysafecard (prepaid)
- Sofort, Giropay, Klarna (bank-transfer)
- Apple Pay, Google Pay (mobile)
- Bank Transfer (generic)

---

## 4. Dry-Run Results

### Status: AWAITING HUMAN VERIFICATION

This dry-run report identifies the structural state but **cannot verify payment methods from external sources**. The following actions are required:

### For Each Casino

| Casino | Required Action | Source URL to Visit |
|--------|-----------------|---------------------|
| bet365 | Visit payment page, list all methods | `https://www.bet365.de` |
| LeoVegas | Visit payment page, list all methods | `https://www.leovegas.de` |
| PokerStars | Visit payment page, list all methods | `https://www.pokerstars.de` |
| Ladbrokes | Visit payment page, list all methods | `https://www.bpremium.de` |
| Interwetten | Visit payment page, list all methods | `https://www.interwetten.de` |

### Expected Enrichment Volume

Based on other DE casinos in the database (which average 6.3 payment methods each):
- Estimated 30-50 new payment relationships across 5 casinos
- Estimated 5-10 new provenance records per casino

---

## 5. Enrichment Template

Once verified, each entry should follow this format:

```typescript
{
  casinoId: "germany-bet365",
  casinoSlug: "bet365",
  paymentMethodName: "Visa",           // Must match canonical entity
  sourceUrl: "https://www.bet365.de/deposit",  // Official source
  sourceType: "official_payment_page",
  sourceName: "bet365.de Official Payment Page",
  verificationDate: "2026-09-19",       // Date of human verification
  notes: "Listed on official deposit page"
}
```

---

## 6. Quality Gate Checklist

Before any relationship enters production:

- [ ] Casino identity verified (ID exists in database)
- [ ] Payment entity is canonical (exists in payment_methods table)
- [ ] Source is official (official website, terms, or payment page)
- [ ] Source supports the claim (payment method listed on source)
- [ ] Provenance recorded (fact_provenance entry created)
- [ ] No unresolved conflict
- [ ] Relationship does not already exist (idempotency check)

---

## 7. Next Steps

1. **Human verifier** visits each casino's official website
2. **Records** all payment methods found on the payment/cashier page
3. **Maps** each method to a canonical entity
4. **Fills in** the enrichment template entries below
5. **Reviews** the dry-run output
6. **Approves** for live execution

### Enrichment Entries (To Be Filled)

```typescript
// After human verification, fill in these entries:
const enrichmentEntries: PaymentEnrichmentEntry[] = [
  // bet365
  // { casinoId: "germany-bet365", casinoSlug: "bet365", paymentMethodName: "...", sourceUrl: "...", ... },
  // LeoVegas
  // { casinoId: "germany-leovegas", casinoSlug: "leovegas", paymentMethodName: "...", sourceUrl: "...", ... },
  // PokerStars
  // { casinoId: "germany-pokerstars", casinoSlug: "pokerstars", paymentMethodName: "...", sourceUrl: "...", ... },
  // Ladbrokes
  // { casinoId: "germany-ladbrokes", casinoSlug: "ladbrokes", paymentMethodName: "...", sourceUrl: "...", ... },
  // Interwetten
  // { casinoId: "germany-interwetten", casinoSlug: "interwetten", paymentMethodName: "...", sourceUrl: "...", ... },
];
```

---

## 8. Database Safety

Before and after enrichment, verify:

- 138 casinos remain intact
- 766+ payment records (only approved additions)
- 456+ provenance records
- 0 unresolved conflicts
- No casino deletion
- No payment entity deletion
- No license deletion
- No GEO deletion
- No review/complaint changes
