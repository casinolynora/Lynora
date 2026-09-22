# Phase 30C-S — Casino Profile Enrichment & Trust Content

**Status:** AUDIT COMPLETE (uncommitted)  
**Parent:** Phase 30C (Post-O Entity Architecture & SEO Consolidation)

---

## Phase 1: Read-Only Audit

### Casino Baseline

| Source | Count | Visibility |
|--------|-------|------------|
| SQLite DB (`casino.db`) | 138 verified | Production-visible (when `DATABASE_PROVIDER=sqlite`) |
| In-memory composite provider | 49 verified | Default (no env var needed) |
| Demo/fixture data | 8 | Never production-visible |
| **Total in DB** | **138** | |

**Note:** The in-memory composite provider (default) serves 49 casinos from hardcoded TypeScript arrays: DE(27) + NL(14) + BE(8). The SQLite DB contains 138 across 17 GEOs. The profile page (`/casino-reviews/[slug]`) works with both providers via `casinoDb.getCasinoBySlug()`.

### Profile Page Architecture

**Route:** `src/app/casino-reviews/[slug]/page.tsx` (257 lines)

**Component tree:**
```
CasinoProfileV2
├── BreadcrumbList JSON-LD
├── Review JSON-LD (conditional)
├── FAQPage JSON-LD (conditional)
├── Breadcrumbs (nav)
├── CasinoHero
│   ├── TrustBadge
│   ├── License badges
│   ├── Quick stats (min deposit, countries, mobile)
│   ├── Editorial Rating (0-100)
│   ├── Player Rating (separate, conditional)
│   └── AffiliateCTA
├── Main Content (2/3 width)
│   ├── EditorialReview (overview, scoreBreakdown, pros/cons, verdict)
│   ├── TrustSection (licenses, operator, verification status)
│   ├── BonusSection
│   ├── PaymentMethods (deposit + withdrawal)
│   ├── GamesSection
│   ├── ResponsibleGambling
│   ├── CasinoFAQ (dynamically generated)
│   ├── CasinoEntityLinks (GEO + payment links)
│   ├── CasinoCompareCTA
│   ├── RelatedGuides
│   └── Methodology section
├── Sidebar (1/3 width)
│   ├── Sticky AffiliateCTA + AffiliateDisclosure
│   └── CasinoQuickFacts
├── AffiliateDisclosure (banner, full width)
└── RelatedCasinos
```

### v2 Components (16 total)

| Component | File | Used in Profile | Purpose |
|-----------|------|-----------------|---------|
| CasinoHero | `CasinoHero.tsx` | ✅ | Name, tagline, trust badges, license badges, rating, CTA |
| CasinoQuickFacts | `CasinoQuickFacts.tsx` | ✅ | Sidebar facts table (17 fields) |
| EditorialReview | `EditorialReview.tsx` | ✅ | Overview, score breakdown, pros/cons, verdict |
| TrustSection | `TrustSection.tsx` | ✅ | Licenses, operator, verification status |
| BonusSection | `BonusSection.tsx` | ✅ | Bonus cards (or "not available" message) |
| PaymentMethods | `PaymentMethods.tsx` | ✅ | Deposit/withdrawal methods |
| GamesSection | `GamesSection.tsx` | ✅ | Available game categories |
| ResponsibleGambling | `ResponsibleGambling.tsx` | ✅ | RG features grid + external links |
| CasinoFAQ | `CasinoFAQ.tsx` | ✅ | Dynamically generated FAQ from real data |
| RelatedCasinos | `RelatedCasinos.tsx` | ✅ | Similar casino cards |
| RelatedGuides | `RelatedGuides.tsx` | ✅ | Relevant guide links |
| CasinoEntityLinks | `CasinoEntityLinks.tsx` | ✅ | GEO + payment entity links |
| CasinoCompareCTA | `CasinoCompareCTA.tsx` | ✅ | Comparison entry point |
| PlayerReviews | `PlayerReviews.tsx` | ❌ NOT used | Player review cards (component exists but not rendered) |
| ComplaintSummary | `ComplaintSummary.tsx` | ❌ NOT used | Complaint summary (component exists but not rendered) |

