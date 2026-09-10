export function formatCurrency(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("en-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatRelativeDate(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function slugToTitle(slug: string): string {
  return slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

export function getCountryFlag(countryCode: string): string {
  const code = countryCode === "INT" ? "EU" : countryCode;
  return code
    .toUpperCase()
    .split("")
    .map(char => String.fromCodePoint(0x1F1E6 + char.charCodeAt(0) - 65))
    .join("");
}

export function getRatingColor(rating: number): string {
  if (rating >= 90) return "text-emerald-600";
  if (rating >= 80) return "text-green-600";
  if (rating >= 70) return "text-yellow-600";
  if (rating >= 60) return "text-orange-600";
  return "text-red-600";
}

export function getRatingBg(rating: number): string {
  if (rating >= 90) return "bg-emerald-100 text-emerald-800";
  if (rating >= 80) return "bg-green-100 text-green-800";
  if (rating >= 70) return "bg-yellow-100 text-yellow-800";
  if (rating >= 60) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}
