import { eq, inArray } from "drizzle-orm";
import { casinos, casinoLicenses, geoAvailability, casinoPaymentMethods, paymentMethods } from "./schema";
import type { Casino, CasinoListItem } from "@/lib/types";
import type { CasinoDataProvider } from "@/lib/data/provider";
import { resolveOffer } from "@/lib/ai/affiliate-utils";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";
import { rowToCasino, isProductionVisible } from "./row-to-casino";

// ─── Batch Loading ────────────────────────────────────────────────────────

/**
 * Load all related data for a set of casino IDs in 3 batch queries
 * instead of N*3 individual queries.
 */
function loadRelatedData(
  db: ReturnType<typeof drizzle>,
  casinoIds: string[],
): {
  licensesMap: Map<string, Array<typeof casinoLicenses.$inferSelect>>;
  geoMap: Map<string, Array<typeof geoAvailability.$inferSelect>>;
  paymentsMap: Map<string, Array<typeof casinoPaymentMethods.$inferSelect & { pmName: string; pmType: string }>>;
} {
  if (casinoIds.length === 0) {
    return { licensesMap: new Map(), geoMap: new Map(), paymentsMap: new Map() };
  }

  // 3 batch queries instead of N*3
  const allLicenses = db
    .select()
    .from(casinoLicenses)
    .where(inArray(casinoLicenses.casinoId, casinoIds))
    .all();

  const allGeo = db
    .select()
    .from(geoAvailability)
    .where(inArray(geoAvailability.casinoId, casinoIds))
    .all();

  const allPayments = db
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
    .where(inArray(casinoPaymentMethods.casinoId, casinoIds))
    .all();

  // Group by casinoId
  const licensesMap = new Map<string, Array<typeof casinoLicenses.$inferSelect>>();
  const geoMap = new Map<string, Array<typeof geoAvailability.$inferSelect>>();
  const paymentsMap = new Map<string, Array<typeof casinoPaymentMethods.$inferSelect & { pmName: string; pmType: string }>>();

  for (const l of allLicenses) {
    const arr = licensesMap.get(l.casinoId) ?? [];
    arr.push(l);
    licensesMap.set(l.casinoId, arr);
  }
  for (const g of allGeo) {
    const arr = geoMap.get(g.casinoId) ?? [];
    arr.push(g);
    geoMap.set(g.casinoId, arr);
  }
  for (const p of allPayments) {
    const arr = paymentsMap.get(p.casinoId) ?? [];
    arr.push(p);
    paymentsMap.set(p.casinoId, arr);
  }

  return { licensesMap, geoMap, paymentsMap };
}

/**
 * Convert a batch of casino rows to full Casino objects using pre-loaded related data.
 */
function rowsToCasinos(
  db: ReturnType<typeof drizzle>,
  rows: Array<typeof casinos.$inferSelect>,
): Casino[] {
  const casinoIds = rows.map((r) => r.id);
  const { licensesMap, geoMap, paymentsMap } = loadRelatedData(db, casinoIds);

  return rows.map((row) =>
    rowToCasino(
      row,
      licensesMap.get(row.id) ?? [],
      geoMap.get(row.id) ?? [],
      paymentsMap.get(row.id) ?? [],
    )
  );
}

// ─── Provider Factory ─────────────────────────────────────────────────────