### Data Field Population (49 in-memory verified casinos)

| Field | Populated | Count | Notes |
|-------|-----------|-------|-------|
| `description` | ✅ | 49/49 | Multi-sentence factual content |
| `review.overview` | ✅ | 49/49 | Factual boilerplate (operator, licence, platform) |
| `review.verdict` | ✅ | 49/49 | Short summary sentence |
| `review.scoreBreakdown` | ❌ | 0/49 | All `null` |
| `review.pros` | ❌ | 0/49 | All empty `[]` |
| `review.cons` | ❌ | 0/49 | All empty `[]` |
| `review.faq` | ❌ | 0/49 | Not defined in any file |
| `rating` | ❌ | 0/49 | All `null` |
| `trustScore` | ❌ | 0/49 | All `null` |
| `bonuses` | ⚠️ | 3/49 | Only 3 NL casinos (unibet-nl, betmgm-nl, circus-nl) |
| `affiliateOffers` | ❌ | 0/49 | All empty `[]` |
| `logo` | ❌ | 0/49 | All `null` |
| `founded` | ❌ | 0/49 | All `null` |
| `withdrawalMethods` | ❌ | 0/49 | All empty `[]` |
| `withdrawalProcessingTime` | ❌ | 0/49 | All `null` |
| `kycDocuments` | ❌ | 0/49 | All empty `[]` |

### Data Fields WITH Provenance

| Field | Has Provenance | Source Types |
|-------|----------------|--------------|
| `licenses` | ✅ | GGL whitelist, KSA register, KSC register, on-site verification |
| `paymentMethods` | ✅ | Official payment pages, operator websites |
| `responsibleGambling` | ✅ | Operator RG pages |
| `countries` | ✅ | Regulator registers, operator websites |
| `dataSources` | ✅ | Verification evidence with URLs |
| `lastVerifiedAt` | ✅ | Timestamp from verification process |

### Structured Data Audit

| Schema | Currently Emitted | Condition | Issue |
|--------|-------------------|-----------|-------|
| `Review` | Always | `casino.rating !== null` adds `reviewRating` | Schema emitted even when rating is null. The `reviewRating` block IS conditionally excluded (good), but the Review schema itself is always present. Without rating, it's a Review with no rating — technically valid but thin. |
| `FAQPage` | Conditional | Only when `casino.review.faq.length > 0` | Never emitted (0/49 have FAQ data). However, `CasinoFAQ` component generates FAQ content dynamically — this content is NOT reflected in the FAQPage schema. |
| `BreadcrumbList` | Always | Always valid | ✅ No issues |
| `AggregateRating` | Never | N/A | ✅ Not emitted (correct — no player rating data) |

**Key finding:** The `CasinoFAQ` component generates FAQ items from real data (license, payment methods, min deposit, mobile, games, countries), but the FAQPage JSON-LD schema only emits when `casino.review.faq` has data (which it never does). This means the visible FAQ content has no matching structured data.

### Internal Link Coverage

| Link Target | Source in Profile | Link Type |
|-------------|-------------------|-----------|
| `/casinos` | Breadcrumb | Navigation |
| `/{geo}` pages | CasinoEntityLinks | Contextual (per-GEO) |
| `/payments/{method}` | CasinoEntityLinks | Contextual (per-method) |
| `/compare?casinos=...` | CasinoCompareCTA | Contextual |
| `/guides/{slug}` | RelatedGuides | Contextual (max 3) |
| `/methodology` | Methodology section | Contextual |
| `/responsible-gambling` | NOT linked from profile | ❌ Missing |
| `/about` | NOT linked from profile | ❌ Missing |
| Other casino profiles | RelatedCasinos | Contextual (max 4) |

### Related Casinos Algorithm

**File:** `src/lib/data/composite-provider.ts:105-133`

