# ADR-003: Player Trust Separation

## Status

**Accepted** (Phase 27)

## Context

CasinoLynora must maintain trust through independent signals. The platform has four distinct types of data that must never be conflated:

1. **Editorial Score** — Professional review by CasinoLynora's editorial team
2. **Player Rating** — Raw ratings from verified players
3. **Player Sentiment** — Aggregated player feedback (future)
4. **Commercial Placement** — B2B paid listings and promotions

These signals serve different purposes and must remain independent.

## Decision

**Editorial Score ≠ Player Rating ≠ Player Sentiment ≠ Commercial Placement**

### Why This Matters

| Signal | Source | Purpose | Modification Rules |
|--------|--------|---------|-------------------|
| Editorial Score | CasinoLynora staff | Professional assessment | Only by editorial team |
| Player Rating | Verified players | User experience feedback | Raw input, never auto-merged |
| Player Sentiment | Aggregated reviews | Trend analysis | Derived, never manual |
| Commercial Placement | B2B agreements | Operator visibility | Never affects editorial |

### Implementation Rules

1. **Editorial scores are never modified by:**
   - Player review ratings
   - Complaint volume or severity
   - B2B payment status
   - Affiliate payout amounts
   - Featured/Premium listing status

2. **Player ratings are:**
   - Stored as raw 1-5 integer values
   - Never automatically merged into editorial scores
   - Aggregated separately for display
   - Clearly labeled as "Player Reviews" (distinct from "Editorial Review")

3. **Player sentiment (future) will be:**
   - A derived metric from approved reviews
   - Displayed as a separate signal
   - Never conflated with editorial scoring

4. **Commercial placement is:**
   - Controlled by B2B subscription status
   - Never affects organic ranking or editorial score
   - Clearly labeled as "Sponsored" or "Promoted"

### Public Display

Casino profile pages must clearly distinguish:

```
CasinoLynora Editorial Review
★★★★☆ 8.5/10 — Our expert assessment

Player Reviews
★★★★☆ 4.2/5 from 18 approved reviews — Player experiences

[These are independent ratings]
```

## Consequences

### Positive
- Clear trust architecture for users
- Independent signals prevent manipulation
- Editorial integrity preserved
- Player feedback remains authentic
- Commercial relationships transparent

### Negative
- More complex data model
- Requires clear UI differentiation
- Future aggregation must maintain separation

### Risks
- None at current scale. Separation is enforced at the data layer.

## References

- Phase 27 implementation
- Trust module: `src/lib/trust/`
- Schema: `src/lib/db/schema.ts` (playerReviews, complaints, moderationActions)
