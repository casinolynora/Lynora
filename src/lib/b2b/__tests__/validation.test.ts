import { describe, it, expect } from "vitest";
import { validateSubmission, isSpamSubmission, SubmitListingRequestSchema, VALID_GEOS_FOR_LISTING } from "../validation";

describe("SubmitListingRequest Schema", () => {
  const validSubmission = {
    brandName: "Test Casino",
    officialWebsite: "https://testcasino.com",
    operatorName: "Test Operator Ltd",
    contactName: "John Doe",
    businessEmail: "john@testcasino.com",
    targetGeos: ["DE", "IE"],
    requestedPlan: "verified" as const,
  };

  it("accepts valid submission data", () => {
    expect(SubmitListingRequestSchema.safeParse(validSubmission).success).toBe(true);
  });

  it("accepts submission with all optional fields", () => {
    const full = {
      ...validSubmission,
      message: "We would like to be listed",
      affiliateManagerContact: "affiliate@testcasino.com",
      affiliateProgramUrl: "https://affiliate.testcasino.com",
      licenseInfo: "MGA/CRP/123/2014",
      yearLaunched: 2020,
      supportedLanguages: ["en", "de"],
      paymentMethods: ["visa", "paypal"],
      productCategories: ["slots", "live-casino"],
      existingProfileUrl: "https://beincasinos.com/casino-reviews/test-casino",
    };
    expect(SubmitListingRequestSchema.safeParse(full).success).toBe(true);
  });

  it("rejects missing brand name", () => {
    const data = { ...validSubmission, brandName: "" };
    expect(SubmitListingRequestSchema.safeParse(data).success).toBe(false);
  });

  it("rejects invalid website URL", () => {
    const data = { ...validSubmission, officialWebsite: "not-a-url" };
    expect(SubmitListingRequestSchema.safeParse(data).success).toBe(false);
  });

  it("rejects invalid email", () => {
    const data = { ...validSubmission, businessEmail: "not-an-email" };
    expect(SubmitListingRequestSchema.safeParse(data).success).toBe(false);
  });

  it("rejects empty target GEOs", () => {
    const data = { ...validSubmission, targetGeos: [] };
    expect(SubmitListingRequestSchema.safeParse(data).success).toBe(false);
  });

  it("rejects invalid listing plan", () => {
    const data = { ...validSubmission, requestedPlan: "enterprise" };
    expect(SubmitListingRequestSchema.safeParse(data).success).toBe(false);
  });

  it("rejects message over 2000 chars", () => {
    const data = { ...validSubmission, message: "x".repeat(2001) };
    expect(SubmitListingRequestSchema.safeParse(data).success).toBe(false);
  });

  it("accepts all valid GEO codes", () => {
    for (const geo of VALID_GEOS_FOR_LISTING) {
      const data = { ...validSubmission, targetGeos: [geo] };
      expect(SubmitListingRequestSchema.safeParse(data).success).toBe(true);
    }
  });
});

describe("validateSubmission", () => {
  const validData = {
    brandName: "Test Casino",
    officialWebsite: "https://testcasino.com",
    operatorName: "Test Operator",
    contactName: "John Doe",
    businessEmail: "john@test.com",
    targetGeos: ["DE"],
    requestedPlan: "free",
  };

  it("returns success for valid data", () => {
    const result = validateSubmission(validData);
    expect(result.success).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.data).toBeDefined();
  });

  it("returns errors for invalid data", () => {
    const result = validateSubmission({ brandName: "" });
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("returns errors for missing required fields", () => {
    const result = validateSubmission({});
    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(3);
  });
});

describe("isSpamSubmission", () => {
  const cleanData = {
    brandName: "Legit Casino",
    officialWebsite: "https://legitcasino.com",
    operatorName: "Legit Operator",
    contactName: "Jane Doe",
    businessEmail: "jane@legit.com",
    targetGeos: ["DE"],
    requestedPlan: "free" as const,
  };

  it("returns false for clean submission", () => {
    expect(isSpamSubmission(cleanData)).toBe(false);
  });

  it("returns true for spammy message content", () => {
    expect(isSpamSubmission({ ...cleanData, message: "Buy cheap casino bonus" })).toBe(true);
  });

  it("returns true for short brand name", () => {
    expect(isSpamSubmission({ ...cleanData, brandName: "A" })).toBe(true);
  });

  it("returns true for non-https website", () => {
    expect(isSpamSubmission({ ...cleanData, officialWebsite: "http://test.com" })).toBe(true);
  });
});

describe("VALID_GEOS_FOR_LISTING", () => {
  it("contains IE", () => {
    expect(VALID_GEOS_FOR_LISTING).toContain("IE");
  });

  it("contains DE", () => {
    expect(VALID_GEOS_FOR_LISTING).toContain("DE");
  });

  it("has at least 5 GEOs", () => {
    expect(VALID_GEOS_FOR_LISTING.length).toBeGreaterThanOrEqual(5);
  });

  it("all entries are 2 characters", () => {
    for (const geo of VALID_GEOS_FOR_LISTING) {
      expect(geo.length).toBe(2);
    }
  });
});
