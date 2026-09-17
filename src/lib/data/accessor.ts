import type { CasinoDataProvider } from "./provider";
import { createCompositeProvider } from "./composite-provider";

// ─── Provider Selection (Feature Flag) ────────────────────────────────────
//
// DATABASE_PROVIDER env var controls which provider is used:
//   - "memory" (default): In-memory TypeScript data (for dev/test)
//   - "sqlite": SQLite database (requires running seed.ts first)
//
// IMPORTANT: The SQLite provider is loaded ONLY on the server via a
// separate server-only module. This file never imports better-sqlite3
// directly, ensuring client bundles remain clean.

// Composite provider with verified casino data from all GEOs (DE, NL, BE)
const compositeProvider = createCompositeProvider();

// Active provider — swap with database provider in production
let activeProvider: CasinoDataProvider = compositeProvider;

export function setCasinoDataProvider(provider: CasinoDataProvider) {
  activeProvider = provider;
}

/**
 * Get the current active provider.
 * The provider is set via initializeServerDataProvider() on the server.
 */
export function getActiveProvider(): CasinoDataProvider {
  return activeProvider;
}

export const casinoDb: CasinoDataProvider = {
  getAllCasinos: () => activeProvider.getAllCasinos(),
  getCasinoBySlug: (slug) => activeProvider.getCasinoBySlug(slug),
  getCasinoById: (id) => activeProvider.getCasinoById(id),
  getCasinosByCountry: (countryCode) => activeProvider.getCasinosByCountry(countryCode),
  getCasinosByGeo: (geo, requiredStatus) => activeProvider.getCasinosByGeo(geo, requiredStatus),
  getCasinosByStatus: (status) => activeProvider.getCasinosByStatus(status),
  getFeaturedCasinos: () => activeProvider.getFeaturedCasinos(),
  getLatestCasinos: () => activeProvider.getLatestCasinos(),
  getRelatedCasinos: (casinoId, limit) => activeProvider.getRelatedCasinos(casinoId, limit),
  searchCasinos: (query) => activeProvider.searchCasinos(query),
  selectCasinoListItem: (casino) => activeProvider.selectCasinoListItem(casino),
  getAvailableCountries: () => activeProvider.getAvailableCountries(),
  getAffiliateOffer: (casinoId, geo) => activeProvider.getAffiliateOffer(casinoId, geo),
};
