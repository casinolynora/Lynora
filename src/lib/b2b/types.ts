import { z } from "zod";

export const ListingPlanSchema = z.enum(["free", "verified", "featured", "premium", "custom"]);
export type ListingPlan = z.infer<typeof ListingPlanSchema>;

export const ListingStatusSchema = z.enum(["pending", "under_review", "approved", "rejected", "suspended", "archived"]);
export type ListingStatus = z.infer<typeof ListingStatusSchema>;

export const ListingVisibilitySchema = z.enum(["draft", "published", "hidden"]);
export type ListingVisibility = z.infer<typeof ListingVisibilitySchema>;

export const ClaimStatusSchema = z.enum(["unclaimed", "pending", "claimed"]);
export type ClaimStatus = z.infer<typeof ClaimStatusSchema>;

export const SubmissionStatusSchema = z.enum(["pending", "under_review", "approved", "rejected"]);
export type SubmissionStatus = z.infer<typeof SubmissionStatusSchema>;

export const OperatorSubmissionSchema = z.object({
  id: z.string().uuid(),
  casinoId: z.string().nullable(),
  brandName: z.string().min(1).max(200),
  officialWebsite: z.string().url(),
  operatorName: z.string().min(1).max(200),
  contactName: z.string().min(1).max(200),
  businessEmail: z.string().email(),
  targetGeos: z.array(z.string().min(2).max(2)).min(1),
  requestedPlan: ListingPlanSchema,
  message: z.string().max(2000).optional(),
  affiliateManagerContact: z.string().max(200).optional(),
  affiliateProgramUrl: z.string().url().optional(),
  licenseInfo: z.string().max(500).optional(),
  yearLaunched: z.number().int().min(2000).max(2030).optional(),
  supportedLanguages: z.array(z.string()).optional(),
  paymentMethods: z.array(z.string()).optional(),
  productCategories: z.array(z.string()).optional(),
  existingProfileUrl: z.string().url().optional(),
  status: SubmissionStatusSchema.default("pending"),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type OperatorSubmission = z.infer<typeof OperatorSubmissionSchema>;

export const ListingMetaSchema = z.object({
  listingPlan: ListingPlanSchema.default("free"),
  featured: z.boolean().default(false),
  premium: z.boolean().default(false),
  sponsored: z.boolean().default(false),
  listingStatus: ListingStatusSchema.default("pending"),
  listingVisibility: ListingVisibilitySchema.default("draft"),
  claimStatus: ClaimStatusSchema.default("unclaimed"),
  adminPriority: z.number().int().min(0).max(1000).default(0),
  listedAt: z.string().datetime().nullable().default(null),
});
export type ListingMeta = z.infer<typeof ListingMetaSchema>;

export const CasinoListingSchema = z.object({
  id: z.string().uuid(),
  brandName: z.string().min(1).max(200),
  officialWebsite: z.string().url(),
  operatorName: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  logo: z.string().url().nullable().optional(),
  targetGeos: z.array(z.string().min(2).max(2)).min(1),
  supportedLanguages: z.array(z.string()).default([]),
  paymentMethods: z.array(z.string()).default([]),
  productCategories: z.array(z.string()).default([]),
  yearLaunched: z.number().int().min(2000).max(2030).nullable().optional(),
  licenseInfo: z.string().max(500).optional(),
  contactName: z.string().min(1).max(200),
  businessEmail: z.string().email(),
  affiliateManagerContact: z.string().max(200).optional(),
  affiliateProgramUrl: z.string().url().optional(),
  listing: ListingMetaSchema,
  affiliateEnabled: z.boolean().default(false),
  affiliateOfferId: z.string().nullable().default(null),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type CasinoListing = z.infer<typeof CasinoListingSchema>;

export interface B2BDataProvider {
  getAllListings(): CasinoListing[];
  getListingById(id: string): CasinoListing | undefined;
  getListingByBrand(brandName: string): CasinoListing | undefined;
  getListingsByStatus(status: ListingStatus): CasinoListing[];
  getListingsByGeo(geo: string): CasinoListing[];
  getListingsByPlan(plan: ListingPlan): CasinoListing[];
  getPublishedListings(): CasinoListing[];
  getFeaturedListings(): CasinoListing[];
  getPremiumListings(): CasinoListing[];
  createListing(data: Omit<CasinoListing, "id" | "createdAt" | "updatedAt">): CasinoListing;
  updateListing(id: string, updates: Partial<CasinoListing>): CasinoListing | null;
  deleteListing(id: string): boolean;
}
