/**
 * Comparison Engine — Data Model and Logic
 *
 * Deterministic, transparent, data-driven comparison of casino entities.
 * No affiliate payout, no B2B tier, no commercial ranking.
 */

import type { Casino } from "@/lib/types";

// ─── Comparison Constants ─────────────────────────────────────────────────

export const MAX_COMPARECasinos = 5;
export const DEFAULT_COMPARE_COUNT = 3;

// ─── Comparison View Model ────────────────────────────────────────────────

/**
 * Normalized comparison view model.
 * Only exposes fields supported by actual data.
 */
export interface ComparisonCasino {
  id: string;
  slug: string;
  name: string;
  logo: string | null;
  tagline: string | null;

  // Ratings (separate, never combined)
  editorialScore: number | null;
  playerRating: number | null;
  playerReviewCount: number;

  // Trust
  verificationStatus: string;
  lastVerifiedAt: string;
  operator: string | null;
  primaryLicense: { issuer: string; jurisdiction: string; status?: string } | null;

  // Financial
  minDeposit: number | null;
  maxDeposit: number | null;
  minWithdrawal: number | null;
  withdrawalProcessingTime: string | null;

  // Features
  hasLiveCasino: boolean;
  hasSportsBetting: boolean;
  hasCrypto: boolean;
  hasMobile: boolean;
  kycRequired: boolean;
  minAge: number;

  // Data
  paymentMethodNames: string[];
  withdrawalMethodNames: string[];
  gameCategories: string[];
  supportedGeos: string[];
  languages: string[];
  currencies: string[];

  // Bonuses (first bonus if exists)
  primaryBonus: {
    type: string;
    title: string;
    amount?: string;
    wageringRequirement?: string;
    minDeposit?: number;
  } | null;

  // Responsible Gambling
  responsibleGambling: {
    selfExclusion: boolean;
    depositLimits: boolean;
    sessionLimits: boolean;
    realityCheck: boolean;
    coolingOffPeriod: boolean;
  };

  // Affiliate (for CTA only, never for ranking)
  affiliateOffers: Casino["affiliateOffers"];
}

// ─── Comparison Categories ────────────────────────────────────────────────

export interface ComparisonCategory {
  id: string;
  label: string;
  fields: ComparisonField[];
}

export interface ComparisonField {
  id: string;
  label: string;
  getValue: (casino: ComparisonCasino) => string | number | boolean | null;
  format?: (value: string | number | boolean | null) => string;
}

// ─── Sorting ──────────────────────────────────────────────────────────────

export type SortField =
  | "editorialScore"
  | "playerRating"
  | "minDeposit"
  | "verificationStatus"
  | "name";

export type SortDirection = "asc" | "desc";

export interface SortOption {
  field: SortField;
  direction: SortDirection;
  label: string;
}

// ─── Difference Highlight ─────────────────────────────────────────────────

export interface DifferenceHighlight {
  field: string;
  label: string;
  values: Array<{ casinoId: string; casinoName: string; value: string }>;
  type: "lower" | "higher" | "different" | "unique";
}

// ─── Comparison Result ────────────────────────────────────────────────────

export interface ComparisonResult {
  casinos: ComparisonCasino[];
  categories: ComparisonCategory[];
  differences: DifferenceHighlight[];
  sorting: SortOption[];
  metadata: {
    count: number;
    maxAllowed: number;
    hasValidData: boolean;
  };
}

// ─── Data Transformation ──────────────────────────────────────────────────

/**
 * Transform a Casino into a ComparisonCasino view model.
 */