**Complexity:** O(N) — single pass through all casinos, compute similarity, sort, slice.

**Algorithm:**
1. Find target casino by ID
2. For each other verified casino, compute similarity score:
   - `countryOverlap` = number of shared countries
   - `liveCasinoMatch` = 1 if same hasLiveCasino flag, else 0
   - `gameOverlap` = number of shared game categories (by slug)
   - `paymentOverlap` = number of shared payment methods (by name)
3. Sort by similarity descending
4. Return top `limit` (default 4)

**Determinism:** ✅ Results are deterministic for same input.

**Neutrality:** ✅ No affiliate/paid placement influence. Pure factual similarity.

### Thin Content Risks

| Section | Risk | Mitigation |
|---------|------|------------|
| EditorialReview with null scoreBreakdown | Shows only overview + verdict (2 paragraphs) | Overview is 2-4 sentences of factual content |
| BonusSection (46/49 empty) | Shows "not currently available" card | Appropriate neutral absence state |
| CasinoFAQ (dynamically generated) | Generates 0-6 FAQs from real data | Content is factual, not fabricated |
| PlayerReviews (NOT rendered) | Component exists but unused | Correct — no player review data exists |
| ComplaintSummary (NOT rendered) | Component exists but unused | Correct — no complaint data exists |
| AffiliateCTA (0/49 offers) | Renders null when no offers | Correct — AffiliateCTA returns null when no offer |

### Duplicate/Template Risks

- `review.overview` follows a boilerplate pattern: "[Name] is operated by [Company] under a [Licence] licence. Payment methods include [...]. Responsible gambling tools [...]."
- `review.verdict` is typically 1 sentence summarizing the operator.
- All 49 casinos have similar structure but different factual content.
- **Risk:** Low — content is factual and differentiated by actual casino attributes.

---

## Phase 2: Safe Enrichment Rules

Based on the audit, the following enrichment is safe:

### ALLOWED (data exists, can be exposed better)

1. **Description field** — 49/49 have it, currently shown only in metadata (title/description). Can be rendered more prominently.
2. **CasinoFAQ → FAQPage schema** — FAQ content is dynamically generated from real data but has no matching JSON-LD. Add FAQPage schema from the generated FAQs.
3. **Minimum age** — Available in data (`minAge`), shown in Quick Facts but not prominently.
4. **KYC information** — Available in data (`kycRequired`, `kycDocuments`), shown in Quick Facts but not prominently.
5. **Languages/currencies** — Available in data, shown in Quick Facts but not prominently.
6. **Feature flags** — `hasLiveCasino`, `hasSportsBetting`, `hasCrypto`, `hasMobile` — all populated.

### NOT ALLOWED (no data, must not fabricate)

1. ❌ Player ratings (all null)
2. ❌ Pros/cons (all empty)
3. ❌ Bonuses for 46/49 casinos
4. ❌ Affiliate offers for all casinos
5. ❌ Logos
6. ❌ Founding year
7. ❌ Withdrawal methods/times
8. ❌ KYC documents list
9. ❌ Any fabricated editorial content

---

## Phase 3: Casino Description Strategy

**Current state:** 49/49 casinos have `description` field with factual content.

**Current usage:** The `description` field is NOT rendered in the profile page body. It is only used:
- In `generateMetadata()` for the page `<title>` and `<meta description>` (via `review.overview`)
- In the Review JSON-LD schema as `itemReviewed.description`

**Recommendation:** The `description` field contains richer factual content than `review.overview`. Consider rendering it as the primary profile description, or merging it with `review.overview` for a more complete picture.

---

## Phase 4: Profile Information Architecture

