import { casinoDb } from "@/lib/data/accessor";
import { getAllGuides } from "@/lib/data/guides";

// ─── Canonical Payment Entity Model ────────────────────────────────────────

export type PaymentEntityType = "e-wallet" | "card" | "bank-transfer" | "crypto" | "prepaid" | "mobile";

export type PaymentEntity = {
  canonicalName: string;
  slug: string;
  type: PaymentEntityType;
  aliases: string[];
  casinoCount: number;
  geoCount: number;
  geos: string[];
  totalRecords: number;
  hasDeposits: boolean;
  hasWithdrawals: boolean;
};

export type PaymentTier = "A" | "B" | "C" | "D";

export type PaymentEligibility = {
  entity: PaymentEntity;
  tier: PaymentTier;
  reasons: string[];
  casinoCoverage: number;
  geoCoverage: number;
  dataCompleteness: number;
};

// ─── Alias / Normalization Rules ───────────────────────────────────────────
// Only aliases where identity equivalence is supported by project data.

const PAYMENT_ALIASES: Record<string, string> = {
  // Case inconsistency in verified data
  "Aircash": "AirCash",
  // Dutch-language name for card payments
  "Creditcard": "Creditcard", // Keep as separate entity — distinct from Visa/Mastercard in NL market
};

// Names that should NOT be merged even if similar
const EXPLICITLY_DISTINCT: Set<string> = new Set([
  "Sofort",   // Klarna subsidiary, but used as distinct brand in DE
  "Klarna",   // Parent brand, distinct from Sofort
  "Giropay",  // German bank transfer, distinct from general bank transfer
  "Brite",    // Nordic instant banking
  "Tink",     // Baltic/Finnish open banking
  "Wero",     // European payment initiative
]);

// ─── Slug Generation ──────────────────────────────────────────────────────

export function paymentSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ─── Resolve Alias ────────────────────────────────────────────────────────

export function resolvePaymentAlias(name: string): string {
  return PAYMENT_ALIASES[name] ?? name;
}

// ─── Build Entity Map ─────────────────────────────────────────────────────

export function buildPaymentEntityMap(): Map<string, PaymentEntity> {
  const casinos = casinoDb.getAllCasinos();
  const entityMap = new Map<string, PaymentEntity>();

  for (const casino of casinos) {
    for (const pm of casino.paymentMethods) {
      const resolved = resolvePaymentAlias(pm.name);
      const existing = entityMap.get(resolved);

      if (existing) {
        existing.casinoCount = new Set([
          ...Array.from({ length: existing.casinoCount }, (_, i) => `casino-${i}`),
          casino.slug,
        ]).size;
        existing.totalRecords++;
        if (casino.countries.length > 0) {
          for (const g of casino.countries) {
            if (!existing.geos.includes(g)) existing.geos.push(g);
          }
          existing.geoCount = existing.geos.length;
        }
        if (pm.minDeposit !== undefined || pm.maxDeposit !== undefined) {
          existing.hasDeposits = true;
        }
        if (pm.minWithdrawal !== undefined || pm.maxWithdrawal !== undefined) {
          existing.hasWithdrawals = true;
        }
      } else {
        entityMap.set(resolved, {
          canonicalName: resolved,
          slug: paymentSlug(resolved),
          type: pm.type as PaymentEntityType,
          aliases: resolved !== pm.name ? [pm.name] : [],
          casinoCount: 1,
          geoCount: casino.countries.length,
          geos: [...casino.countries],
          totalRecords: 1,
          hasDeposits: pm.minDeposit !== undefined || pm.maxDeposit !== undefined,
          hasWithdrawals: pm.minWithdrawal !== undefined || pm.maxWithdrawal !== undefined,
        });
      }
    }
  }

  // Recount casino counts properly using slug sets
  for (const [, entity] of entityMap) {
    const casinoSlugs = new Set<string>();
    for (const casino of casinos) {
      const hasMethod = casino.paymentMethods.some(
        (pm) => resolvePaymentAlias(pm.name) === entity.canonicalName
      );
      if (hasMethod) casinoSlugs.add(casino.slug);
    }
    entity.casinoCount = casinoSlugs.size;

    // Recount GEOs
    const geoSet = new Set<string>();
    for (const casino of casinos) {
      const hasMethod = casino.paymentMethods.some(
        (pm) => resolvePaymentAlias(pm.name) === entity.canonicalName
      );
      if (hasMethod) {
        for (const g of casino.countries) geoSet.add(g);
      }
    }
    entity.geos = [...geoSet].sort();
    entity.geoCount = entity.geos.length;
  }

  return entityMap;
}