export function toComparisonCasino(
  casino: Casino,
  playerRating?: { average: number | null; count: number } | null
): ComparisonCasino {
  return {
    id: casino.id,
    slug: casino.slug,
    name: casino.name,
    logo: casino.logo ?? null,
    tagline: casino.tagline ?? null,

    editorialScore: casino.rating,
    playerRating: playerRating?.average ?? null,
    playerReviewCount: playerRating?.count ?? 0,

    verificationStatus: casino.verificationStatus,
    lastVerifiedAt: casino.lastVerifiedAt,
    operator: casino.owner ?? null,
    primaryLicense: casino.licenses[0] ?? null,

    minDeposit: casino.minDeposit,
    maxDeposit: casino.maxDeposit ?? null,
    minWithdrawal: casino.minWithdrawal ?? null,
    withdrawalProcessingTime: casino.withdrawalProcessingTime ?? null,

    hasLiveCasino: casino.hasLiveCasino,
    hasSportsBetting: casino.hasSportsBetting,
    hasCrypto: casino.hasCrypto,
    hasMobile: casino.hasMobile,
    kycRequired: casino.kycRequired,
    minAge: casino.minAge,

    paymentMethodNames: casino.paymentMethods.map((pm) => pm.name),
    withdrawalMethodNames: casino.withdrawalMethods ?? [],
    gameCategories: casino.games.filter((g) => g.available).map((g) => g.name),
    supportedGeos: casino.countries,
    languages: casino.languages,
    currencies: casino.currencies,

    primaryBonus: casino.bonuses[0] ?? null,

    responsibleGambling: casino.responsibleGambling,

    affiliateOffers: casino.affiliateOffers,
  };
}

// ─── Comparison Categories Definition ─────────────────────────────────────

