const RESOLVED_URL =
  process.env.NEXT_PUBLIC_CANONICAL_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://casinolynora.com";

export const SITE_URL = RESOLVED_URL.replace(/\/+$/, "");

export const SITE_NAME = "CasinoLynora";

export const CONTACT_EMAILS = {
  general: "hello@casinolynora.com",
  affiliates: "affiliates@casinolynora.com",
  data: "data@casinolynora.com",
  support: "support@casinolynora.com",
} as const;

export function siteUrl(path: string = ""): string {
  if (!path) return SITE_URL;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean}`;
}