// ─── Payment → Casino Graph ───────────────────────────────────────────────

export type PaymentToCasinoEntry = {
  slug: string;
  name: string;
  tagline: string | undefined;
  rating: number | null;
};

export function getPaymentToCasinos(
  entityMap: Map<string, PaymentEntity>,
  canonicalName: string
): PaymentToCasinoEntry[] {
  const casinos = casinoDb.getAllCasinos();
  const result: PaymentToCasinoEntry[] = [];

  for (const casino of casinos) {
    const hasMethod = casino.paymentMethods.some(
      (pm) => resolvePaymentAlias(pm.name) === canonicalName
    );
    if (hasMethod) {
      result.push({
        slug: casino.slug,
        name: casino.name,
        tagline: casino.tagline,
        rating: casino.rating,
      });
    }
  }

  return result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
}

// ─── Casino → Payment Graph ───────────────────────────────────────────────

export type CasinoToPaymentsEntry = {
  canonicalName: string;
  slug: string;
  type: PaymentEntityType;
};

export function getCasinoToPayments(
  entityMap: Map<string, PaymentEntity>,
  casinoSlug: string
): CasinoToPaymentsEntry[] {
  const casino = casinoDb.getCasinoBySlug(casinoSlug);
  if (!casino) return [];

  const seen = new Set<string>();
  const result: CasinoToPaymentsEntry[] = [];

  for (const pm of casino.paymentMethods) {
    const resolved = resolvePaymentAlias(pm.name);
    if (!seen.has(resolved)) {
      seen.add(resolved);
      const entity = entityMap.get(resolved);
      result.push({
        canonicalName: resolved,
        slug: entity?.slug ?? paymentSlug(resolved),
        type: (entity?.type ?? pm.type) as PaymentEntityType,
      });
    }
  }

  return result;
}

// ─── GEO → Payment Graph ──────────────────────────────────────────────────

export type GeoToPaymentsEntry = {
  canonicalName: string;
  slug: string;
  type: PaymentEntityType;
  casinoCount: number;
};

export function getGeoToPayments(
  entityMap: Map<string, PaymentEntity>,
  geoCode: string
): GeoToPaymentsEntry[] {
  const geoUpper = geoCode.toUpperCase();
  const casinos = casinoDb.getAllCasinos();
  const methodCasinos = new Map<string, Set<string>>();

  for (const casino of casinos) {
    if (!casino.countries.includes(geoUpper)) continue;
    for (const pm of casino.paymentMethods) {
      const resolved = resolvePaymentAlias(pm.name);
      if (!methodCasinos.has(resolved)) methodCasinos.set(resolved, new Set());
      methodCasinos.get(resolved)!.add(casino.slug);
    }
  }

  const result: GeoToPaymentsEntry[] = [];
  for (const [name, slugs] of methodCasinos) {
    const entity = entityMap.get(name);
    result.push({
      canonicalName: name,
      slug: entity?.slug ?? paymentSlug(name),
      type: (entity?.type ?? "e-wallet") as PaymentEntityType,
      casinoCount: slugs.size,
    });
  }

  return result.sort((a, b) => b.casinoCount - a.casinoCount);
}

// ─── Guide → Payment Graph ────────────────────────────────────────────────
// Determines which payment methods are relevant to each guide.

const GUIDE_PAYMENT_RELEVANCE: Record<string, string[]> = {
  "payment-methods-guide": [], // All payment methods are relevant
  "online-casino-basics": [], // General — top methods only
  "casino-bonuses-explained": [], // Top e-wallets and cards (common bonus exclusion methods)
  "responsible-gambling-tips": [], // Deposit-related methods
  "understanding-wagering-requirements": [], // Top methods
  "casino-licensing-guide": [], // All methods (license affects payment availability)
};

