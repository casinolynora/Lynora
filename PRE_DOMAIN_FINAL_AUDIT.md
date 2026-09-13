# PRE_DOMAIN_FINAL_AUDIT.md

**Date:** September 13, 2026
**Commit:** 45e6704
**Deployment:** https://casinolynora.vercel.app
**Route Count:** 43

---

## 1. What Was Changed

### Canonical URL System
- Created `src/lib/config/site.ts` — centralized `SITE_URL`, `SITE_NAME`, `CONTACT_EMAILS`
- Replaced **41 hardcoded `casinolynora.com` references** across 23+ files with centralized config
- All page metadata now uses **relative canonical paths** (resolved via `metadataBase` in root layout)
- `layout.tsx`, `sitemap.ts`, `robots.ts` all use `SITE_URL` from centralized config
- Contact emails centralized in `CONTACT_EMAILS` constant

### Sitemap & Robots
- Sitemap uses centralized `SITE_URL` (consistent with robots.txt)
- Removed broken `/nl/casino-reviews/` and `/be/casino-reviews/` URLs (no route files exist)
- Added `/ie` to sitemap
- Removed dead `/admin/` disallow from robots.txt

### Ireland GEO
- Created `/ie` page with regulatory information, responsible gambling content
- Added `ie` to `SUPPORTED_GEOS` in `[geo]/page.tsx`
- Added `IE` to `VALID_GEOS` in `import.ts`

### SEO Fixes
- Added homepage metadata (title, description, canonical)
- Fixed `/de` 3-way canonical collision (removed metadata from `de/layout.tsx`)
- All canonicals now use relative paths

### Performance
- Added `next/dynamic` import for `MatchmakerFlow` with loading spinner
- Homepage now has internal links to GEO pages and guides

### Legal Pages
- Privacy Policy: expanded to 11-section GDPR-style policy
- Terms of Use: expanded to 12-section comprehensive terms
- Responsible Gambling: expanded with warning signs, self-assessment, practical tips
- About: expanded with methodology, data verification, affiliate transparency
- Contact: improved with inquiry routing, response times, limitations

### Analytics Architecture
- `initAnalytics()` now checks cookie consent before activating GA4
- Cookie consent stores accept/decline state in localStorage

### Affiliate Tracking
- Created `src/lib/config/affiliates.ts` with centralized affiliate config
- Supports ClickDealer tracking URLs with `s1` subsource parameter
- Binobet IE offer pre-configured (disabled by default)

---

## 2. Files Changed

### New Files (3)
| File | Purpose |
|------|---------|
| `src/lib/config/site.ts` | Centralized URL, site name, contact emails |
| `src/lib/config/affiliates.ts` | Affiliate offer configuration and tracking |
| `src/app/ie/page.tsx` | Ireland GEO hub page |

### Modified Files (30)
| File | Change |
|------|--------|
| `src/app/layout.tsx` | Use `SITE_URL` for metadataBase and JSON-LD |
| `src/app/page.tsx` | Added homepage metadata + GEO hub links section |
| `src/app/sitemap.ts` | Use `SITE_URL`, removed broken NL/BE review URLs, added /ie |
| `src/app/robots.ts` | Use `SITE_URL`, removed /admin disallow |
| `src/app/about/page.tsx` | Relative canonical, expanded content |
| `src/app/contact/page.tsx` | Relative canonical, CONTACT_EMAILS import |
| `src/app/privacy-policy/page.tsx` | Relative canonical, expanded to 11 sections |
| `src/app/terms/page.tsx` | Relative canonical, expanded to 12 sections |
| `src/app/responsible-gambling/page.tsx` | Relative canonical, expanded content |
| `src/app/affiliate-disclosure/page.tsx` | Relative canonical, CONTACT_EMAILS import |
| `src/app/methodology/page.tsx` | Relative canonical |
| `src/app/casinos/page.tsx` | Relative canonical |
| `src/app/compare/page.tsx` | Relative canonical |
| `src/app/guides/page.tsx` | Relative canonical |
| `src/app/guides/[slug]/page.tsx` | Relative canonical |
| `src/app/casino-reviews/[slug]/page.tsx` | Relative canonical |
| `src/app/ai-casino-match/page.tsx` | Relative canonical, dynamic import for MatchmakerFlow |
| `src/app/[geo]/page.tsx` | Relative canonical, added ie to SUPPORTED_GEOS |
| `src/app/de/layout.tsx` | Removed metadata export (fixed canonical collision) |
| `src/app/de/page.tsx` | Relative canonical |
| `src/app/de/casinos/page.tsx` | Relative canonical |
| `src/app/de/best-casinos/page.tsx` | Relative canonical |
| `src/app/de/compare/page.tsx` | Relative canonical |
| `src/app/de/guides/page.tsx` | Relative canonical |
| `src/app/de/guides/[slug]/page.tsx` | Relative canonical |
| `src/app/de/casino-reviews/[slug]/page.tsx` | Relative canonical |
| `src/lib/data/guides.ts` | Relative canonical in getGuideMetadata |
| `src/lib/data/import.ts` | Added IE to VALID_GEOS |
| `src/lib/analytics/events.ts` | Consent-gated analytics initialization |

