# Phase 30B.1 — Manual Casino Verification Workflow

## 1. Objective

Build and prove a safe manual verification → publication workflow using the first 20 real casinos. This validates the complete lifecycle:

```
sourced
  ↓
manual verification
  ↓
verified
  ↓
publishable
  ↓
public
  ↓
sitemap / internal links / SEO
```

## 2. Verification Workflow

The workflow uses structured evidence fixtures processed by a deterministic engine:

1. **Prepare** — Create `fixtures/verification-batch-01-data.json` with manually gathered evidence
2. **Validate** — `validateVerificationBatch()` checks schema and source URLs
3. **Dry-run** — `npm run data:verify -- --file <path> --dry-run` shows planned changes
4. **Apply** — `npm run data:verify -- --file <path>` applies verification
5. **Verify** — Confirm DB state, sitemap, profiles, comparisons

## 3. Selection of First 20

**Method:** Every 5th record from `real-casinos-100.json` (indices 0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95)

**Manifest:** `fixtures/verification-manifest-01.json`

**Selected casinos:**

| # | Slug | Primary GEO | Operator |
|---|------|------------|----------|
| 1 | bet365 | GB/IE | Hillside (Media) Limited |
| 2 | betway-casino | GB/IE | Betway Limited |
| 3 | betfair-casino | GB/IE | Flutter Entertainment |
| 4 | rizk | GB/SE | Zecure Gaming Ltd |
| 5 | ladbrokes-casino | GB/IE | Entain plc |
| 6 | vegashero | GB/SE | Genesis Global Ltd |
| 7 | tipico-casino | DE | Tipico Co. Ltd |
| 8 | guts | DE/NO | Zecure Gaming Ltd |
| 9 | drukteglueck | DE | SkillOnNet Ltd |
| 10 | lucky-vegas-de | DE | SkillOnNet Ltd |
| 11 | wildz | DE/FI | Rootz Ltd |
| 12 | jacks-casino-online | NL | JOI Gaming Ltd |
| 13 | pokerstars-nl | NL | Flutter Entertainment |
| 14 | kansino | NL | Casino de Spa N.V. |
| 15 | bob-casino-nl | NL | N1 Interactive Ltd |
| 16 | bingoal-nl | NL/BE | Bingoal N.V. |
| 17 | bet365-be | BE | Hillside (Media) Limited |
| 18 | golden-palace-be | BE | Golden Palace N.V. |
| 19 | fortuneo-be | BE | Mtred Ltd |
| 20 | flash-casino-nl | NL | FPO Netherlands B.V. |

**GEO coverage:** DE(5), NL(6), BE(3), GB/IE(6)

## 4. Evidence Requirements

Every fact must have:
- `value` — the verified value
- `source` — URL where the fact was confirmed
- `status` — `"manually_verified"` for confirmed facts

## 5. Source Hierarchy

1. Government/regulator (UKGC, MGA, GGL, KSA, BGC)
2. Official casino/operator website
3. Official terms
4. Official payment documentation
5. Official responsible gambling information
6. Trusted secondary source

Affiliate network offers are NOT valid evidence for license, legality, GEO, or payments.

## 6. Actor Model

- **Actor:** `editorial-research`
- **Note:** Production authentication/authorization will be handled in the future Admin phase
- The actor is an explicit, documented internal identifier

## 7. Verification States

```
fact_provenance.verificationStatus:
  unverified → sourced → manually_verified → stale / conflicting
```

```
casinos.verificationStatus:
  draft → verified (or needs_review)
```

## 8. Field/Entity Verification

**Approach:** Entity-level (`casinos.verificationStatus = "verified"`) plus detailed field-level provenance in `fact_provenance`.

A casino can have:
- Some manually verified facts
- Some sourced facts
- Some unknown facts

## 9. Conflict Handling

- If verification discovers conflicting evidence: do NOT force verification
- Record the conflict in `conflicts` table
- Preserve both sources
- Keep the affected fact unresolved
- Keep the casino unpublished if the conflict is critical

**Critical fields:** identity, regulator, license status, jurisdiction, GEO legality

## 10. Publication Gate

```typescript
isProductionVisible = (row) =>
  row.status === "active" && row.verificationStatus === "verified";
```

A verified casino is NOT automatically public if critical information is missing.

## 11. SEO Safety

- No fake `Review` or aggregate rating structured data
- No fabricated reviews, ratings, or testimonials
- Sitemap only includes `isProductionVisible` casinos
- Draft casinos have no public profile, no sitemap entry, no canonical URL

## 12. Sitemap Behavior

- **Before verification:** Imported draft casinos absent from sitemap
- **After verification:** Public eligible casinos appear in sitemap
- Uses `casinoDb.getAllCasinos()` which filters by `isProductionVisible`

## 13. Profile V2 Behavior

- Verified casinos render full profile (Hero, Quick Facts, Trust, Payments, etc.)
- Draft casinos return 404 via `notFound()`
- Empty states render honestly for missing data

## 14. Comparison Behavior

- Verified data appears correctly
- Missing data stays missing
- Deterministic sorting unchanged
- No B2B influence on comparison results

## 15. B2B Separation

- Free, Verified, Featured, Premium status do NOT change editorial score
- B2B status does NOT affect verification state, trust evidence, or GEO eligibility
- Commercial placement and editorial verification remain separate

## 16. Freshness

- Manual verification records `lastVerifiedAt` from the verification timestamp
- Uses Phase 30A freshness model (fresh ≤90d, needs_review ≤180d, stale >365d)
- No artificial future dates

## 17. Auditability

Every verification action records:
- Batch ID
- Casino slug/ID
- Field name
- Previous state (implied: draft)
- New state (verified)
- Source URL
- Verification status (manually_verified)
- Verification timestamp
- Actor (editorial-research)

## 18. CLI/Fixture Workflow

```bash
# Dry run
npx tsx src/lib/db/verify-cli.ts --file ./fixtures/verification-batch-01-data.json --dry-run

# Live verification
npx tsx src/lib/db/verify-cli.ts --file ./fixtures/verification-batch-01-data.json
```

## 19. Limitations

- Phase 30B.1 is a verification workflow foundation, not a full production admin system
- No web scraper — all evidence is manually supplied
- No real-time license checking
- Authentication/authorization not yet implemented
- Field-level verification uses entity-level promotion (simpler than per-field promotion)

## 20. Future Admin Integration

- Replace `editorial-research` actor with authenticated user ID
- Add admin dashboard for verification workflow
- Add re-verification scheduling
- Add bulk verification with per-field review
- Add conflict resolution UI
- Add verification history timeline
