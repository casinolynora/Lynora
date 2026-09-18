const RESOLVED_URL =
  process.env.NEXT_PUBLIC_CANONICAL_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://beincasinos.com";

export const SITE_URL = RESOLVED_URL.replace(/\/+$/, "");

export const SITE_NAME = "BeInCasinos";

export const CONTACT_EMAILS = {
  general: "hello@beincasinos.com",
  affiliates: "affiliates@beincasinos.com",
  data: "data@beincasinos.com",
  support: "support@beincasinos.com",
} as const;

export function siteUrl(path: string = ""): string {
  if (!path) return SITE_URL;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}
