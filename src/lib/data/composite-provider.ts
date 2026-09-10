import type { Casino, CasinoListItem } from "@/lib/types";
import type { CasinoDataProvider } from "./provider";
import { germanyVerifiedCasinos } from "./germany/index";
import { netherlandsVerifiedCasinos } from "./netherlands/index";
import { belgiumVerifiedCasinos } from "./belgium/index";
import { resolveOffer } from "@/lib/ai/affiliate-utils";

// ─── All Verified Casinos ─────────────────────────────────────────────────

const allVerifiedCasinos: Casino[] = [
  ...germanyVerifiedCasinos,
  ...netherlandsVerifiedCasinos,
  ...belgiumVerifiedCasinos,
];

// ─── Shared Utilities ──────────────────────────────────────────────────────

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

// ─── Composite Provider ────────────────────────────────────────────────────

/**
 * Multi-GEO composite provider.
 *
 * Merges verified casinos from all supported GEOs (DE, NL, BE).
 * Production visibility is gated by verificationStatus === "verified".
 */
export function createCompositeProvider(): CasinoDataProvider {
  const casinos = allVerifiedCasinos;

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

/**
 * Get all verified casinos across all GEOs.
 */
export function getAllVerifiedCasinos(): Casino[] {
  return [...allVerifiedCasinos];
}

/**
 * Get verified casinos for a specific GEO.
 */
export function getVerifiedCasinosByGeo(geo: string): Casino[] {
  return allVerifiedCasinos.filter(c =>
    c.status === "active" &&
    c.verificationStatus === "verified" &&
    c.countries.includes(geo)
  );
}
