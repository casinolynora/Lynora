import type { CasinoDataProvider } from "./provider";
import { createCompositeProvider } from "./composite-provider";

// Composite provider with verified casino data from all GEOs (DE, NL, BE)
const compositeProvider = createCompositeProvider();

// Active provider — swap with database provider in production
let activeProvider: CasinoDataProvider = compositeProvider;

export function setCasinoDataProvider(provider: CasinoDataProvider) {
  activeProvider = provider;
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