---

## 3. SEO Issues Fixed

| Issue | Status |
|-------|--------|
| 41 hardcoded canonical URLs | **FIXED** — all use relative paths |
| Missing homepage metadata | **FIXED** — title, description, canonical added |
| /de 3-way canonical collision | **FIXED** — layout metadata removed |
| Sitemap using different URL than robots | **FIXED** — both use `SITE_URL` |
| Broken NL/BE review URLs in sitemap | **FIXED** — removed (no route files) |
| Dead /admin disallow in robots | **FIXED** — removed |
| Missing Ireland from GEO system | **FIXED** — /ie page created |
| No internal links on homepage to GEO pages | **FIXED** — GEO hub section added |
| MatchmakerFlow not lazy-loaded | **FIXED** — next/dynamic import added |
| Analytics not consent-gated | **FIXED** — checks localStorage consent |

---

## 4. Remaining Issues

### High Priority
| Issue | Notes |
|-------|-------|
| OG image missing on all pages | No `openGraph.images` set anywhere; social sharing shows no preview |
| No BreadcrumbList JSON-LD | Breadcrumbs exist visually on 4 pages but no structured data |
| Structured data only on casino reviews | No WebPage schema on informational pages |
| Rate limiter in-memory only | Won't persist on Vercel serverless; needs Redis/Upstash |

### Medium Priority
| Issue | Notes |
|-------|-------|
| No `x-default` hreflang | International pages set `languages` but no fallback |
| Twitter card missing on most pages | Only 3 routes set Twitter card |
| OG description missing on most pages | Only 4 routes have OG description |
| `/nl/casino-reviews/` and `/be/casino-reviews/` not routable | No route files; removed from sitemap |
| DE casino reviews missing OG/Twitter | `/de/casino-reviews/[slug]` has no OG unlike EN version |

### Low Priority
| Issue | Notes |
|-------|-------|
| No `<th scope="row">` in ComparisonTable | Minor accessibility |
| Mobile menu no focus trap | Minor accessibility |
| ComparisonTable no scroll hint on mobile | Minor UX |

---

## 5. Routes Audited

| Route | Status | Indexable | Content |
|-------|--------|-----------|---------|
| `/` | 200 | Yes | Homepage with GEO links, featured casinos, CTA |
| `/casinos` | 200 | Yes | Casino directory with search |
| `/ai-casino-match` | 200 | Yes | AI matchmaker (dynamic import) |
| `/compare` | 200 | Yes | Casino comparison table |
| `/about` | 200 | Yes | Expanded about page |
| `/contact` | 200 | Yes | Contact emails by category |
| `/methodology` | 200 | Yes | Scoring methodology |
| `/responsible-gambling` | 200 | Yes | Expanded responsible gambling |
| `/privacy-policy` | 200 | Yes | Expanded privacy policy |
| `/terms` | 200 | Yes | Expanded terms of use |
| `/affiliate-disclosure` | 200 | Yes | Affiliate disclosure |
| `/guides` | 200 | Yes | Guide directory |
| `/guides/[slug]` | 200 | Yes | 6 guides (SSG) |
| `/casino-reviews/[slug]` | 200 | Yes | Casino reviews with Review schema |
| `/de` | 200 | Yes | Germany hub |
| `/de/casinos` | 200 | Yes | Germany casino list |
| `/de/best-casinos` | 200 | Yes | Germany verified casinos |
| `/de/compare` | 200 | Yes | Germany comparison |
| `/de/guides` | 200 | Yes | Germany guides |
| `/de/guides/[slug]` | 200 | Yes | Germany guide pages |
| `/de/casino-reviews/[slug]` | 200 | Yes | Germany casino reviews |
| `/ie` | 200 | Yes | Ireland hub (NEW) |
| `/nl` | 200 | Yes | Netherlands hub |
| `/be` | 200 | Yes | Belgium hub |
| `/fr` | 200 | Yes | France regulatory notice |
| `/at` | 200 | Yes | Austria (no casino data) |
| `/it` | 200 | Yes | Italy (no casino data) |
| `/ch` | 200 | Yes | Switzerland (no casino data) |
| `/sitemap.xml` | 200 | N/A | Dynamic sitemap |
| `/robots.txt` | 200 | N/A | Robots directives |
| `/api/ai/match` | — | No | API route (correctly disallowed) |
| `/api/ai/refine` | — | No | API route (correctly disallowed) |

---

## 6. Sitemap Status

- **URL:** `https://casinolynora.com/sitemap.xml` (configurable via `NEXT_PUBLIC_CANONICAL_URL`)
- **Total entries:** ~60+ (21 static + 49 casino reviews + 6 guide pages + 6 DE guide pages)
- **No broken URLs** (removed NL/BE review URLs that had no route files)
- **All absolute URLs** using centralized `SITE_URL`
- **No duplicates**
- **No parameterized or API routes**

---

## 7. Robots Status

