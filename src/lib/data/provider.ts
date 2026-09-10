import { Casino, CasinoListItem, AffiliateOffer, VerificationStatus } from "@/lib/types";

export interface CasinoDataProvider {
  /** Get all active casinos (status=active AND verificationStatus=verified) */
  getAllCasinos(): Casino[];

  /** Get a single active casino by slug */
  getCasinoBySlug(slug: string): Casino | undefined;

  /** Get a single active casino by ID */
  getCasinoById(id: string): Casino | undefined;

  /** Get active casinos available in a specific country */
  getCasinosByCountry(countryCode: string): Casino[];

  /** Get casinos available in a specific GEO, filtered by verification status */
  getCasinosByGeo(geo: string, requiredStatus?: VerificationStatus): Casino[];

  /** Get casinos by verification status */
  getCasinosByStatus(status: VerificationStatus): Casino[];

  /** Get top-rated active casinos for listing */
  getFeaturedCasinos(): CasinoListItem[];

  /** Get most recently verified active casinos */
  getLatestCasinos(): CasinoListItem[];

  /** Get related active casinos based on similarity */
  getRelatedCasinos(casinoId: string, limit?: number): CasinoListItem[];

  /** Search active casinos by name or features */
  searchCasinos(query: string): Casino[];

  /** Convert full Casino to lightweight CasinoListItem */
  selectCasinoListItem(casino: Casino): CasinoListItem;

  /** Get all countries where at least one active casino operates */
  getAvailableCountries(): string[];

  /** Get a resolved affiliate offer for a casino in a specific GEO */
  getAffiliateOffer(casinoId: string, geo: string): AffiliateOffer | null;
}
