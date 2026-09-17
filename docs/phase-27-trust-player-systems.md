# Phase 27: Trust and Player Systems Foundation

**Date**: 2026-09-17
**Status**: Complete

## Objective

Build the data and workflow foundation for player reviews, complaints, moderation, and trust signals — without creating an overcomplicated social network or fabricating any data.

## Architecture Principles

1. **Editorial Score ≠ Player Rating ≠ Player Sentiment ≠ Commercial Placement**
2. **No fake reviews, complaints, or users**
3. **Moderation is independent of B2B relationships**
4. **Privacy-first: minimal personal data**
5. **Deterministic anti-spam: no ML, no fake fraud scores**

## Data Model

### Tables Created

| Table | Purpose |
|-------|---------|
| `playerReviews` | Player-generated reviews with ratings (1-5 stars) |
| `complaints` | Player-submitted complaints about casinos |
| `moderationActions` | Audit trail of all moderation decisions |

### Relationships

```
casinos (1) ──→ (N) playerReviews
casinos (1) ──→ (N) complaints
playerReviews (1) ──→ (N) complaints (optional reference)
```

## Reviews

### Workflow

```
pending → approved | rejected
approved → flagged | hidden
flagged → approved | hidden | rejected
hidden → approved | flagged
rejected → (terminal)
```

### Verification

- `unverified` — Default state
- `verified` — CasinoLynora completed a defined verification process
- Verification does NOT mean "this review is guaranteed true"

### Moderation

Only `approved` reviews appear publicly. All moderation actions are logged in the `moderationActions` table for audit purposes.

## Complaints

### Workflow

```
submitted → under_review → operator_response → resolved → closed
submitted → under_review → awaiting_information → ...
submitted → rejected (terminal)
```

### Categories

Controlled values: `withdrawal`, `deposit`, `account`, `verification`, `bonus`, `customer_support`, `technical`, `responsible_gambling`, `other`

### Severity

Workflow priority: `low`, `medium`, `high`
NOT a judgment about the casino's legitimacy.

### Operator Response Readiness

The schema supports future operator responses:
- Player → Complaint → Casino/Operator → Operator response → Resolution

No operator accounts or dashboard built in Phase 27.

## Moderation Model

Append-only audit trail with:
- Action (approve, reject, hide, restore, flag, resolve, request_information, set_severity)
- Target (review or complaint)
- Moderator reference
- Reason (optional)
- Previous status
- Timestamp

## Privacy Model

### Public Data
- Approved reviews (title, body, rating, publishedAt)
- Resolved/closed complaints (subject, category, status)
- Player rating summary (average, count, distribution)

### Private Data
- Moderation notes and reasons
- IP addresses and user agents
- Rejection reasons
- Internal abuse signals
- Moderator identity details

## Anti-Spam Model

Deterministic, explainable rules:
- Content length validation
- URL density limits
- Repeated content detection
- Trigram similarity for duplicate detection
- Submission frequency limits
- HTML/script sanitization
- Suspicious pattern detection

No ML, no fake fraud scores.

## API Design

### Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/reviews` | Submit a new review |
| GET | `/api/reviews?casinoId=xxx` | Get approved reviews |
| POST | `/api/complaints` | Submit a new complaint |
| GET | `/api/complaints?casinoId=xxx` | Get public complaints |

### Security

- Rate limiting: 3 reviews/IP/hour, 2 complaints/IP/hour
- Input validation via Zod schemas
- Content sanitization
- Casino existence verification
- Server-controlled workflow state (never trust client-provided status)

## SEO Strategy

- Reviews appear as content inside casino profiles (not separate pages)
- No thin content pages for individual reviews
- Complaint pages indexed only when providing substantial public value
- No fabricated review counts or ratings in structured data

## Scalability

### Pagination

Offset/limit pagination with:
- Default page size: 20
- Maximum page size: 100
- Total count and page metadata in response

### Indexes

| Table | Indexes |
|-------|---------|
| playerReviews | casinoId, status, createdAt, rating, reviewerId |
| complaints | casinoId, status, createdAt, category, severity |
| moderationActions | targetType+targetId, action, createdAt |

### Expected Capacity

- 1,000 casinos × 100 reviews = 100,000 reviews
- Indexed queries handle this without performance issues
- SQLite handles 1M+ rows with proper indexes

## Limitations

1. **No authentication** — reviewerId is a stable anonymous identifier
2. **No operator dashboard** — schema ready, UI not built
3. **No email verification** — future phase
4. **No ML fraud detection** — deterministic rules only
5. **No public complaint rankings** — complaints are for resolution, not scoring

## Future Requirements

### Phase 28+ (When Needed)
- Authentication system (reviewerId → user ID)
- Operator response dashboard
- Email verification for reviews
- Advanced duplicate detection
- Review helpfulness voting
- Complaint escalation workflows

## Test Results

| Metric | Result |
|--------|--------|
| New tests | 87 |
| Total tests | 412 |
| TypeScript | Pass |
| Lint | Pass |
| Build | Pass |

## Files Created/Modified

### Created
- `src/lib/trust/validation.ts` — Zod schemas for reviews, complaints, moderation
- `src/lib/trust/transitions.ts` — Status transition rules
- `src/lib/trust/anti-spam.ts` — Content validation and abuse prevention
- `src/lib/trust/public-private.ts` — Public/private data separation
- `src/lib/trust/pagination.ts` — Pagination utilities
- `src/lib/trust/index.ts` — Barrel export
- `src/lib/trust/__tests__/trust.test.ts` — 87 tests
- `src/app/api/reviews/route.ts` — Review API endpoints
- `src/app/api/complaints/route.ts` — Complaint API endpoints
- `docs/adr-003-player-trust-separation.md` — Architecture decision record
- `docs/phase-27-trust-player-systems.md` — This document

### Modified
- `src/lib/db/schema.ts` — Added playerReviews, complaints, moderationActions tables
- `src/lib/db/index.ts` — Exported new types

## Production Safety Checklist

- [x] No secrets in code
- [x] No fake reviews
- [x] No fake complaints
- [x] No fake users
- [x] No fake verification
- [x] No fabricated operator responses
- [x] No fabricated trust metrics
- [x] No sensitive data leakage
- [x] No raw HTML injection
- [x] No client-side exposure of private moderation data
