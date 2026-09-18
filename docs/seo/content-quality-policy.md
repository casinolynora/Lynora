# Content Quality Policy — BeInCasinos

> Internal policy governing what content may become indexable on BeInCasinos.

---

## 1. Core Principle

Every indexable page must answer a specific search intent with information that is:

- **Accurate** — based on verified, structured data
- **Unique** — providing value not available on other pages on this site
- **Evidence-based** — supported by provenance data where applicable
- **Human-readable** — written for users, not search engine bots

---

## 2. Page Eligibility Rules

### Casino Profile (`/casino-reviews/[slug]`)
- Must have `status === "active"` AND `verificationStatus === "verified"`
- Must have structured review data (overview, score breakdown)
- Must have at least one license record
- Must have at least one payment method
- Auto-indexed when these conditions are met

### Country Page (`/[geo]`)
- Must have ≥3 verified casinos available in that GEO
- Must contain genuine country-specific information (regulation, payment landscape)
- Must NOT be a translated doorway page
- Must provide unique value beyond a list of casinos

### Payment Page (`/payments/[method]`) — Future
- Must have ≥5 verified casinos supporting the method
- Must contain genuine payment-specific information (fees, processing times, availability)
- Must NOT be a thin affiliate page

### Guide (`/guides/[slug]`)
- Must contain original, expert-written content
- Must answer a specific user question
- Must NOT be AI-generated filler
- Must NOT be scraped or copied from competitors

### Comparison (`/compare`)
- Ad-hoc comparisons (`?casinos=a,b`): always `noindex`
- Curated comparisons: may be indexed only if they provide lasting value

---

## 3. Content Anti-Patterns (Forbidden)

| Anti-Pattern | Why It's Forbidden |
|---|---|
| Scaled doorway pages | Google penalty; provides no unique value |
| AI-generated filler content | Low quality; no first-hand experience |
| Scraped competitor content | Copyright violation; no unique value |
| Fake user reviews/testimonials | Deceptive; violates trust |
| Inflated ratings or statistics | Misleading; damages credibility |
| Keyword stuffing | Google penalty; poor user experience |
| Thin affiliate pages | Low quality; no editorial value |
| Auto-translated content without review | Low quality; may contain errors |

---

## 4. Affiliate Link Rules

- Affiliate links MUST be clearly disclosed on every page containing them
- Affiliate links MUST use `rel="noopener noreferrer sponsored"`
- Affiliate commission potential MUST NOT influence editorial scoring
- Affiliate links MUST NOT be the primary reason a page exists
- The `AffiliateDisclosure` component MUST be visible on all profile pages

---

## 5. Editorial vs Commercial Separation

| Layer | Source | Manipulable by Operators? |
|---|---|---|
| Editorial Score | BeInCasinos editorial team | No |
| Player Rating | Aggregated player data | No |
| Player Sentiment | Structured sentiment analysis | No |
| Commercial Placement | B2B placement agreements | Yes (but clearly labeled) |

Paid placement MUST NEVER alter editorial scores, ratings, or review content.

---

## 6. AI Content Policy

- AI may be used for data extraction, structuring, and matching
- AI MUST NOT be used to generate final user-facing editorial content
- AI-generated suggestions MUST be reviewed before publication
- AI MUST NOT invent information — only reason over structured data
- All AI prompts identify as "BeInCasinos" (not CasinoLynora or any other brand)

---

## 7. Review Process

All new indexable content must pass:

1. **Data integrity check** — all claims backed by verified data
2. **Uniqueness check** — provides value not available elsewhere on site
3. **Intent check** — answers a specific, real user search query
4. **Quality check** — readable, well-structured, free of errors
5. **Disclosure check** — affiliate links properly disclosed

---

## 8. Monitoring

- Quarterly audit of all indexable pages for quality
- Monthly review of Search Console for manual actions
- Immediate removal of any page found to contain fabricated data
- Annual review of this policy
