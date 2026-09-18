# Phase 30C-A Baseline Audit — BeInCasinos

> Date: Phase 30C-A start
> Status: 138 verified casinos, 576/576 tests passing

---

## 1. Current Route Count

### Static pages (16)
| Route | Indexable | Canonical | Robots |
|-------|-----------|-----------|--------|
| `/` | Yes | `/` | index, follow |
| `/casinos` | Yes | `/casinos` | index, follow |
| `/ai-casino-match` | Yes | `/ai-casino-match` | index, follow |
| `/compare` | Conditional | `/compare` | Dynamic (noindex for ad-hoc) |
| `/about` | Yes | `/about` | index, follow |
| `/methodology` | Yes | `/methodology` | index, follow |
| `/responsible-gambling` | Yes | `/responsible-gambling` | index, follow |
| `/contact` | Yes | `/contact` | index, follow |
| `/guides` | Yes | `/guides` | index, follow |
| `/privacy-policy` | Yes | `/privacy-policy` | index, follow |
| `/terms` | Yes | `/terms` | index, follow |
| `/affiliate-disclosure` | Yes | `/affiliate-disclosure` | index, follow |
| `/for-casinos` | Yes | `/for-casinos` | index, follow |
| `/for-casinos/pricing` | Yes | `/for-casinos/pricing` | index, follow |
| `/for-casinos/list-your-casino` | Yes | `/for-casinos/list-your-casino` | index, follow |
| `/for-casinos/contact` | Yes | `/for-casinos/contact` | index, follow |

### Dynamic routes (English)
| Route | Count | Indexable |
|-------|-------|-----------|
| `/casino-reviews/[slug]` | 138 | Yes |
| `/guides/[slug]` | 3 | Yes |

### GEO pages
| Route | Indexable | In Sitemap |
|-------|-----------|------------|
| `/de` | Yes | Yes |
| `/fr` | Yes | Yes |
| `/nl` | Yes | Yes |
| `/be` | Yes | Yes |
| `/at` | Yes | **NO** |
| `/it` | Yes | **NO** |
| `/ch` | Yes | **NO** |
| `/ie` | Yes | Yes |

### Germany sub-pages
| Route | Indexable | In Sitemap |
|-------|-----------|------------|
| `/de/casinos` | Yes | Yes |
| `/de/best-casinos` | Yes | **NO** |
| `/de/compare` | Yes | **NO** |
| `/de/guides` | Yes | Yes |
| `/de/casino-reviews/[slug]` | Yes | Yes |
| `/de/guides/[slug]` | Yes | Yes |

### Total indexable URLs
- Static: 16
- Casino profiles (EN): 138
- Guides (EN): 3
- GEO hubs: 8
- DE sub-pages: 4 static + 138 casino + 3 guides = 145
- **Total: ~310 indexable URLs**

---

## 2. Current Sitemap Behavior

- Uses `SITE_URL` consistently ✓
- No CasinoLynora references ✓
- No API routes ✓
- No duplicate URLs ✓
- All entries have required fields ✓
- **Missing:** `/at`, `/it`, `/ch` GEO hubs
- **Missing:** `/de/best-casinos`, `/de/compare`
- Casino pages use `lastVerifiedAt` for `lastModified` ✓
- Guide pages use `lastUpdated` for `lastModified` ✓

---

## 3. Current Robots Behavior

- Allows all public pages ✓
- Blocks `/api/` ✓
- Sitemap URL uses `SITE_URL` ✓
- No blocking of GEO, casino, or B2B pages ✓
- **Missing:** No `noai`/`noimageai` directives (AI training protection)

---

## 4. Current Canonical Behavior

- All pages use `alternates.canonical` ✓
- Relative canonicals resolved via `metadataBase` in root layout ✓
- No old CasinoLynora domain references ✓
- Casino profiles: `/casino-reviews/${slug}` ✓
- GEO pages: `/${geo}` ✓
- DE pages: `/de/...` ✓
- Guides: `/guides/${slug}` ✓

---

## 5. Current Metadata Behavior

- Root layout: `metadataBase: new URL(SITE_URL)` ✓
- Title template: `%s | BeInCasinos` ✓
- Default title: `BeInCasinos — Independent Casino Reviews & Comparisons` ✓
- OG and Twitter cards on all pages ✓
- **Casino listing title:** "All Casinos — BeInCasinos" (could be more descriptive)
- **AI matchmaker title:** "AI Casino Matchmaker — Find Your Perfect Casino" (good)

---

## 6. Current Structured Data

### Organization (root layout)
- name: BeInCasinos ✓
- url: SITE_URL ✓
- description ✓
- **Missing:** logo, sameAs, contactPoint

### WebSite (root layout)
- name: BeInCasinos ✓
- url: SITE_URL ✓
- potentialAction: SearchAction → targets `/casinos?q={search_term_string}` (broken — no search results page exists)

### Review (casino profiles)
- Valid schema with real data ✓
- author: "BeInCasinos" ✓
- No fake ratings ✓

### FAQPage (casino profiles)
- Only when FAQ data exists ✓

### BreadcrumbList
- Casino profiles: ✓ (uses SITE_URL)
- **Missing:** guides, GEO, methodology, about, B2B pages

---

## 7. Current Internal Linking

### Homepage links to:
- `/ai-casino-match` (matchmaker CTA)
- `/casinos` (explore casinos)
- Featured casino cards → `/casino-reviews/[slug]`
- 5 GEO hubs: DE, IE, NL, BE, FR
- `/guides` (browse all guides)
- `/responsible-gambling`
- **Missing:** `/compare`, `/methodology`, `/about`, `/for-casinos`

### Footer links to:
- BeInCasinos: about, methodology, responsible-gambling, contact
- Discover: casinos, ai-casino-match, compare, guides
- Germany: de, de/casinos, de/best-casinos, de/guides
- For Operators: for-casinos, for-casinos/pricing, for-casinos/list-your-casino, for-casinos/contact
- Legal: responsible-gambling, affiliate-disclosure, privacy-policy, terms
- **Missing:** Other GEOs (FR, NL, BE, AT, IT, CH, IE)

### Casino profile links to:
- Related casinos ✓
- Breadcrumbs ✓
- **Missing:** Country-specific links, guide links, methodology link

---

## 8. Identified Gaps

### Critical
1. Sitemap missing 3 GEO hubs (`/at`, `/it`, `/ch`)
2. Sitemap missing `/de/best-casinos`, `/de/compare`
3. WebSite schema has broken SearchAction (no search results page)
4. Organization schema missing logo, sameAs

### Medium
5. Casino listing title could be more SEO-friendly
6. BreadcrumbList missing from guides, GEO, methodology, about
7. Homepage missing links to `/compare`, `/methodology`
8. Footer only shows Germany GEO — missing 7 other GEOs
9. SEO test hardcoded to `beincasinos.com`

### Low
10. No `noai`/`noimageai` in robots
11. AI matchmaker could benefit from `robots: noindex` (client-rendered tool)
12. Casino profiles lack country/guide cross-links

---

## 9. Pre-Existing Lint Issues (8)

These are NOT introduced by Phase 30C-A:
- `<a>` tags that should be `<Link>` components
- Unescaped HTML entities in JSX

These will NOT be fixed in this phase (out of scope).
