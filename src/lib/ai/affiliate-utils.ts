import { AffiliateOffer } from "@/lib/types";

/**
 * Resolve an affiliate offer for a given GEO.
 *
 * Priority chain:
 * 1. Exact country match (e.g., "DE")
 * 2. "ALL" fallback
 * 3. "INT" fallback
 * 4. First valid active offer
 *
 * Only returns offers that are:
 * - isActive: true
 * - endDate is null OR in the future
 */
export function resolveOffer(offers: AffiliateOffer[], geo: string): AffiliateOffer | null {
  const active = offers.filter(o => {
    if (!o.isActive) return false;
    if (o.endDate && new Date(o.endDate) < new Date()) return false;
    return true;
  });

  // 1. Exact country match
  const exact = active.find(o => o.geo === geo);
  if (exact) return exact;

  // 2. ALL fallback
  const all = active.find(o => o.geo === "ALL");
  if (all) return all;

  // 3. INT fallback
  const intl = active.find(o => o.geo === "INT");
  if (intl) return intl;

  // 4. First active offer
  return active[0] ?? null;
}