**Currently rendered sections:**
1. ✅ Hero (name, tagline, trust badges, license badges, rating, CTA)
2. ✅ Editorial Review (overview, score breakdown, pros/cons, verdict)
3. ✅ Trust & Licensing (licenses, operator, verification status)
4. ✅ Bonuses & Promotions (or "not available")
5. ✅ Payment Methods (deposit + withdrawal)
6. ✅ Available Games
7. ✅ Responsible Gambling
8. ✅ FAQ (dynamically generated)
9. ✅ Entity Links (GEOs + payment methods)
10. ✅ Compare CTA
11. ✅ Related Guides
12. ✅ Methodology
13. ✅ Quick Facts (sidebar)
14. ✅ Related Casinos
15. ✅ Affiliate CTA + Disclosure

**NOT rendered (components exist but unused):**
- PlayerReviews — correct, no data
- ComplaintSummary — correct, no data

**Missing from profile but available in data:**
- Minimum age (in Quick Facts but not in main content)
- KYC requirements (in Quick Facts but not in main content)
- Languages (in Quick Facts but not in main content)
- Currencies (in Quick Facts but not in main content)

---

## Phase 5: Trust Model

**Current separation:**
- ✅ Editorial score (`casino.rating`) — separate from player rating
- ✅ Player rating (`playerRating` prop in CasinoHero) — conditionally rendered, clearly labeled
- ✅ Affiliate CTA — clearly distinguished with disclosure text
- ✅ Affiliate Disclosure — rendered as banner and inline

**Issues:**
- ⚠️ All ratings are null — the "BeInCasinos Rating" shows "—" which is correct
- ⚠️ No player reviews exist — the PlayerReviews component is not rendered, which is correct
- ⚠️ No complaints exist — the ComplaintSummary component is not rendered, which is correct

---

## Phase 6: Structured Data Findings

| Issue | Severity | Description |
|-------|----------|-------------|
| Review schema emitted without rating | MEDIUM | The Review JSON-LD is always emitted. When `rating` is null, the `reviewRating` block is excluded (correct), but the Review schema itself still exists with no rating. Google may consider this thin. |
| FAQPage schema never emitted | HIGH | The `CasinoFAQ` component generates FAQ content from real data (license, payments, deposit, mobile, games, countries), but the FAQPage JSON-LD only checks `casino.review.faq` (which is always empty). The visible FAQ content has no matching structured data. |
| No Organization schema | LOW | The profile doesn't include an Organization schema for the casino operator. |

---

## Phase 7-10: Implementation Scope

Based on the audit, the following changes are safe and impactful:

### Priority 1: Fix FAQPage Schema (HIGH)
The CasinoFAQ component generates FAQ items from real data, but the JSON-LD schema only checks `casino.review.faq`. Fix: generate FAQPage schema from the same `generateFAQs()` function used by the component.

### Priority 2: Remove Misleading Review Schema (MEDIUM)
When all ratings are null, emitting a Review schema with no rating is thin/misleading. Either:
- Conditionally emit Review schema only when `casino.rating !== null` (currently always emitted)
- Or keep it but ensure it accurately represents the data

### Priority 3: Expose Minimum Age + KYC Prominently (LOW)
These are important trust signals currently buried in the Quick Facts sidebar. Add them to the TrustSection or a dedicated "Player Information" section.

### Priority 4: Improve EditorialReview When Data is Sparse (LOW)
When `scoreBreakdown` is null and `pros/cons` are empty, EditorialReview shows only overview + verdict. Consider hiding the empty score breakdown grid and pros/cons sections rather than showing empty cards.

---

## Files to Modify

| File | Change |
|------|--------|
| `src/app/casino-reviews/[slug]/page.tsx` | Fix FAQPage schema generation, conditionally emit Review schema |
| `src/components/casino/v2/EditorialReview.tsx` | Hide empty sections (score breakdown when null, pros/cons when empty) |
| `src/components/casino/v2/TrustSection.tsx` | Add minimum age, KYC requirements |
| `src/lib/seo/__tests__/internal-linking.test.ts` | Add casino profile linking tests |
| `docs/seo/phase-30c-s-casino-profile-enrichment.md` | This file |

---

## QA Baseline

- Tests: 740/740 PASS
- TypeScript: PASS
- Build: PASS (67 pages)
- DB: 138/829/0