export const COMPARISON_CATEGORIES: ComparisonCategory[] = [
  {
    id: "overall",
    label: "Overall",
    fields: [
      {
        id: "editorialScore",
        label: "Editorial Score",
        getValue: (c) => c.editorialScore,
        format: (v) => (v != null ? `${v}/100` : "N/A"),
      },
      {
        id: "playerRating",
        label: "Player Rating",
        getValue: (c) => c.playerRating,
        format: (v) => (v != null ? `${v}/5` : "No reviews yet"),
      },
      {
        id: "verificationStatus",
        label: "Verification",
        getValue: (c) => c.verificationStatus,
        format: (v) => (v as string).replace("_", " "),
      },
    ],
  },
  {
    id: "trust",
    label: "Trust & Licensing",
    fields: [
      {
        id: "operator",
        label: "Operator",
        getValue: (c) => c.operator,
        format: (v) => (v as string) ?? "Not specified",
      },
      {
        id: "primaryLicense",
        label: "License",
        getValue: (c) => c.primaryLicense?.issuer ?? null,
        format: (v) => (v as string) ?? "Not verified",
      },
      {
        id: "lastVerifiedAt",
        label: "Last Verified",
        getValue: (c) => c.lastVerifiedAt,
        format: (v) => {
          if (!v) return "Never";
          const date = new Date(v as string);
          return date.toLocaleDateString("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        },
      },
    ],
  },
  {
    id: "bonuses",
    label: "Bonuses",
    fields: [
      {
        id: "bonusType",
        label: "Bonus Type",
        getValue: (c) => c.primaryBonus?.type ?? null,
        format: (v) => (v as string) ?? "Not verified",
      },
      {
        id: "bonusAmount",
        label: "Bonus Amount",
        getValue: (c) => c.primaryBonus?.amount ?? null,
        format: (v) => (v as string) ?? "Not verified",
      },
      {
        id: "wageringRequirement",
        label: "Wagering",
        getValue: (c) => c.primaryBonus?.wageringRequirement ?? null,
        format: (v) => (v as string) ?? "Not verified",
      },
      {
        id: "minDepositForBonus",
        label: "Min Deposit for Bonus",
        getValue: (c) => c.primaryBonus?.minDeposit ?? null,
        format: (v) => (v != null ? `€${v}` : "Not verified"),
      },
    ],
  },
  {
    id: "payments",
    label: "Payments",
    fields: [
      {
        id: "minDeposit",
        label: "Minimum Deposit",
        getValue: (c) => c.minDeposit,
        format: (v) => (v != null ? `€${v}` : "N/A"),
      },
      {
        id: "maxDeposit",
        label: "Maximum Deposit",
        getValue: (c) => c.maxDeposit,
        format: (v) => (v != null ? `€${(v as number).toLocaleString()}` : "N/A"),
      },
      {
        id: "minWithdrawal",
        label: "Minimum Withdrawal",
        getValue: (c) => c.minWithdrawal,
        format: (v) => (v != null ? `€${v}` : "N/A"),
      },
      {
        id: "withdrawalProcessingTime",
        label: "Withdrawal Speed",
        getValue: (c) => c.withdrawalProcessingTime,
        format: (v) => (v as string) ?? "N/A",
      },
      {
        id: "paymentMethods",
        label: "Deposit Methods",
        getValue: (c) => c.paymentMethodNames.length,
        format: (v) => `${v} methods`,
      },
    ],
  },
  {
    id: "games",
    label: "Games",
    fields: [
      {
        id: "gameCategories",
        label: "Game Categories",
        getValue: (c) => c.gameCategories.length,
        format: (v) => `${v} categories`,
      },
      {
        id: "hasLiveCasino",
        label: "Live Casino",
        getValue: (c) => c.hasLiveCasino,
        format: (v) => (v ? "Yes" : "No"),
      },
      {
        id: "hasSportsBetting",
        label: "Sports Betting",
        getValue: (c) => c.hasSportsBetting,
        format: (v) => (v ? "Yes" : "No"),
      },
    ],
  },
  {
    id: "features",
    label: "Features",
    fields: [
      {
        id: "hasCrypto",
        label: "Crypto",
        getValue: (c) => c.hasCrypto,
        format: (v) => (v ? "Yes" : "No"),
      },
      {
        id: "hasMobile",
        label: "Mobile",
        getValue: (c) => c.hasMobile,
        format: (v) => (v ? "Yes" : "No"),
      },
      {
        id: "kycRequired",
        label: "KYC Required",
        getValue: (c) => c.kycRequired,
        format: (v) => (v ? "Yes" : "No"),
      },
      {
        id: "minAge",
        label: "Minimum Age",
        getValue: (c) => c.minAge,
        format: (v) => `${v}+`,
      },
    ],
  },
  {
    id: "geo",
    label: "GEO Availability",
    fields: [
      {
        id: "supportedGeos",
        label: "Supported Countries",
        getValue: (c) => c.supportedGeos.join(", "),
        format: (v) => (v as string) || "None listed",
      },
      {
        id: "languages",
        label: "Languages",
        getValue: (c) => c.languages.join(", "),
        format: (v) => (v as string) || "None listed",
      },
    ],
  },
  {
    id: "responsibleGambling",
    label: "Responsible Gambling",
    fields: [
      {
        id: "selfExclusion",
        label: "Self-Exclusion",
        getValue: (c) => c.responsibleGambling.selfExclusion,
        format: (v) => (v ? "Yes" : "No"),
      },
      {
        id: "depositLimits",
        label: "Deposit Limits",
        getValue: (c) => c.responsibleGambling.depositLimits,
        format: (v) => (v ? "Yes" : "No"),
      },
      {
        id: "realityCheck",
        label: "Reality Check",
        getValue: (c) => c.responsibleGambling.realityCheck,
        format: (v) => (v ? "Yes" : "No"),
      },
      {
        id: "coolingOffPeriod",
        label: "Cooling-Off Period",
        getValue: (c) => c.responsibleGambling.coolingOffPeriod,
        format: (v) => (v ? "Yes" : "No"),
      },
    ],
  },
];

// ─── Sorting Logic ────────────────────────────────────────────────────────

const VERIFICATION_ORDER: Record<string, number> = {
  verified: 0,
  needs_review: 1,
  draft: 2,
  demo: 3,
  archived: 4,
};

/**
 * Sort casinos by a given field and direction.
 * Deterministic: identical input always produces identical output.
 */
export function sortCasinos(
  casinos: ComparisonCasino[],
  field: SortField,
  direction: SortDirection
): ComparisonCasino[] {
  return [...casinos].sort((a, b) => {
    let comparison = 0;

    switch (field) {
      case "editorialScore":
        comparison = (a.editorialScore ?? -1) - (b.editorialScore ?? -1);
        break;
      case "playerRating":
        comparison = (a.playerRating ?? -1) - (b.playerRating ?? -1);
        break;
      case "minDeposit":
        comparison = (a.minDeposit ?? Infinity) - (b.minDeposit ?? Infinity);
        break;
      case "verificationStatus":
        comparison =
          (VERIFICATION_ORDER[a.verificationStatus] ?? 5) -
          (VERIFICATION_ORDER[b.verificationStatus] ?? 5);
        break;
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
    }

    return direction === "desc" ? -comparison : comparison;
  });
}

// ─── Difference Detection ─────────────────────────────────────────────────

/**
 * Detect key factual differences between casinos.
 * Only highlights real, meaningful differences.
 */
export function detectDifferences(
  casinos: ComparisonCasino[]
): DifferenceHighlight[] {
  if (casinos.length < 2) return [];

  const differences: DifferenceHighlight[] = [];

  // Min Deposit difference
  const deposits = casinos
    .map((c) => ({ id: c.id, name: c.name, value: c.minDeposit }))
    .filter((d) => d.value !== null);
  if (deposits.length >= 2) {
    const min = deposits.reduce((a, b) => (a.value! < b.value! ? a : b));
    const max = deposits.reduce((a, b) => (a.value! > b.value! ? a : b));
    if (min.value !== max.value) {
      differences.push({
        field: "minDeposit",
        label: "Minimum Deposit",
        values: [
          { casinoId: min.id, casinoName: min.name, value: `Lowest: €${min.value}` },
          { casinoId: max.id, casinoName: max.name, value: `Highest: €${max.value}` },
        ],
        type: "lower",
      });
    }
  }

  // Payment methods count difference
  const paymentCounts = casinos.map((c) => ({
    id: c.id,
    name: c.name,
    value: c.paymentMethodNames.length,
  }));
  const maxPayments = paymentCounts.reduce((a, b) => (a.value > b.value ? a : b));
  const minPayments = paymentCounts.reduce((a, b) => (a.value < b.value ? a : b));
  if (maxPayments.value > minPayments.value + 1) {
    differences.push({
      field: "paymentMethods",
      label: "Payment Methods",
      values: [
        { casinoId: maxPayments.id, casinoName: maxPayments.name, value: `Most: ${maxPayments.value} methods` },
        { casinoId: minPayments.id, casinoName: minPayments.name, value: `Fewest: ${minPayments.value} methods` },
      ],
      type: "higher",
    });
  }

  // GEO availability difference
  const geoCounts = casinos.map((c) => ({
    id: c.id,
    name: c.name,
    value: c.supportedGeos.length,
  }));
  const maxGeo = geoCounts.reduce((a, b) => (a.value > b.value ? a : b));
  const minGeo = geoCounts.reduce((a, b) => (a.value < b.value ? a : b));
  if (maxGeo.value > minGeo.value) {
    differences.push({
      field: "supportedGeos",
      label: "GEO Availability",
      values: [
        { casinoId: maxGeo.id, casinoName: maxGeo.name, value: `Most: ${maxGeo.value} countries` },
        { casinoId: minGeo.id, casinoName: minGeo.name, value: `Fewest: ${minGeo.value} countries` },
      ],
      type: "higher",
    });
  }

  // License difference
  const licenses = casinos.map((c) => ({
    id: c.id,
    name: c.name,
    value: c.primaryLicense?.issuer ?? "None",
  }));
  const uniqueLicenses = new Set(licenses.map((l) => l.value));
  if (uniqueLicenses.size > 1) {
    differences.push({
      field: "license",
      label: "License",
      values: licenses.map((l) => ({
        casinoId: l.id,
        casinoName: l.name,
        value: l.value,
      })),
      type: "different",
    });
  }

  // Responsible Gambling difference
  const rgFeatures = ["selfExclusion", "depositLimits", "realityCheck", "coolingOffPeriod"] as const;
  for (const feature of rgFeatures) {
    const values = casinos.map((c) => ({
      id: c.id,
      name: c.name,
      value: c.responsibleGambling[feature],
    }));
    const hasFeature = values.filter((v) => v.value);
    const missingFeature = values.filter((v) => !v.value);
    if (hasFeature.length > 0 && missingFeature.length > 0) {
      differences.push({
        field: feature,
        label: feature.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
        values: [
          ...hasFeature.map((v) => ({ casinoId: v.id, casinoName: v.name, value: "Available" })),
          ...missingFeature.map((v) => ({ casinoId: v.id, casinoName: v.name, value: "Not available" })),
        ],
        type: "different",
      });
    }
  }

  return differences;
}

// ─── Payment Overlap ──────────────────────────────────────────────────────

/**
 * Calculate payment method overlap between casinos.
 */
export function calculatePaymentOverlap(
  casinos: ComparisonCasino[]
): { common: string[]; unique: Array<{ casinoId: string; casinoName: string; methods: string[] }> } {
  if (casinos.length === 0) return { common: [], unique: [] };

  // Find common payment methods (present in ALL casinos)
  const allMethodSets = casinos.map((c) => new Set(c.paymentMethodNames));
  const common = casinos[0].paymentMethodNames.filter((method) =>
    allMethodSets.every((set) => set.has(method))
  );

  // Find unique methods per casino
  const unique = casinos.map((c) => ({
    casinoId: c.id,
    casinoName: c.name,
    methods: c.paymentMethodNames.filter(
      (method) => !common.includes(method)
    ),
  }));

  return { common, unique };
}

// ─── Validation ───────────────────────────────────────────────────────────

/**
 * Validate and parse comparison slugs from query string.
 * Returns valid, deduplicated slugs within the limit.
 */
export function validateComparisonSlugs(
  slugsInput: string | undefined,
  allSlugs: string[]
): string[] {
  if (!slugsInput) return [];

  const allSlugsSet = new Set(allSlugs);
  const seen = new Set<string>();
  const valid: string[] = [];

  for (const slug of slugsInput.split(",")) {
    const trimmed = slug.trim().toLowerCase();
    if (trimmed && allSlugsSet.has(trimmed) && !seen.has(trimmed)) {
      seen.add(trimmed);
      valid.push(trimmed);
    }
    if (valid.length >= MAX_COMPARECasinos) break;
  }

  return valid;
}

/**
 * Build canonical comparison URL.
 */
export function buildComparisonUrl(slugs: string[]): string {
  const sorted = [...slugs].sort();
  return `/compare?casinos=${sorted.join(",")}`;
}

// ─── GEO Pre-Selection ──────────────────────────────────────────────────

/**
 * Select casinos for GEO comparison pre-selection.
 *
 * Algorithm:
 * 1. Filter to verified/active casinos available in the given GEO
 * 2. Sort by minDeposit ASC (lower deposit = more accessible for users)
 * 3. Tie-break by slug ASC (stable, deterministic alphabetical order)
 * 4. Deduplicate by slug (same casino should not appear twice)
 * 5. Return top MAX_COMPARECasinos (5) or fewer
 *
 * Selection is purely data-driven. No affiliate payout, no B2B tier,
 * no commercial placement, no paid placement, no editorial manipulation.
 */
export function selectCasinosForGeoComparison(
  geoCode: string,
  allCasinos: Casino[]
): string[] {
  const geoUpper = geoCode.toUpperCase();

  const eligible = allCasinos.filter(
    (c) =>
      c.status === "active" &&
      c.verificationStatus === "verified" &&
      c.countries.includes(geoUpper)
  );

  if (eligible.length === 0) return [];

  const sorted = eligible.sort((a, b) => {
    // Primary: minDeposit ASC (lower is better for users)
    const depositA = a.minDeposit ?? Infinity;
    const depositB = b.minDeposit ?? Infinity;
    if (depositA !== depositB) return depositA - depositB;

    // Tie-breaker: slug ASC (stable, deterministic)
    return a.slug.localeCompare(b.slug);
  });

  // Deduplicate by slug (same casino should not appear twice)
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const c of sorted) {
    if (!seen.has(c.slug)) {
      seen.add(c.slug);
      unique.push(c.slug);
    }
    if (unique.length >= MAX_COMPARECasinos) break;
  }

  return unique;
}
