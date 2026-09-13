import type {
  CasinoListing,
  OperatorSubmission,
  ListingStatus,
  ListingVisibility,
  ListingPlan,
  SubmissionStatus,
} from "./types";

const submissions: OperatorSubmission[] = [];
const listings: CasinoListing[] = [];

export function getPendingSubmissions(): OperatorSubmission[] {
  return submissions.filter((s) => s.status === "pending");
}

export function getSubmissionById(id: string): OperatorSubmission | undefined {
  return submissions.find((s) => s.id === id);
}

export function createSubmission(data: Omit<OperatorSubmission, "id" | "status" | "createdAt" | "updatedAt">): OperatorSubmission {
  const now = new Date().toISOString();
  const submission: OperatorSubmission = {
    ...data,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: now,
    updatedAt: now,
  };
  submissions.push(submission);
  return submission;
}

export function approveSubmission(id: string): OperatorSubmission | null {
  const sub = submissions.find((s) => s.id === id);
  if (!sub) return null;
  sub.status = "approved";
  sub.updatedAt = new Date().toISOString();
  return sub;
}

export function rejectSubmission(id: string): OperatorSubmission | null {
  const sub = submissions.find((s) => s.id === id);
  if (!sub) return null;
  sub.status = "rejected";
  sub.updatedAt = new Date().toISOString();
  return sub;
}

export function getAllListings(): CasinoListing[] {
  return [...listings];
}

export function getListingById(id: string): CasinoListing | undefined {
  return listings.find((l) => l.id === id);
}

export function getPublishedListings(): CasinoListing[] {
  return listings.filter(
    (l) => l.listing.listingStatus === "approved" && l.listing.listingVisibility === "published"
  );
}

export function getFeaturedListings(): CasinoListing[] {
  return getPublishedListings().filter(
    (l) => l.listing.featured || l.listing.listingPlan === "featured" || l.listing.listingPlan === "premium"
  );
}

export function getPremiumListings(): CasinoListing[] {
  return getPublishedListings().filter(
    (l) => l.listing.premium || l.listing.listingPlan === "premium"
  );
}

export function getListingsByGeo(geo: string): CasinoListing[] {
  return getPublishedListings().filter((l) => l.targetGeos.includes(geo));
}

export function getListingsByPlan(plan: ListingPlan): CasinoListing[] {
  return listings.filter((l) => l.listing.listingPlan === plan);
}

export function publishCasinoListing(id: string): CasinoListing | null {
  const listing = listings.find((l) => l.id === id);
  if (!listing) return null;
  listing.listing.listingVisibility = "published";
  listing.listing.listedAt = new Date().toISOString();
  listing.updatedAt = new Date().toISOString();
  return listing;
}

export function unpublishCasinoListing(id: string): CasinoListing | null {
  const listing = listings.find((l) => l.id === id);
  if (!listing) return null;
  listing.listing.listingVisibility = "hidden";
  listing.updatedAt = new Date().toISOString();
  return listing;
}

export function setCasinoListingPlan(id: string, plan: ListingPlan): CasinoListing | null {
  const listing = listings.find((l) => l.id === id);
  if (!listing) return null;
  listing.listing.listingPlan = plan;
  listing.updatedAt = new Date().toISOString();
  return listing;
}

export function setCasinoFeatured(id: string, featured: boolean): CasinoListing | null {
  const listing = listings.find((l) => l.id === id);
  if (!listing) return null;
  listing.listing.featured = featured;
  listing.updatedAt = new Date().toISOString();
  return listing;
}

export function setCasinoPremium(id: string, premium: boolean): CasinoListing | null {
  const listing = listings.find((l) => l.id === id);
  if (!listing) return null;
  listing.listing.premium = premium;
  listing.updatedAt = new Date().toISOString();
  return listing;
}

export function setCasinoSponsored(id: string, sponsored: boolean): CasinoListing | null {
  const listing = listings.find((l) => l.id === id);
  if (!listing) return null;
  listing.listing.sponsored = sponsored;
  listing.updatedAt = new Date().toISOString();
  return listing;
}

export function verifyCasino(id: string): CasinoListing | null {
  const listing = listings.find((l) => l.id === id);
  if (!listing) return null;
  listing.listing.listingStatus = "approved";
  listing.updatedAt = new Date().toISOString();
  return listing;
}

export function setListingStatus(id: string, status: ListingStatus): CasinoListing | null {
  const listing = listings.find((l) => l.id === id);
  if (!listing) return null;
  listing.listing.listingStatus = status;
  listing.updatedAt = new Date().toISOString();
  return listing;
}

export function setListingVisibility(id: string, visibility: ListingVisibility): CasinoListing | null {
  const listing = listings.find((l) => l.id === id);
  if (!listing) return null;
  listing.listing.listingVisibility = visibility;
  listing.updatedAt = new Date().toISOString();
  return listing;
}

export function notifyOperatorSubmission(submission: OperatorSubmission): void {
  console.log(`[B2B] New operator submission from ${submission.businessEmail} for ${submission.brandName}`);
}
