import { eq } from "drizzle-orm";
import { casinos, casinoLicenses, geoAvailability, casinoPaymentMethods, paymentMethods } from "./schema";
import type { Casino, CasinoListItem, License, PaymentMethod, VerificationStatus } from "@/lib/types";
import type { CasinoDataProvider } from "@/lib/data/provider";
import { resolveOffer } from "@/lib/ai/affiliate-utils";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";

// ─── Row-to-Object Conversion ─────────────────────────────────────────────

/**
 * Reconstruct a full Casino object from a main row + normalized related data.
 */
function rowToCasino(
  row: typeof casinos.$inferSelect,
  licenses: Array<typeof casinoLicenses.$inferSelect>,
  geo: Array<typeof geoAvailability.$inferSelect>,
  paymentLinks: Array<typeof casinoPaymentMethods.$inferSelect & { pmName: string; pmType: string }>,
): Casino {
  // Reconstruct GEO arrays from normalized data
  const countries = geo
    .filter((g) => g.status === "available")
    .map((g) => g.geo);
  const restrictedCountries = geo
    .filter((g) => g.status === "restricted")
    .map((g) => g.geo);

  // Reconstruct payment methods from junction table
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

  // Reconstruct licenses
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

/**
 * Helper: load full casino with all related data.
 */
function loadFullCasino(
  db: ReturnType<typeof drizzle>,
  casinoRow: typeof casinos.$inferSelect,
): Casino {
  const licenses = db
    .select()
    .from(casinoLicenses)
    .where(eq(casinoLicenses.casinoId, casinoRow.id))
    .all();

  const geo = db
    .select()
    .from(geoAvailability)
    .where(eq(geoAvailability.casinoId, casinoRow.id))
    .all();

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
    .where(eq(casinoPaymentMethods.casinoId, casinoRow.id))
    .all();

  return rowToCasino(casinoRow, licenses, geo, paymentLinks);
}

// ─── Provider Factory ─────────────────────────────────────────────────────

export function createDbProvider(dbPath?: string): CasinoDataProvider {
  const resolvedPath = dbPath || process.env.CASINO_DB_PATH || path.join(process.cwd(), "casino.db");
  const sqlite = new Database(resolvedPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite, { schema: { casinos, casinoLicenses, geoAvailability, casinoPaymentMethods, paymentMethods } });

  const isProductionVisible = (row: typeof casinos.$inferSelect) =>
    row.status === "active" && row.verificationStatus === "verified";

  const selectCasinoListItem = (casino: Casino): CasinoListItem => ({
    id: casino.id,
    slug: casino.slug,
    name: casino.name,
    tagline: casino.tagline,
    logo: casino.logo,
    rating: casino.rating,
    trustScore: casino.trustScore,
    licenses: casino.licenses,
    minDeposit: casino.minDeposit,
    paymentMethods: casino.paymentMethods,
    bonuses: casino.bonuses,
    games: casino.games,
    hasLiveCasino: casino.hasLiveCasino,
    hasSportsBetting: casino.hasSportsBetting,
    lastVerifiedAt: casino.lastVerifiedAt,
    countries: casino.countries,
    features: casino.features,
    affiliateOffers: casino.affiliateOffers,
    status: casino.status,
    verificationStatus: casino.verificationStatus,
  });

  return {
    getAllCasinos: () => {
      const rows = db.select().from(casinos).all().filter(isProductionVisible);
      return rows.map((row) => loadFullCasino(db, row));
    },

    getCasinoBySlug: (slug) => {
      const row = db.select().from(casinos).where(eq(casinos.slug, slug)).get();
      if (!row || !isProductionVisible(row)) return undefined;
      return loadFullCasino(db, row);
    },

    getCasinoById: (id) => {
      const row = db.select().from(casinos).where(eq(casinos.id, id)).get();
      if (!row || !isProductionVisible(row)) return undefined;
      return loadFullCasino(db, row);
    },

    getCasinosByCountry: (countryCode) => {
      // Use GEO availability table for proper filtering
      const geoRows = db
        .select()
        .from(geoAvailability)
        .all()
        .filter(
          (g) => g.geo === countryCode && g.status === "available"
        );
      const casinoIds = new Set(geoRows.map((g) => g.casinoId));

      return db
        .select()
        .from(casinos)
        .all()
        .filter((row) => isProductionVisible(row) && casinoIds.has(row.id))
        .map((row) => loadFullCasino(db, row));
    },

    getCasinosByGeo: (geo, requiredStatus = "verified") => {
      const geoRows = db
        .select()
        .from(geoAvailability)
        .all()
        .filter(
          (g) => g.geo === geo && g.status === "available"
        );
      const casinoIds = new Set(geoRows.map((g) => g.casinoId));

      return db
        .select()
        .from(casinos)
        .all()
        .filter(
          (row) =>
            row.status === "active" &&
            row.verificationStatus === requiredStatus &&
            casinoIds.has(row.id)
        )
        .map((row) => loadFullCasino(db, row));
    },

    getCasinosByStatus: (status) => {
      return db
        .select()
        .from(casinos)
        .all()
        .filter(
          (row) => row.status === "active" && row.verificationStatus === status
        )
        .map((row) => loadFullCasino(db, row));
    },

    getFeaturedCasinos: () => {
      return db
        .select()
        .from(casinos)
        .all()
        .filter(isProductionVisible)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 6)
        .map((row) => selectCasinoListItem(loadFullCasino(db, row)));
    },

    getLatestCasinos: () => {
      return db
        .select()
        .from(casinos)
        .all()
        .filter(isProductionVisible)
        .sort(
          (a, b) =>
            new Date(b.lastVerifiedAt).getTime() -
            new Date(a.lastVerifiedAt).getTime()
        )
        .slice(0, 6)
        .map((row) => selectCasinoListItem(loadFullCasino(db, row)));
    },

    searchCasinos: (query) => {
      const lower = query.toLowerCase();
      return db
        .select()
        .from(casinos)
        .all()
        .filter(
          (row) =>
            isProductionVisible(row) &&
            (row.name.toLowerCase().includes(lower) ||
              (row.tags as string[]).some((t) => t.toLowerCase().includes(lower)))
        )
        .map((row) => loadFullCasino(db, row));
    },

    getRelatedCasinos: (casinoId, limit = 4) => {
      const casinoRow = db
        .select()
        .from(casinos)
        .where(eq(casinos.id, casinoId))
        .get();

      if (!casinoRow || !isProductionVisible(casinoRow)) {
        return db
          .select()
          .from(casinos)
          .all()
          .filter(isProductionVisible)
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, limit)
          .map((row) => selectCasinoListItem(loadFullCasino(db, row)));
      }

      const casino = loadFullCasino(db, casinoRow);

      return db
        .select()
        .from(casinos)
        .all()
        .filter((row) => row.id !== casinoId && isProductionVisible(row))
        .map((row) => {
          const c = loadFullCasino(db, row);
          return {
            similarity:
              c.countries.filter((co) => casino.countries.includes(co)).length +
              (c.hasLiveCasino === casino.hasLiveCasino ? 1 : 0) +
              c.games.filter((g) =>
                casino.games.some((cg) => cg.slug === g.slug)
              ).length,
            casino: c,
          };
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit)
        .map((item) => selectCasinoListItem(item.casino));
    },

    selectCasinoListItem,

    getAvailableCountries: () => {
      const countries = new Set<string>();
      db.select()
        .from(geoAvailability)
        .all()
        .filter((g) => g.status === "available")
        .forEach((g) => countries.add(g.geo));
      return Array.from(countries).sort();
    },

    getAffiliateOffer: (casinoId, geo) => {
      const row = db
        .select()
        .from(casinos)
        .where(eq(casinos.id, casinoId))
        .get();
      if (!row || !isProductionVisible(row)) return null;
      const casino = loadFullCasino(db, row);
      return resolveOffer(casino.affiliateOffers, geo);
    },
  };
}
