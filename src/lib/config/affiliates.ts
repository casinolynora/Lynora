export interface AffiliateOfferConfig {
  id: string;
  name: string;
  geo: string;
  trackingUrl: string;
  subSources: Record<string, string>;
  minDeposit: string;
  payout: string;
  flow: string;
  cap: string;
  allowedChannels: string[];
  restrictedChannels: string[];
  enabled: boolean;
}

export const AFFILIATE_CONFIG: Record<string, AffiliateOfferConfig> = {
  binobet_ie: {
    id: "binobet_ie",
    name: "Binobet",
    geo: "IE",
    trackingUrl: "",
    subSources: {
      review: "bino-review",
      bonus: "bino-bonus",
      payment: "bino-payment",
      mobile: "bino-mobile",
      matchmaker: "bino-match",
    },
    minDeposit: "€20",
    payout: "$190",
    flow: "FTD",
    cap: "10 FTD per affiliate (initial)",
    allowedChannels: ["PPC/Search", "Review Site/Blog", "SEO/SEM", "SMS", "Contextual", "Email"],
    restrictedChannels: ["Native", "Push", "Pop/Redirect", "Banner/Display", "Incentivized", "Retargeting", "Social", "TikTok", "YouTube"],
    enabled: false,
  },
};

export function getActiveOffers(geo: string): AffiliateOfferConfig[] {
  return Object.values(AFFILIATE_CONFIG).filter(
    (o) => o.enabled && (o.geo === geo || o.geo === "INT")
  );
}

export function getTrackingUrl(
  offerId: string,
  subSource: string,
  additionalParams?: Record<string, string>
): string | null {
  const offer = AFFILIATE_CONFIG[offerId];
  if (!offer || !offer.enabled || !offer.trackingUrl) return null;

  const url = new URL(offer.trackingUrl);
  url.searchParams.set("s1", subSource);

  if (additionalParams) {
    for (const [key, value] of Object.entries(additionalParams)) {
      url.searchParams.set(key, value);
    }
  }

  return url.toString();
}