export function createDbProvider(dbPath?: string): CasinoDataProvider {
  const resolvedPath = dbPath || process.env.CASINO_DB_PATH || path.join(process.cwd(), "casino.db");
  const sqlite = new Database(resolvedPath);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  const db = drizzle(sqlite, { schema: { casinos, casinoLicenses, geoAvailability, casinoPaymentMethods, paymentMethods } });

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
      return rowsToCasinos(db, rows);
    },

    getCasinoBySlug: (slug) => {
      const row = db.select().from(casinos).where(eq(casinos.slug, slug)).get();
      if (!row || !isProductionVisible(row)) return undefined;
      return rowsToCasinos(db, [row])[0];
    },

    getCasinoById: (id) => {
      const row = db.select().from(casinos).where(eq(casinos.id, id)).get();
      if (!row || !isProductionVisible(row)) return undefined;
      return rowsToCasinos(db, [row])[0];
    },

    getCasinosByCountry: (countryCode) => {
      // Get casino IDs available in this country via GEO table
      const geoRows = db
        .select({ casinoId: geoAvailability.casinoId })
        .from(geoAvailability)
        .where(eq(geoAvailability.geo, countryCode))
        .all()
        .filter((g) => g.casinoId); // status "available" filtered below

      const casinoIds = [...new Set(geoRows.map((g) => g.casinoId))];
      if (casinoIds.length === 0) return [];

      // Load matching casinos in one query
      const rows = db
        .select()
        .from(casinos)
        .where(inArray(casinos.id, casinoIds))
        .all()
        .filter(isProductionVisible);

      // Batch-load related data for all matching casinos
      const allCasinos = rowsToCasinos(db, rows);

      // Filter to those actually available (not restricted) in this country
      return allCasinos.filter(
        (c) => c.countries.includes(countryCode) && !c.restrictedCountries.includes(countryCode)
      );
    },

    getCasinosByGeo: (geo, requiredStatus = "verified") => {
      const geoRows = db
        .select({ casinoId: geoAvailability.casinoId })
        .from(geoAvailability)
        .where(eq(geoAvailability.geo, geo))
        .all();

      const casinoIds = [...new Set(geoRows.map((g) => g.casinoId))];
      if (casinoIds.length === 0) return [];

      const rows = db
        .select()
        .from(casinos)
        .where(inArray(casinos.id, casinoIds))
        .all()
        .filter(
          (row) =>
            row.status === "active" &&
            row.verificationStatus === requiredStatus
        );

      return rowsToCasinos(db, rows);
    },

    getCasinosByStatus: (status) => {
      const rows = db
        .select()
        .from(casinos)
        .all()
        .filter(
          (row) => row.status === "active" && row.verificationStatus === status
        );

      return rowsToCasinos(db, rows);
    },

    getFeaturedCasinos: () => {
      const rows = db
        .select()
        .from(casinos)
        .all()
        .filter(isProductionVisible)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 6);

      return rowsToCasinos(db, rows).map(selectCasinoListItem);
    },

    getLatestCasinos: () => {
      const rows = db
        .select()
        .from(casinos)
        .all()
        .filter(isProductionVisible)
        .sort(
          (a, b) =>
            new Date(b.lastVerifiedAt).getTime() -
            new Date(a.lastVerifiedAt).getTime()
        )
        .slice(0, 6);

      return rowsToCasinos(db, rows).map(selectCasinoListItem);
    },

    searchCasinos: (query) => {
      const lower = query.toLowerCase();
      const rows = db
        .select()
        .from(casinos)
        .all()
        .filter(
          (row) =>
            isProductionVisible(row) &&
            (row.name.toLowerCase().includes(lower) ||
              (row.tags as string[]).some((t) => t.toLowerCase().includes(lower)))
        );

      return rowsToCasinos(db, rows);
    },

    getRelatedCasinos: (casinoId, limit = 4) => {
      const casinoRow = db
        .select()
        .from(casinos)
        .where(eq(casinos.id, casinoId))
        .get();

      if (!casinoRow || !isProductionVisible(casinoRow)) {
        // Fallback: top rated
        const rows = db
          .select()
          .from(casinos)
          .all()
          .filter(isProductionVisible)
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, limit);

        return rowsToCasinos(db, rows).map(selectCasinoListItem);
      }

      // Load the target casino
      const [targetCasino] = rowsToCasinos(db, [casinoRow]);

      // Load ALL other casinos in batch
      const allRows = db
        .select()
        .from(casinos)
        .all()
        .filter((row) => row.id !== casinoId && isProductionVisible(row));

      const allCasinos = rowsToCasinos(db, allRows);

      // Score and sort by similarity
      return allCasinos
        .map((c) => ({
          similarity:
            c.countries.filter((co) => targetCasino.countries.includes(co)).length +
            (c.hasLiveCasino === targetCasino.hasLiveCasino ? 1 : 0) +
            c.games.filter((g) =>
              targetCasino.games.some((cg) => cg.slug === g.slug)
            ).length,
          casino: c,
        }))
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
      const [casino] = rowsToCasinos(db, [row]);
      return resolveOffer(casino.affiliateOffers, geo);
    },
  };
}
