import Link from "next/link";
import { cn } from "@/lib/utils/format";

const GEO_MAP: Record<string, { name: string; flag: string; slug: string }> = {
  DE: { name: "Germany", flag: "🇩🇪", slug: "de" },
  NL: { name: "Netherlands", flag: "🇳🇱", slug: "nl" },
  BE: { name: "Belgium", flag: "🇧🇪", slug: "be" },
  FR: { name: "France", flag: "🇫🇷", slug: "fr" },
  AT: { name: "Austria", flag: "🇦🇹", slug: "at" },
  IT: { name: "Italy", flag: "🇮🇹", slug: "it" },
  CH: { name: "Switzerland", flag: "🇨🇭", slug: "ch" },
  IE: { name: "Ireland", flag: "🇮🇪", slug: "ie" },
};

type CasinoEntityLinksProps = {
  countries: string[];
  paymentMethodNames: string[];
  className?: string;
};

export function CasinoEntityLinks({
  countries,
  paymentMethodNames,
  className,
}: CasinoEntityLinksProps) {
  const geoLinks = countries
    .map((code) => GEO_MAP[code])
    .filter(Boolean);

  if (geoLinks.length === 0 && paymentMethodNames.length === 0) return null;

  return (
    <section className={cn("mb-8", className)} aria-labelledby="entity-links-title">
      <h2
        id="entity-links-title"
        className="text-xl font-bold mb-4 flex items-center gap-2"
      >
        <svg
          className="w-5 h-5 text-brand-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016A3.001 3.001 0 0021 9.349"
          />
        </svg>
        Available In &amp; Payments
      </h2>

      <div className="card-static p-6 space-y-4">
        {/* Country/GEO links */}
        {geoLinks.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
              Countries
            </h3>
            <div className="flex flex-wrap gap-2">
              {geoLinks.map((geo) => (
                <Link
                  key={geo.slug}
                  href={`/${geo.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full border border-border-subtle bg-surface hover:bg-surface-elevated hover:border-brand-300 transition-colors"
                >
                  <span>{geo.flag}</span>
                  <span>{geo.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Payment method summary */}
        {paymentMethodNames.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-2">
              Payment Methods
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {paymentMethodNames.map((name) => (
                <span
                  key={name}
                  className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-surface border border-border-subtle text-muted"
                >
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
