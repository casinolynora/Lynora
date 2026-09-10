import { Casino, CasinoListItem } from "@/lib/types";
import { DEMO_CASINOS } from "./casinos";
import { CasinoDataProvider } from "./provider";
import { resolveOffer } from "@/lib/ai/affiliate-utils";

// Cast DEMO_CASINOS to Casino[] — they are missing new fields that have schema defaults
const demoCasinos = DEMO_CASINOS as Casino[];

function selectCasinoListItem(casino: Casino): CasinoListItem {
  return {
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
  };
}

function createInMemoryProvider(casinos: Casino[]): CasinoDataProvider {
  // Production-ready: only verified + active casinos pass through
  const isProductionVisible = (c: Casino) =>
    c.status === "active" && c.verificationStatus === "verified";

  return {
    getAllCasinos: () => casinos.filter(isProductionVisible),

    getCasinoBySlug: (slug) => casinos.find(c => c.slug === slug && isProductionVisible(c)),

    getCasinoById: (id) => casinos.find(c => c.id === id && isProductionVisible(c)),

    getCasinosByCountry: (countryCode) =>
      casinos.filter(c =>
        isProductionVisible(c) &&
        c.countries.includes(countryCode) &&
        !c.restrictedCountries.includes(countryCode)
      ),

    getCasinosByGeo: (geo, requiredStatus = "verified") =>
      casinos.filter(c =>
        c.status === "active" &&
        c.verificationStatus === requiredStatus &&
        c.countries.includes(geo) &&
        !c.restrictedCountries.includes(geo)
      ),

    getCasinosByStatus: (status) =>
      casinos.filter(c => c.status === "active" && c.verificationStatus === status),

    getFeaturedCasinos: () =>
      casinos
        .filter(isProductionVisible)
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 6)
        .map(selectCasinoListItem),

    getLatestCasinos: () =>
      casinos
        .filter(isProductionVisible)
        .sort((a, b) => new Date(b.lastVerifiedAt).getTime() - new Date(a.lastVerifiedAt).getTime())
        .slice(0, 6)
        .map(selectCasinoListItem),

    searchCasinos: (query) => {
      const lower = query.toLowerCase();
      return casinos.filter(c =>
        isProductionVisible(c) &&
        (c.name.toLowerCase().includes(lower) ||
         c.tags.some(t => t.toLowerCase().includes(lower)))
      );
    },

    getRelatedCasinos: (casinoId, limit = 4) => {
      const casino = casinos.find(c => c.id === casinoId && isProductionVisible(c));
      if (!casino) {
        return casinos
          .filter(isProductionVisible)
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, limit)
          .map(selectCasinoListItem);
      }

      return casinos
        .filter(c => c.id !== casinoId && isProductionVisible(c))
        .map(c => ({
          similarity: c.countries.filter(co => casino.countries.includes(co)).length
            + (c.hasLiveCasino === casino.hasLiveCasino ? 1 : 0)
            + (c.games.filter(g => casino.games.some(cg => cg.slug === g.slug)).length),
          casino: c,
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit)
        .map(item => selectCasinoListItem(item.casino));
    },

    selectCasinoListItem,

    getAvailableCountries: () => {
      const countries = new Set<string>();
      casinos
        .filter(isProductionVisible)
        .forEach(c => c.countries.forEach(co => countries.add(co)));
      return Array.from(countries).sort();
    },

    getAffiliateOffer: (casinoId, geo) => {
      const casino = casinos.find(c => c.id === casinoId && isProductionVisible(c));
      if (!casino) return null;
      return resolveOffer(casino.affiliateOffers, geo);
    },
  };
}

// In-memory provider using demo data (development only)
const devProvider = createInMemoryProvider(demoCasinos);

// Active provider — swap with database provider in production
let activeProvider: CasinoDataProvider = devProvider;

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
