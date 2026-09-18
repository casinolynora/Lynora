# Internal Link Audit — BeInCasinos

> Date: Phase 30C-A
> Scope: All indexable pages, internal link structure

---

## 1. Audit Summary

### Link Distribution

| Page Type | Inbound Internal Links | Assessment |
|---|---|---|
| Homepage (`/`) | Root | Hub — links to all major sections |
| Casino Listing (`/casinos`) | Homepage, Footer, Guides | Good |
| Casino Profile (`/casino-reviews/[slug]`) | Homepage (featured), Casino Listing, Related Casinos | Good |
| GEO Hub (`/[geo]`) | Homepage (8 GEOs), Footer (8 GEOs) | Good (improved in 30C-A) |
| Guide Hub (`/guides`) | Homepage, Footer, GEO pages | Good |
| Guide Detail (`/guides/[slug]`) | Guide Hub, Related Guides | Good |
| Compare (`/compare`) | Homepage, Footer | Good |
| Methodology (`/methodology`) | Homepage (new), Footer | Good (improved in 30C-A) |
| About (`/about`) | Footer | Adequate |
| B2B Pages | Footer | Adequate |
| AI Matchmaker (`/ai-casino-match`) | Homepage, Footer, GEO pages | Good |

### Orphan Pages (No Internal Links)

None detected. All indexable pages are reachable from at least one internal link.

### Broken Internal Links

None detected. All `<Link href>` targets correspond to existing routes.

### Weak Internal Connectivity

| Page | Issue | Recommendation |
|---|---|---|
| `/about` | Only linked from Footer | Homepage link would help, but not critical |
| `/responsible-gambling` | Only linked from Homepage (bottom) and Footer | Adequate — important page, well-placed |
| `/affiliate-disclosure` | Only linked from Footer | Adequate — legal page |
| `/privacy-policy` | Only linked from Footer | Adequate — legal page |
| `/terms` | Only linked from Footer | Adequate — legal page |
| `/contact` | Only linked from Footer | Adequate — contact page |

---

## 2. Cross-Entity Linking (Implemented)

### Casino → Country
- Casino profiles show country availability via `casino.countries`
- GEO pages list available casinos for that country
- Casino profiles do NOT currently link to GEO pages (opportunity)

### Casino → Payment
- Casino profiles show payment methods via `casino.paymentMethods`
- Payment methods are displayed as badges/labels
- No dedicated payment pages exist yet (future `/payments/[method]`)

### Casino → Guide
- Casino profiles do NOT currently link to relevant guides
- Guides do NOT currently link to relevant casino profiles
- Opportunity: Add contextual guide links in casino profiles

### Casino → Comparison
- Casino profiles do NOT currently link to comparison tool
- Opportunity: Add "Compare this casino" CTA

### Country → Casino
- GEO pages list available casinos for that country ✓
- Links use `/${geo}/${casino.slug}` format (may need verification)

### Guide → Casino
- Guides do NOT currently link to specific casino profiles
- Opportunity: Add contextual casino links in guides where relevant

---

## 3. Homepage Link Structure

### Current Homepage Links
1. `/ai-casino-match` — Hero CTA
2. `/casinos` — Hero CTA
3. Featured casinos → `/casino-reviews/[slug]`
4. 8 GEO hubs → `/{geo}`
5. `/guides` — GEO section
6. `/compare` — GEO section (new in 30C-A)
7. `/methodology` — GEO section (new in 30C-A)
8. `/responsible-gambling` — Bottom section

### Missing Homepage Links
- `/about` — Not critical, linked from Footer
- `/for-casinos` — B2B, linked from Footer
- Individual guide pages — Not needed (hub link sufficient)

---

## 4. Footer Link Structure

### Current Footer Sections
1. BeInCasinos: about, methodology, responsible-gambling, contact
2. Discover: casinos, ai-casino-match, compare, guides
3. Casinos by Country: 8 GEOs (improved in 30C-A)
4. For Operators: for-casinos, pricing, list-your-casino, contact
5. Legal: responsible-gambling, affiliate-disclosure, privacy-policy, terms

### Assessment
Footer provides comprehensive navigation to all major sections. No orphan pages.

---

## 5. Breadcrumb Structure (Implemented in 30C-A)

| Page | Breadcrumb | Schema |
|---|---|---|
| Casino Profile | Home / Casinos / [Name] | BreadcrumbList ✓ |
| Guide Hub | Home / Guides | BreadcrumbList ✓ |
| Guide Detail | Home / Guides / [Title] | BreadcrumbList ✓ |
| GEO | Home / [Country] | BreadcrumbList ✓ |
| Methodology | Home / Methodology | BreadcrumbList ✓ |
| About | Home / About | BreadcrumbList ✓ |
| Compare | None (ad-hoc, noindex) | N/A |
| Casinos | None (listing page) | Opportunity |

---

## 6. Recommendations

### Implemented in 30C-A
- ✅ Homepage links to all 8 GEOs
- ✅ Homepage links to `/compare`, `/methodology`
- ✅ Footer links to all 8 GEOs
- ✅ BreadcrumbList schema on guides, GEO, methodology, about
- ✅ Breadcrumb navigation on guides, GEO, methodology, about

### Future Opportunities
- Casino profiles could link to relevant GEO pages
- Casino profiles could link to comparison tool
- Guides could link to relevant casino profiles
- Casino listing page could have breadcrumb schema
- Country-specific casino links could use `/{geo}/casino-reviews/{slug}` format

### Not Recommended
- Do not add excessive cross-links (would dilute link equity)
- Do not force exact-match keyword anchors
- Do not link to pages that don't exist