export type GuideToPaymentsEntry = {
  canonicalName: string;
  slug: string;
  type: PaymentEntityType;
};

export function getGuideToPayments(
  entityMap: Map<string, PaymentEntity>,
  guideSlug: string
): GuideToPaymentsEntry[] {
  const entries = [...entityMap.values()];

  // Sort by casino coverage (most covered first) — deterministic
  entries.sort((a, b) => b.casinoCount - a.casinoCount || a.canonicalName.localeCompare(b.canonicalName));

  // For payment-methods-guide: all entities
  // For others: top 5 most covered methods
  const limit = guideSlug === "payment-methods-guide" ? entries.length : 5;

  return entries.slice(0, limit).map((e) => ({
    canonicalName: e.canonicalName,
    slug: e.slug,
    type: e.type,
  }));
}

// ─── Payment → Guide Graph ────────────────────────────────────────────────

export type PaymentToGuideEntry = {
  slug: string;
  title: string;
  description: string;
};

const PAYMENT_GUIDE_RELEVANCE: Record<string, string[]> = {
  "e-wallet": ["payment-methods-guide", "online-casino-basics"],
  "card": ["payment-methods-guide", "online-casino-basics"],
  "bank-transfer": ["payment-methods-guide", "online-casino-basics"],
  "crypto": ["payment-methods-guide"],
  "prepaid": ["payment-methods-guide", "online-casino-basics"],
  "mobile": ["payment-methods-guide"],
};

export function getPaymentToGuides(
  entityType: PaymentEntityType
): PaymentToGuideEntry[] {
  const allGuides = getAllGuides();
  const relevantSlugs = PAYMENT_GUIDE_RELEVANCE[entityType] ?? ["payment-methods-guide"];

  return allGuides
    .filter((g: { slug: string }) => relevantSlugs.includes(g.slug))
    .map((g: { slug: string; title: string; description: string }) => ({
      slug: g.slug,
      title: g.title,
      description: g.description,
    }));
}

// ─── Eligibility System ───────────────────────────────────────────────────

const ELIGIBILITY_THRESHOLDS = {
  MIN_CASINOS_FOR_TIER_A: 10,
  MIN_GEOS_FOR_TIER_A: 2,
  MIN_CASINOS_FOR_TIER_B: 5,
  MIN_GEOS_FOR_TIER_B: 1,
  MIN_CASINOS_FOR_TIER_C: 2,
};

export function assessEligibility(entity: PaymentEntity): PaymentEligibility {
  const reasons: string[] = [];
  let tier: PaymentTier;

  // Data completeness score (0-1)
  let completeness = 0;
  if (entity.hasDeposits) completeness += 0.5;
  if (entity.hasWithdrawals) completeness += 0.5;

  // Tier D: aliases/duplicates (should resolve to canonical)
  if (entity.aliases.length > 0 && entity.casinoCount <= 1) {
    tier = "D";
    reasons.push("Entity is an alias with limited独立 coverage");
    return { entity, tier, reasons, casinoCoverage: entity.casinoCount, geoCoverage: entity.geoCount, dataCompleteness: completeness };
  }

  // Tier A: strong coverage (casino count + GEO coverage are primary signals)
  if (
    entity.casinoCount >= ELIGIBILITY_THRESHOLDS.MIN_CASINOS_FOR_TIER_A &&
    entity.geoCount >= ELIGIBILITY_THRESHOLDS.MIN_GEOS_FOR_TIER_A
  ) {
    tier = "A";
    reasons.push(`${entity.casinoCount} verified casinos (>= ${ELIGIBILITY_THRESHOLDS.MIN_CASINOS_FOR_TIER_A})`);
    reasons.push(`${entity.geoCount} GEOs (>= ${ELIGIBILITY_THRESHOLDS.MIN_GEOS_FOR_TIER_A})`);
    if (completeness > 0) reasons.push(`Data completeness: ${(completeness * 100).toFixed(0)}%`);
    return { entity, tier, reasons, casinoCoverage: entity.casinoCount, geoCoverage: entity.geoCount, dataCompleteness: completeness };
  }

  // Tier B: moderate coverage
  if (
    entity.casinoCount >= ELIGIBILITY_THRESHOLDS.MIN_CASINOS_FOR_TIER_B &&
    entity.geoCount >= ELIGIBILITY_THRESHOLDS.MIN_GEOS_FOR_TIER_B
  ) {
    tier = "B";
    reasons.push(`${entity.casinoCount} verified casinos (>= ${ELIGIBILITY_THRESHOLDS.MIN_CASINOS_FOR_TIER_B})`);
    reasons.push(`${entity.geoCount} GEO(s) (>= ${ELIGIBILITY_THRESHOLDS.MIN_GEOS_FOR_TIER_B})`);
    reasons.push("Not enough coverage for independent SEO page yet");
    return { entity, tier, reasons, casinoCoverage: entity.casinoCount, geoCoverage: entity.geoCount, dataCompleteness: completeness };
  }

  // Tier C: low coverage or needs review
  if (entity.casinoCount >= ELIGIBILITY_THRESHOLDS.MIN_CASINOS_FOR_TIER_C) {
    tier = "C";
    reasons.push(`${entity.casinoCount} verified casinos — needs more coverage for SEO page`);
  } else {
    tier = "C";
    reasons.push(`${entity.casinoCount} verified casinos — insufficient data for independent assessment`);
  }

  return { entity, tier, reasons, casinoCoverage: entity.casinoCount, geoCoverage: entity.geoCount, dataCompleteness: completeness };
}