- **URL:** `https://casinolynora.com/robots.txt` (configurable via `NEXT_PUBLIC_CANONICAL_URL`)
- **Allows:** `/` (all public pages)
- **Disallows:** `/api/` (match and refine API routes)
- **Sitemap reference:** `${SITE_URL}/sitemap.xml`
- **No CSS/JS blocked**

---

## 8. Canonical Status

- **Root layout:** `metadataBase` set to `SITE_URL` from `NEXT_PUBLIC_CANONICAL_URL || NEXT_PUBLIC_SITE_URL`
- **All pages:** Use relative canonical paths (e.g., `/about`, `/de`, `/casinos`)
- **Next.js resolves** relative canonicals against `metadataBase`
- **No hardcoded domain** in any page metadata
- **No duplicate canonicals** (fixed /de collision)
- **No self-referencing conflicts**

---

## 9. Privacy/Terms Status

### Privacy Policy
- 11 comprehensive sections
- Covers: data collection, cookies, analytics (none connected), affiliate links, third-party services, data retention, user rights, children's privacy, changes, contact
- Does NOT claim GA4 is active
- Does NOT fabricate company details
- Uses `CONTACT_EMAILS.general` for contact

### Terms of Use
- 12 comprehensive sections
- Covers: acceptance, purpose, informational nature, affiliate disclosure, accuracy, third-party sites, responsible gambling, prohibited misuse, IP, limitation of liability, changes, contact
- Does NOT make unsupported legal claims
- Uses `CONTACT_EMAILS.general` for contact

---

## 10. Affiliate Architecture Status

### Configuration
- `src/lib/config/affiliates.ts` — centralized affiliate offer config
- `AffiliateOfferConfig` type with tracking URL, subSources, GEO, channels, cap
- `getActiveOffers(geo)` — returns enabled offers for a GEO
- `getTrackingUrl(offerId, subSource)` — builds tracking URL with s1 parameter

### Binobet IE Offer
- Pre-configured but **disabled** (`enabled: false`)
- Tracking URL is empty placeholder (awaiting ClickDealer URL)
- Sub-sources defined: `bino-review`, `bino-bonus`, `bino-payment`, `bino-mobile`, `bino-match`
- All offer constraints documented in config

### Safety
- No affiliate links active until owner explicitly enables
- `affiliateOffers: []` for all existing casino data
- Existing `AffiliateCTA` component works with the config
- No cloaking, no misleading CTAs

---

## 11. Test Results

```
Test Files:  13 passed (13)
Tests:       204 passed (204)
Duration:    5.00s
TypeScript:  0 errors (tsc --noEmit clean)
```

---

## 12. Build Result

```
Route Count: 43 (up from 42 — added /ie)
Build:       Successful (Next.js 16.3.4 Turbopack)
Output:      All static + dynamic routes generated
```

---

## 13. Exact Steps Remaining Before Buying Domain

1. **Verify OG image** — Create and add an Open Graph image (`public/og-image.png`) for social sharing
2. **Add BreadcrumbList JSON-LD** — For casino reviews and guide pages
3. **Rate limiter** — Migrate from in-memory to Redis/Upstash for Vercel serverless
4. **Content review** — Have legal pages reviewed by a qualified professional
5. **Binobet tracking URL** — Obtain actual ClickDealer tracking URL and set `enabled: true`
6. **GA4 setup** — Create GA4 property, set `NEXT_PUBLIC_GA_ID` in Vercel
7. **Custom domain** — Purchase domain and configure DNS
8. **Vercel domain** — Add custom domain in Vercel project settings

---

## 14. Exact Steps After Domain Purchase

1. **Set env vars in Vercel:**
   - `NEXT_PUBLIC_CANONICAL_URL=https://yourdomain.com`
   - `NEXT_PUBLIC_SITE_URL=https://yourdomain.com`
2. **Verify deployment** — All routes return 200 on new domain
3. **Google Search Console:**
   - Add property for new domain
   - Verify ownership (DNS TXT record or HTML file)
   - Submit sitemap: `https://yourdomain.com/sitemap.xml`
   - Request indexing for key pages
4. **Bing Webmaster Tools:**
   - Add site
   - Submit sitemap
5. **Test canonical URLs** — Verify they resolve to new domain
6. **Test structured data** — Use Google Rich Results Test
7. **Monitor** — Check Search Console for crawl errors

---

## 15. Search Console Checklist

- [ ] Custom domain purchased and DNS configured
- [ ] `NEXT_PUBLIC_CANONICAL_URL` set in Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` set in Vercel
- [ ] Custom domain added in Vercel project settings
- [ ] All routes return HTTP 200 on new domain
- [ ] Google Search Console property created
- [ ] Domain ownership verified
- [ ] Sitemap submitted (`/sitemap.xml`)
- [ ] Robots.txt accessible and correct
- [ ] No `noindex` tags on indexable pages
- [ ] Canonical URLs point to new domain
- [ ] Structured data tested (Rich Results Test)
- [ ] Mobile usability tested
- [ ] Core Web Vitals baseline established
- [ ] 404 page working correctly
- [ ] Internal links functional
- [ ] Breadcrumbs rendering correctly
- [ ] OG image displaying on social shares
