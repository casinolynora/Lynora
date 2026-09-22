/**
 * Internal Linking Engine — Centralized, Deterministic Link Generation
 *
 * Rules:
 * - Casino→Payment: only supported methods
 * - Payment→Casino: relevant subset
 * - Casino→GEO: verified availability only
 * - GEO→Casino: available in market only
 * - Guide→Entity: contextual relevance
 * - Casino→Guide: relevant only
 * - Max links per section enforced to prevent explosion
 * - All output deterministic (sorted)
 */

// ─── Constants ────────────────────────────────────────────────────────────

/** Maximum internal links per section (prevents link explosion) */
export const MAX_LINKS_PER_SECTION = 20;

/** Maximum related items (casinos, guides, payments) per page section */
export const MAX_RELATED_CASINOS = 4;
export const MAX_RELATED_GUIDES = 3;
export const MAX_RELATED_PAYMENTS = 6;

// ─── Route Registry ───────────────────────────────────────────────────────

export interface RouteEntry {
  path: string;
  label: string;
  description?: string;
  /** Whether this route should be in sitemap/index pages */
  public: boolean;
  /** Whether this route is noindex (no inbound link boost) */
  noindex?: boolean;
}

/**
 * Canonical registry of all public routes.
 * Used for orphan detection and link generation.
 */
export const PUBLIC_ROUTES: RouteEntry[] = [
  { path: "/", label: "Home", public: true },
  { path: "/casinos", label: "All Casinos", public: true },
  { path: "/compare", label: "Compare Casinos", public: true, noindex: true },
  { path: "/ai-casino-match", label: "AI Matchmaker", public: true },
  { path: "/guides", label: "Guides", public: true },
  { path: "/payments", label: "Payment Methods", public: true },
  { path: "/methodology", label: "Our Methodology", public: true },
  { path: "/about", label: "About Us", public: true },
  { path: "/responsible-gambling", label: "Responsible Gambling", public: true },
  { path: "/contact", label: "Contact", public: true },
  { path: "/affiliate-disclosure", label: "Affiliate Disclosure", public: true },
  { path: "/privacy-policy", label: "Privacy Policy", public: true },
  { path: "/terms", label: "Terms of Use", public: true },
  // GEO pages
  { path: "/de", label: "Germany", public: true },
  { path: "/fr", label: "France", public: true },
  { path: "/nl", label: "Netherlands", public: true },
  { path: "/be", label: "Belgium", public: true },
  { path: "/at", label: "Austria", public: true },
  { path: "/it", label: "Italy", public: true },
  { path: "/ch", label: "Switzerland", public: true },
  { path: "/ie", label: "Ireland", public: true },
  { path: "/gb", label: "Great Britain", public: true },
  { path: "/se", label: "Sweden", public: true },
  { path: "/fi", label: "Finland", public: true },
  { path: "/no", label: "Norway", public: true },
  // Operator pages
  { path: "/for-casinos", label: "List Your Casino", public: true },
  { path: "/for-casinos/pricing", label: "Pricing", public: true },
  { path: "/for-casinos/list-your-casino", label: "Submit Listing", public: true },
  { path: "/for-casinos/contact", label: "Operator Contact", public: true },
];

// ─── Public GEOs ──────────────────────────────────────────────────────────

export const PUBLIC_GEOS = [
  { code: "de", name: "Germany", flag: "🇩🇪" },
  { code: "gb", name: "Great Britain", flag: "🇬🇧" },
  { code: "fr", name: "France", flag: "🇫🇷" },
  { code: "nl", name: "Netherlands", flag: "🇳🇱" },
  { code: "be", name: "Belgium", flag: "🇧🇪" },
  { code: "at", name: "Austria", flag: "🇦🇹" },
  { code: "it", name: "Italy", flag: "🇮🇹" },
  { code: "ch", name: "Switzerland", flag: "🇨🇭" },
  { code: "ie", name: "Ireland", flag: "🇮🇪" },
  { code: "se", name: "Sweden", flag: "🇸🇪" },
  { code: "fi", name: "Finland", flag: "🇫🇮" },
  { code: "no", name: "Norway", flag: "🇳🇴" },
] as const;

// ─── Breadcrumb Builder ───────────────────────────────────────────────────

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Build breadcrumb items for a given path.
 * Deterministic output based on path alone.
 */
