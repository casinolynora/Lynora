import { z } from "zod";
import { OperatorSubmissionSchema, ListingPlanSchema } from "./types";

export const SubmitListingRequestSchema = z.object({
  brandName: z.string().min(1, "Brand name is required").max(200),
  officialWebsite: z.string().url("Must be a valid URL"),
  operatorName: z.string().min(1, "Operator name is required").max(200),
  contactName: z.string().min(1, "Contact name is required").max(200),
  businessEmail: z.string().email("Must be a valid email address"),
  targetGeos: z.array(z.string().min(2).max(2)).min(1, "Select at least one GEO"),
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
});

export type SubmitListingRequest = z.infer<typeof SubmitListingRequestSchema>;

export interface SubmissionResult {
  success: boolean;
  submissionId?: string;
  errors?: Array<{ field: string; message: string }>;
}

export function validateSubmission(data: unknown): { success: boolean; data?: SubmitListingRequest; errors: Array<{ field: string; message: string }> } {
  const result = SubmitListingRequestSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data, errors: [] };
  }
  const errors = result.error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
  return { success: false, errors };
}

export function isSpamSubmission(data: SubmitListingRequest): boolean {
  const spamIndicators = [
    /\b(buy|cheap|discount|free money|casino bonus|no deposit bonus)\b/i.test(data.message || ""),
    data.brandName.length < 2,
    !data.officialWebsite.startsWith("https://"),
  ];
  return spamIndicators.some(Boolean);
}

export const VALID_GEOS_FOR_LISTING = ["IE", "DE", "NL", "BE", "FR", "IT", "AT", "CH"] as const;
