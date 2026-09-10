import { describe, it, expect } from "vitest";

describe("Affiliate Resolution", () => {
  const activeOffer = { id: "1", geo: "DE", trackingUrl: "https://example.com/de", ctaText: "Visit", isActive: true };
  const allOffer = { id: "2", geo: "ALL", trackingUrl: "https://example.com/all", ctaText: "Visit", isActive: true };
  const intOffer = { id: "3", geo: "INT", trackingUrl: "https://example.com/int", ctaText: "Visit", isActive: true };
  const inactiveOffer = { id: "4", geo: "DE", trackingUrl: "https://example.com/de2", ctaText: "Visit", isActive: false };
  const expiredOffer = { id: "5", geo: "DE", trackingUrl: "https://example.com/exp", ctaText: "Visit", isActive: true, endDate: "2020-01-01" };

  it("prefers exact GEO match", () => {
    const offers = [allOffer, activeOffer];
    const resolved = resolveOffer(offers, "DE");
    expect(resolved?.id).toBe("1");
  });

  it("falls back to ALL", () => {
    const resolved = resolveOffer([allOffer], "FR");
    expect(resolved?.id).toBe("2");
  });

  it("falls back to INT", () => {
    const resolved = resolveOffer([intOffer], "FR");
    expect(resolved?.id).toBe("3");
  });

  it("skips inactive offers", () => {
    const resolved = resolveOffer([inactiveOffer, activeOffer], "DE");
    expect(resolved?.id).toBe("1");
  });

  it("skips expired offers", () => {
    const resolved = resolveOffer([expiredOffer, activeOffer], "DE");
    expect(resolved?.id).toBe("1");
  });

  it("returns null when no offers", () => {
    const resolved = resolveOffer([], "DE");
    expect(resolved).toBeNull();
  });

  it("returns null when all offers are inactive", () => {
    const resolved = resolveOffer([inactiveOffer], "DE");
    expect(resolved).toBeNull();
  });
});

// Inline the logic for testing (mirrors AffiliateCTA.tsx)
function resolveOffer(
  offers: { id: string; geo: string; trackingUrl: string; ctaText: string; isActive: boolean; endDate?: string }[],
  geo: string,
) {
  const active = offers.filter(o => {
    if (!o.isActive) return false;
    if (o.endDate && new Date(o.endDate) < new Date()) return false;
    return true;
  });
  const exact = active.find(o => o.geo === geo);
  if (exact) return exact;
  const all = active.find(o => o.geo === "ALL");
  if (all) return all;
  const intl = active.find(o => o.geo === "INT");
  if (intl) return intl;
  return active[0] ?? null;
}