export function buildBreadcrumbs(path: string): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];

  const segments = path.split("/").filter(Boolean);
  if (segments.length === 0) return crumbs;

  // Static route breadcrumbs
  const staticMap: Record<string, string> = {
    casinos: "Casinos",
    compare: "Compare",
    guides: "Guides",
    payments: "Payments",
    methodology: "Methodology",
    about: "About",
    "responsible-gambling": "Responsible Gambling",
    contact: "Contact",
    "ai-casino-match": "AI Matchmaker",
    "affiliate-disclosure": "Affiliate Disclosure",
    "privacy-policy": "Privacy Policy",
    terms: "Terms of Use",
    "for-casinos": "For Operators",
    pricing: "Pricing",
    "list-your-casino": "Submit Listing",
  };

  // GEO config
  const geoMap: Record<string, string> = {
    de: "Germany", fr: "France", nl: "Netherlands", be: "Belgium",
    at: "Austria", it: "Italy", ch: "Switzerland", ie: "Ireland",
    gb: "Great Britain", se: "Sweden", fi: "Finland", no: "Norway",
  };

  let builtPath = "";
  for (const segment of segments) {
    builtPath += `/${segment}`;

    if (geoMap[segment] && segments.length === 1) {
      crumbs.push({ label: geoMap[segment] });
    } else if (staticMap[segment]) {
      if (segment === segments[segments.length - 1]) {
        crumbs.push({ label: staticMap[segment] });
      } else {
        crumbs.push({ label: staticMap[segment], href: builtPath });
      }
    } else if (segment === "casino-reviews") {
      crumbs.push({ label: "Casinos", href: "/casinos" });
    } else if (segment === "slug" || segments[segments.length - 1] === segment) {
      // Dynamic segment — last segment is the entity name (no link)
      // The caller should provide the actual name; we skip for generic
    } else {
      // Unknown segment — just add as breadcrumb without link
      crumbs.push({ label: segment.charAt(0).toUpperCase() + segment.slice(1) });
    }
  }

  return crumbs;
}

// ─── Related Content Helpers ──────────────────────────────────────────────

/**
 * Get payment methods relevant to a casino.
 * Only returns methods the casino actually supports.
 */
export function getRelevantPaymentLinks(
  paymentMethods: Array<{ name: string }>,
  maxLinks: number = MAX_RELATED_PAYMENTS
): Array<{ name: string; slug: string }> {
  return paymentMethods
    .slice(0, maxLinks)
    .map((pm) => ({
      name: pm.name,
      slug: paymentSlug(pm.name),
    }));
}

/**
 * Get GEO pages relevant to a casino.
 * Only returns GEOs where the casino is verified as available.
 */
export function getRelevantGeoLinks(
  countries: string[]
): Array<{ code: string; name: string; flag: string }> {
  const countrySet = new Set(countries.map((c) => c.toUpperCase()));
  return PUBLIC_GEOS.filter((geo) => countrySet.has(geo.code.toUpperCase()));
}

/**
 * Get guide links relevant to a casino based on its attributes.
 */
export function getRelevantGuideLinks(
  casino: {
    paymentMethods: Array<{ name: string }>;
    bonuses: Array<{ type: string }>;
    licenses: Array<{ issuer: string }>;
  },
  maxLinks: number = MAX_RELATED_GUIDES
): Array<{ title: string; slug: string }> {
  const guides: Array<{ title: string; slug: string; priority: number }> = [];

  // Always relevant
  guides.push({ title: "Online Casino Basics", slug: "online-casino-basics", priority: 1 });
  guides.push({ title: "Responsible Gambling Tips", slug: "responsible-gambling-tips", priority: 1 });

  // Context-dependent
  if (casino.paymentMethods.length > 0) {
    guides.push({ title: "European Payment Methods Guide", slug: "payment-methods-guide", priority: 2 });
  }
  if (casino.bonuses.length > 0) {
    guides.push({ title: "Casino Bonuses Explained", slug: "casino-bonuses-explained", priority: 2 });
    guides.push({ title: "Understanding Wagering Requirements", slug: "understanding-wagering-requirements", priority: 1 });
  }
  if (casino.licenses.length > 0) {
    guides.push({ title: "Casino Licensing Guide", slug: "casino-licensing-guide", priority: 2 });
  }

  return guides
    .sort((a, b) => b.priority - a.priority || a.slug.localeCompare(b.slug))
    .slice(0, maxLinks)
    .map(({ title, slug }) => ({ title, slug }));
}

// ─── Link Explosion Prevention ────────────────────────────────────────────

/**
 * Truncate links to max count, maintaining determinism.
 */
export function limitLinks<T>(
  links: T[],
  max: number = MAX_LINKS_PER_SECTION
): T[] {
  return links.slice(0, max);
}

// ─── Helpers ──────────────────────────────────────────────────────────────

/**
 * Convert payment method name to URL-safe slug.
 * Deterministic: "SOFORT/Klarna" → "sofort-klarna"
 */
export function paymentSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Get all public route paths (for orphan detection).
 */
export function getPublicRoutePaths(): string[] {
  return PUBLIC_ROUTES.filter((r) => r.public).map((r) => r.path);
}