// ─── Tier Classification ──────────────────────────────────────────────────

export type TierClassification = {
  tier: PaymentTier;
  entities: PaymentEligibility[];
};

export function classifyAllEntities(entityMap: Map<string, PaymentEntity>): TierClassification[] {
  const eligibility = [...entityMap.values()].map(assessEligibility);

  const tiers: TierClassification[] = [
    { tier: "A", entities: [] },
    { tier: "B", entities: [] },
    { tier: "C", entities: [] },
    { tier: "D", entities: [] },
  ];

  for (const e of eligibility) {
    const bucket = tiers.find((t) => t.tier === e.tier);
    bucket?.entities.push(e);
  }

  // Sort within each tier by casino coverage (desc), then name (asc)
  for (const tier of tiers) {
    tier.entities.sort((a, b) => b.casinoCoverage - a.casinoCoverage || a.entity.canonicalName.localeCompare(b.entity.canonicalName));
  }

  return tiers;
}

// ─── Summary Stats ────────────────────────────────────────────────────────

export type PaymentEntityStats = {
  totalRecords: number;
  uniqueEntities: number;
  aliasesFound: string[];
  caseInconsistencies: string[];
  tiers: Record<PaymentTier, number>;
};

export function getPaymentEntityStats(entityMap: Map<string, PaymentEntity>): PaymentEntityStats {
  const tiers = classifyAllEntities(entityMap);
  const aliasesFound: string[] = [];
  const caseInconsistencies: string[] = [];

  for (const [, entity] of entityMap) {
    if (entity.aliases.length > 0) {
      aliasesFound.push(`${entity.canonicalName} <- ${entity.aliases.join(", ")}`);
    }
  }

  // Detect case inconsistencies from raw data
  const casinos = casinoDb.getAllCasinos();
  const rawNames = new Set<string>();
  for (const c of casinos) {
    for (const pm of c.paymentMethods) rawNames.add(pm.name);
  }
  const lowerMap = new Map<string, string[]>();
  for (const name of rawNames) {
    const lower = name.toLowerCase();
    if (!lowerMap.has(lower)) lowerMap.set(lower, []);
    lowerMap.get(lower)!.push(name);
  }
  for (const [, variants] of lowerMap) {
    if (variants.length > 1) {
      caseInconsistencies.push(variants.join(" / "));
    }
  }

  return {
    totalRecords: [...entityMap.values()].reduce((sum, e) => sum + e.totalRecords, 0),
    uniqueEntities: entityMap.size,
    aliasesFound,
    caseInconsistencies,
    tiers: {
      A: tiers.find((t) => t.tier === "A")?.entities.length ?? 0,
      B: tiers.find((t) => t.tier === "B")?.entities.length ?? 0,
      C: tiers.find((t) => t.tier === "C")?.entities.length ?? 0,
      D: tiers.find((t) => t.tier === "D")?.entities.length ?? 0,
    },
  };
}
