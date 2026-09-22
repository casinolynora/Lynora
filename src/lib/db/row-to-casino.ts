/**
 * Shared utility to reconstruct a full Casino object from normalized DB rows.
 *
 * Used by both the SQLite provider and payment-data module to avoid duplication.
 * Must NEVER be imported by client components (depends on DB schema types).
 */
import { casinos, casinoLicenses, geoAvailability, casinoPaymentMethods, paymentMethods } from "./schema";
import type { Casino, License, PaymentMethod, VerificationStatus } from "@/lib/types";

type CasinoRow = typeof casinos.$inferSelect;
type LicenseRow = typeof casinoLicenses.$inferSelect;
type GeoRow = typeof geoAvailability.$inferSelect;
type PaymentLinkRow = typeof casinoPaymentMethods.$inferSelect & { pmName: string; pmType: string };

export function rowToCasino(
  row: CasinoRow,
  licenses: LicenseRow[],
  geo: GeoRow[],
  paymentLinks: PaymentLinkRow[],
): Casino {
  const countries = geo
    .filter((g) => g.status === "available")
    .map((g) => g.geo);
  const restrictedCountries = geo
    .filter((g) => g.status === "restricted")
    .map((g) => g.geo);

  const paymentMethodObjs: PaymentMethod[] = paymentLinks.map((pl) => ({
    name: pl.pmName,
    type: pl.pmType as PaymentMethod["type"],
    minDeposit: pl.minDeposit ?? undefined,
    maxDeposit: pl.maxDeposit ?? undefined,
    minWithdrawal: pl.minWithdrawal ?? undefined,
    maxWithdrawal: pl.maxWithdrawal ?? undefined,
    withdrawalTime: pl.withdrawalTime ?? undefined,
    fees: pl.fees ?? undefined,
  }));

  const licenseObjs: License[] = licenses.map((l) => ({
    issuer: l.issuer,
    jurisdiction: l.jurisdiction,
    licenseNumber: l.licenseNumber ?? undefined,
    url: l.url ?? undefined,
    status: (l.status as License["status"]) ?? undefined,
    verifiedAt: l.verifiedAt ?? undefined,
  }));

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline ?? undefined,
    logo: row.logo ?? null,
    description: row.description ?? undefined,
    website: row.website,
    founded: row.founded ?? null,
    owner: row.owner ?? undefined,
    status: row.status as Casino["status"],
    verificationStatus: row.verificationStatus as VerificationStatus,
    lastVerifiedAt: row.lastVerifiedAt,
    dataSources: (row.dataSources ?? []) as Casino["dataSources"],
    rating: row.rating ?? null,
    trustScore: row.trustScore ?? null,
    licenses: licenseObjs,
    countries,
    restrictedCountries,
    languages: (row.languages ?? []) as string[],
    currencies: (row.currencies ?? []) as string[],
    minDeposit: row.minDeposit,
    maxDeposit: row.maxDeposit ?? null,
    minWithdrawal: row.minWithdrawal ?? null,
    paymentMethods: paymentMethodObjs,
    withdrawalMethods: (row.withdrawalMethods ?? []) as string[],
    withdrawalProcessingTime: row.withdrawalProcessingTime ?? null,
    bonuses: (row.bonuses ?? []) as Casino["bonuses"],
    games: (row.games ?? []) as Casino["games"],
    hasLiveCasino: row.hasLiveCasino,
    hasSportsBetting: row.hasSportsBetting,
    hasCrypto: row.hasCrypto,
    hasMobile: row.hasMobile,
    kycRequired: row.kycRequired,
    kycDocuments: (row.kycDocuments ?? undefined) as Casino["kycDocuments"],
    kycProcessingTime: row.kycProcessingTime ?? null,
    minAge: row.minAge,
    responsibleGambling: (row.responsibleGambling ?? {
      selfExclusion: false,
      depositLimits: false,
      sessionLimits: false,
      realityCheck: false,
      coolingOffPeriod: false,
    }) as Casino["responsibleGambling"],
    affiliateOffers: (row.affiliateOffers ?? []) as Casino["affiliateOffers"],
    review: (row.review ?? {
      overview: "",
      pros: [],
      cons: [],
      verdict: "",
      score: null,
      scoreBreakdown: null,
    }) as Casino["review"],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    features: (row.features ?? []) as string[],
    tags: (row.tags ?? []) as string[],
    verificationCadence: (row.verificationCadence ?? {}) as Casino["verificationCadence"],
  };
}

export function isProductionVisible(row: CasinoRow): boolean {
  return row.status === "active" && row.verificationStatus === "verified";
}
