import { casinoDb } from "@/lib/data/accessor";
import { getAllGuides } from "@/lib/data/guides";
import type { Casino } from "@/lib/types";

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
  eligible: boolean;
  reasons: string[];
  casinoCoverage: number;
  geoCoverage: number;
  dataCompleteness: number;
};

// ─── Alias / Normalization Rules ───────────────────────────────────────────

const PAYMENT_ALIASES: Record<string, string> = {
  "Aircash": "AirCash",
};

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

export function buildPaymentEntityMap(casinos?: Casino[]): Map<string, PaymentEntity> {
  const casinoList = casinos ?? casinoDb.getAllCasinos();
  const entityMap = new Map<string, PaymentEntity>();

  for (const casino of casinoList) {
    for (const pm of casino.paymentMethods) {
      const resolved = resolvePaymentAlias(pm.name);
      const existing = entityMap.get(resolved);

      if (existing) {
        existing.totalRecords++;
        if (!existing.geos.some((g) => casino.countries.includes(g))) {
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
          casinoCount: 0,
          geoCount: casino.countries.length,
          geos: [...casino.countries],
          totalRecords: 1,
          hasDeposits: pm.minDeposit !== undefined || pm.maxDeposit !== undefined,
          hasWithdrawals: pm.minWithdrawal !== undefined || pm.maxWithdrawal !== undefined,
        });
      }
    }
  }

  // Recount casino counts properly
  for (const [, entity] of entityMap) {
    const casinoSlugs = new Set<string>();
    for (const casino of casinoList) {
      const hasMethod = casino.paymentMethods.some(
        (pm) => resolvePaymentAlias(pm.name) === entity.canonicalName
      );
      if (hasMethod) casinoSlugs.add(casino.slug);
    }
    entity.casinoCount = casinoSlugs.size;

    const geoSet = new Set<string>();
    for (const casino of casinoList) {
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
  countries: string[];
};

export function getPaymentToCasinos(
  entityMap: Map<string, PaymentEntity>,
  canonicalName: string,
  casinos?: Casino[]
): PaymentToCasinoEntry[] {
  const casinoList = casinos ?? casinoDb.getAllCasinos();
  const result: PaymentToCasinoEntry[] = [];

  for (const casino of casinoList) {
    const hasMethod = casino.paymentMethods.some(
      (pm) => resolvePaymentAlias(pm.name) === canonicalName
    );
    if (hasMethod) {
      result.push({
        slug: casino.slug,
        name: casino.name,
        tagline: casino.tagline,
        rating: casino.rating,
        countries: casino.countries,
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
  geoCode: string,
  casinos?: Casino[]
): GeoToPaymentsEntry[] {
  const geoUpper = geoCode.toUpperCase();
  const casinoList = casinos ?? casinoDb.getAllCasinos();
  const methodCasinos = new Map<string, Set<string>>();

  for (const casino of casinoList) {
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
  entries.sort((a, b) => b.casinoCount - a.casinoCount || a.canonicalName.localeCompare(b.canonicalName));

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

export function getPaymentToGuides(entityType: PaymentEntityType): PaymentToGuideEntry[] {
  const allGuides = getAllGuides();
  const relevantSlugs = PAYMENT_GUIDE_RELEVANCE[entityType] ?? ["payment-methods-guide"];

  return allGuides
    .filter((g) => relevantSlugs.includes(g.slug))
    .map((g) => ({
      slug: g.slug,
      title: g.title,
      description: g.description,
    }));
}

// ─── Eligibility System ───────────────────────────────────────────────────

const ELIGIBILITY_THRESHOLDS = {
  MIN_CASINOS: 10,
  MIN_GEOS: 2,
};

export type EligibilityResult = {
  eligible: boolean;
  reasons: string[];
};

export function assessPageEligibility(entity: PaymentEntity): EligibilityResult {
  const reasons: string[] = [];

  if (entity.casinoCount < ELIGIBILITY_THRESHOLDS.MIN_CASINOS) {
    reasons.push(`Insufficient casino coverage: ${entity.casinoCount} (need ${ELIGIBILITY_THRESHOLDS.MIN_CASINOS}+)`);
  }
  if (entity.geoCount < ELIGIBILITY_THRESHOLDS.MIN_GEOS) {
    reasons.push(`Insufficient GEO coverage: ${entity.geoCount} (need ${ELIGIBILITY_THRESHOLDS.MIN_GEOS}+)`);
  }
  if (entity.aliases.length > 0 && entity.casinoCount <= 1) {
    reasons.push("Entity is an alias with insufficient independent coverage");
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}

// ─── Tier Classification (retained for backward compat) ───────────────────

export type TierClassification = {
  tier: PaymentTier;
  entities: PaymentEligibility[];
};

export function classifyAllEntities(entityMap: Map<string, PaymentEntity>): TierClassification[] {
  const eligibility = [...entityMap.values()].map((entity): PaymentEligibility => {
    const reasons: string[] = [];
    let tier: PaymentTier;
    let completeness = 0;
    if (entity.hasDeposits) completeness += 0.5;
    if (entity.hasWithdrawals) completeness += 0.5;

    if (entity.aliases.length > 0 && entity.casinoCount <= 1) {
      tier = "D";
      reasons.push("Alias with limited coverage");
    } else if (entity.casinoCount >= ELIGIBILITY_THRESHOLDS.MIN_CASINOS && entity.geoCount >= ELIGIBILITY_THRESHOLDS.MIN_GEOS) {
      tier = "A";
      reasons.push(`${entity.casinoCount} casinos, ${entity.geoCount} GEOs`);
    } else if (entity.casinoCount >= 5 && entity.geoCount >= 1) {
      tier = "B";
      reasons.push(`${entity.casinoCount} casinos, ${entity.geoCount} GEO(s)`);
    } else {
      tier = "C";
      reasons.push(`${entity.casinoCount} casinos — insufficient coverage`);
    }

    const eligible = tier === "A";

    return { entity, tier, eligible, reasons, casinoCoverage: entity.casinoCount, geoCoverage: entity.geoCount, dataCompleteness: completeness };
  });

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

export function getPaymentEntityStats(entityMap: Map<string, PaymentEntity>, casinos?: Casino[]): PaymentEntityStats {
  const tiers = classifyAllEntities(entityMap);
  const aliasesFound: string[] = [];
  const caseInconsistencies: string[] = [];

  for (const [, entity] of entityMap) {
    if (entity.aliases.length > 0) {
      aliasesFound.push(`${entity.canonicalName} <- ${entity.aliases.join(", ")}`);
    }
  }

  const casinoList = casinos ?? casinoDb.getAllCasinos();
  const rawNames = new Set<string>();
  for (const c of casinoList) {
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

// ─── Get Eligible Payment Pages ───────────────────────────────────────────

export function getEligiblePaymentSlugs(entityMap: Map<string, PaymentEntity>): string[] {
  const eligible: string[] = [];
  for (const [, entity] of entityMap) {
    const result = assessPageEligibility(entity);
    if (result.eligible) {
      eligible.push(entity.slug);
    }
  }
  return eligible.sort();
}
