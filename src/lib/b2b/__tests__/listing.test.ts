import { describe, it, expect } from "vitest";
import {
  getCasinoListingPriority,
  sortCasinoListings,
  isProductionVisible,
  canDisplayBadge,
} from "../listing";
import type { CasinoListing } from "../types";

function makeTestListing(overrides: Partial<CasinoListing> = {}): CasinoListing {
  const now = new Date().toISOString();
  return {
    id: "test-id-1",
    brandName: "Test Casino",
    officialWebsite: "https://testcasino.com",
    operatorName: "Test Operator",
    targetGeos: ["DE"],
    supportedLanguages: ["en"],
    paymentMethods: ["visa"],
    productCategories: ["slots"],
    contactName: "Test Contact",
    businessEmail: "test@test.com",
    listing: {
      listingPlan: "free",
      featured: false,
      premium: false,
      sponsored: false,
      listingStatus: "approved",
      listingVisibility: "published",
      claimStatus: "unclaimed",
      adminPriority: 0,
      listedAt: now,
    },
    affiliateEnabled: false,
    affiliateOfferId: null,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe("Listing Priority", () => {
  it("free listing has base priority", () => {
    const listing = makeTestListing();
    const priority = getCasinoListingPriority(listing);
    expect(priority).toBe(100);
  });

  it("verified listing has higher priority than free", () => {
    const free = makeTestListing();
    const verified = makeTestListing({ listing: { ...free.listing, listingPlan: "verified" } });
    expect(getCasinoListingPriority(verified)).toBeGreaterThan(getCasinoListingPriority(free));
  });

  it("featured listing has higher priority than verified", () => {
    const verified = makeTestListing({ listing: { ...makeTestListing().listing, listingPlan: "verified" } });
    const featured = makeTestListing({ listing: { ...makeTestListing().listing, listingPlan: "featured" } });
    expect(getCasinoListingPriority(featured)).toBeGreaterThan(getCasinoListingPriority(verified));
  });

  it("premium listing has highest base priority", () => {
    const premium = makeTestListing({ listing: { ...makeTestListing().listing, listingPlan: "premium" } });
    const featured = makeTestListing({ listing: { ...makeTestListing().listing, listingPlan: "featured" } });
    expect(getCasinoListingPriority(premium)).toBeGreaterThan(getCasinoListingPriority(featured));
  });

  it("admin priority adds to base priority", () => {
    const base = makeTestListing();
    const boosted = makeTestListing({ listing: { ...base.listing, adminPriority: 50 } });
    expect(getCasinoListingPriority(boosted)).toBe(getCasinoListingPriority(base) + 50);
  });

  it("featured flag adds bonus priority", () => {
    const base = makeTestListing();
    const flagged = makeTestListing({ listing: { ...base.listing, featured: true } });
    expect(getCasinoListingPriority(flagged)).toBe(getCasinoListingPriority(base) + 50);
  });

  it("premium flag adds bonus priority", () => {
    const base = makeTestListing();
    const flagged = makeTestListing({ listing: { ...base.listing, premium: true } });
    expect(getCasinoListingPriority(flagged)).toBe(getCasinoListingPriority(base) + 100);
  });

  it("sponsored flag adds bonus priority", () => {
    const base = makeTestListing();
    const flagged = makeTestListing({ listing: { ...base.listing, sponsored: true } });
    expect(getCasinoListingPriority(flagged)).toBe(getCasinoListingPriority(base) + 25);
  });
});

describe("sortCasinoListings", () => {
  it("sorts by priority descending", () => {
    const free = makeTestListing({ id: "free-1", brandName: "Free Casino" });
    const premium = makeTestListing({ id: "premium-1", brandName: "Premium Casino", listing: { ...free.listing, listingPlan: "premium" } });
    const featured = makeTestListing({ id: "featured-1", brandName: "Featured Casino", listing: { ...free.listing, listingPlan: "featured" } });

    const sorted = sortCasinoListings([free, premium, featured]);
    expect(sorted[0].id).toBe("premium-1");
    expect(sorted[1].id).toBe("featured-1");
    expect(sorted[2].id).toBe("free-1");
  });

  it("does not mutate the original array", () => {
    const listings = [
      makeTestListing({ id: "a" }),
      makeTestListing({ id: "b" }),
    ];
    const original = [...listings];
    sortCasinoListings(listings);
    expect(listings).toEqual(original);
  });
});

describe("isProductionVisible", () => {
  it("returns true for approved + published", () => {
    const listing = makeTestListing();
    expect(isProductionVisible(listing)).toBe(true);
  });

  it("returns false for pending status", () => {
    const listing = makeTestListing({ listing: { ...makeTestListing().listing, listingStatus: "pending" } });
    expect(isProductionVisible(listing)).toBe(false);
  });

  it("returns false for draft visibility", () => {
    const listing = makeTestListing({ listing: { ...makeTestListing().listing, listingVisibility: "draft" } });
    expect(isProductionVisible(listing)).toBe(false);
  });

  it("returns false for rejected status", () => {
    const listing = makeTestListing({ listing: { ...makeTestListing().listing, listingStatus: "rejected" } });
    expect(isProductionVisible(listing)).toBe(false);
  });
});

describe("canDisplayBadge", () => {
  it("verified badge shown for verified plan", () => {
    const listing = makeTestListing({ listing: { ...makeTestListing().listing, listingPlan: "verified" } });
    expect(canDisplayBadge(listing, "verified")).toBe(true);
  });

  it("verified badge shown for featured plan", () => {
    const listing = makeTestListing({ listing: { ...makeTestListing().listing, listingPlan: "featured" } });
    expect(canDisplayBadge(listing, "verified")).toBe(true);
  });

  it("featured badge shown for featured plan", () => {
    const listing = makeTestListing({ listing: { ...makeTestListing().listing, listingPlan: "featured" } });
    expect(canDisplayBadge(listing, "featured")).toBe(true);
  });

  it("premium badge shown only for premium plan", () => {
    const featured = makeTestListing({ listing: { ...makeTestListing().listing, listingPlan: "featured" } });
    const premium = makeTestListing({ listing: { ...makeTestListing().listing, listingPlan: "premium" } });
    expect(canDisplayBadge(featured, "premium")).toBe(false);
    expect(canDisplayBadge(premium, "premium")).toBe(true);
  });

  it("no badges shown for non-approved listings", () => {
    const listing = makeTestListing({
      listing: { ...makeTestListing().listing, listingStatus: "pending", listingPlan: "premium" },
    });
    expect(canDisplayBadge(listing, "premium")).toBe(false);
    expect(canDisplayBadge(listing, "verified")).toBe(false);
  });

  it("sponsored badge shown when sponsored flag is true", () => {
    const listing = makeTestListing({ listing: { ...makeTestListing().listing, sponsored: true } });
    expect(canDisplayBadge(listing, "sponsored")).toBe(true);
  });
});
