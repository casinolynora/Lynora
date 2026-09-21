/**
 * Server-only payment entity data access.
 *
 * Uses the SQLite database provider for full production dataset (138 casinos, 829+ payment records).
 * Must NEVER be imported by client components.
 */
import path from "path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { eq } from "drizzle-orm";
import { casinos, casinoLicenses, geoAvailability, casinoPaymentMethods, paymentMethods } from "@/lib/db/schema";
import type { Casino, License, PaymentMethod, VerificationStatus } from "@/lib/types";

function rowToCasino(
  row: typeof casinos.$inferSelect,
  licenses: Array<typeof casinoLicenses.$inferSelect>,
  geo: Array<typeof geoAvailability.$inferSelect>,
  paymentLinks: Array<typeof casinoPaymentMethods.$inferSelect & { pmName: string; pmType: string }>,
): Casino {
  const countries = geo.filter((g) => g.status === "available").map((g) => g.geo);
  const restrictedCountries = geo.filter((g) => g.status === "restricted").map((g) => g.geo);

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
      selfExclusion: false, depositLimits: false, sessionLimits: false,
      realityCheck: false, coolingOffPeriod: false,
    }) as Casino["responsibleGambling"],
    affiliateOffers: (row.affiliateOffers ?? []) as Casino["affiliateOffers"],
    review: (row.review ?? {
      overview: "", pros: [], cons: [], verdict: "", score: null, scoreBreakdown: null,
    }) as Casino["review"],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    features: (row.features ?? []) as string[],
    tags: (row.tags ?? []) as string[],
    verificationCadence: (row.verificationCadence ?? {}) as Casino["verificationCadence"],
  };
}

let cachedCasinos: Casino[] | null = null;

/**
 * Get all verified casinos from the SQLite database.
 * Cached after first call for performance within a single request.
 */
export function getFullDatasetCasinos(): Casino[] {
  if (cachedCasinos) return cachedCasinos;

  const dbPath = process.env.CASINO_DB_PATH || path.join(process.cwd(), "casino.db");
  const sqlite = new Database(dbPath, { readonly: true });
  sqlite.pragma("journal_mode = WAL");
  const db = drizzle(sqlite, { schema: { casinos, casinoLicenses, geoAvailability, casinoPaymentMethods, paymentMethods } });

  const isProductionVisible = (row: typeof casinos.$inferSelect) =>
    row.status === "active" && row.verificationStatus === "verified";

  const rows = db.select().from(casinos).all().filter(isProductionVisible);

  const result = rows.map((row) => {
    const licenses = db.select().from(casinoLicenses).where(eq(casinoLicenses.casinoId, row.id)).all();
    const geo = db.select().from(geoAvailability).where(eq(geoAvailability.casinoId, row.id)).all();
    const paymentLinks = db
      .select({
        id: casinoPaymentMethods.id,
        casinoId: casinoPaymentMethods.casinoId,
        paymentMethodId: casinoPaymentMethods.paymentMethodId,
        minDeposit: casinoPaymentMethods.minDeposit,
        maxDeposit: casinoPaymentMethods.maxDeposit,
        minWithdrawal: casinoPaymentMethods.minWithdrawal,
        maxWithdrawal: casinoPaymentMethods.maxWithdrawal,
        withdrawalTime: casinoPaymentMethods.withdrawalTime,
        fees: casinoPaymentMethods.fees,
        createdAt: casinoPaymentMethods.createdAt,
        pmName: paymentMethods.name,
        pmType: paymentMethods.type,
      })
      .from(casinoPaymentMethods)
      .innerJoin(paymentMethods, eq(casinoPaymentMethods.paymentMethodId, paymentMethods.id))
      .where(eq(casinoPaymentMethods.casinoId, row.id))
      .all();

    return rowToCasino(row, licenses, geo, paymentLinks);
  });

  sqlite.close();
  cachedCasinos = result;
  return result;
}
