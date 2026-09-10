import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { AffiliateCTA } from "./AffiliateCTA";
import { AffiliateDisclosure } from "./AffiliateDisclosure";
import { TrustBadge } from "./TrustBadge";
import { KeyFacts } from "./KeyFacts";
import { FAQSection } from "./FAQSection";
import type { Casino } from "@/lib/types";

type CasinoReviewPageProps = {
  casino: Casino;
  geo?: string;
  baseUrl?: string;
};

export function CasinoReviewPage({ casino, geo: _geo = "INT", baseUrl = "" }: CasinoReviewPageProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      {/* Main content */}
      <div className="lg:col-span-2 space-y-8">
        {/* Header */}
        <div>
          <nav className="text-sm text-muted mb-4" aria-label="Breadcrumb">
            <Link href={baseUrl || "/"} className="hover:text-brand-700 transition-colors">Home</Link>
            <span className="mx-2 text-text-faint">/</span>
            <Link href={`${baseUrl}/casinos`} className="hover:text-brand-700 transition-colors">Casinos</Link>
            <span className="mx-2 text-text-faint">/</span>
            <span className="text-foreground font-medium">{casino.name}</span>
          </nav>

          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{casino.name}</h1>
          {casino.tagline && (
            <p className="text-muted text-lg mb-4">{casino.tagline}</p>
          )}
          <TrustBadge
            verificationStatus={casino.verificationStatus}
            lastVerifiedAt={casino.lastVerifiedAt}
          />
        </div>

        {/* Overview */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            Overview
          </h2>
          <div className="card-static p-6">
            <p className="text-muted leading-relaxed">{casino.review.overview}</p>
          </div>
        </section>

        {/* Payment Methods */}
        {casino.paymentMethods.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
              </svg>
              Payment Methods
            </h2>
            <div className="flex flex-wrap gap-2">
              {casino.paymentMethods.map((pm) => (
                <Badge key={pm.name} variant="default" size="md">
                  {pm.name}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {/* Verdict */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
            Verdict
          </h2>
          <div className="card-static p-6 border-l-4 border-l-brand-600">
            <p className="text-foreground leading-relaxed font-medium">{casino.review.verdict}</p>
          </div>
        </section>

        {/* Pros & Cons */}
        {(casino.review.pros.length > 0 || casino.review.cons.length > 0) && (
          <section>
            <h2 className="text-xl font-bold mb-4">Pros &amp; Cons</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {casino.review.pros.length > 0 && (
                <div className="card-static p-5">
                  <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Pros
                  </h3>
                  <ul className="space-y-2">
                    {casino.review.pros.map((pro, i) => (
                      <li key={i} className="text-sm text-muted flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">+</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {casino.review.cons.length > 0 && (
                <div className="card-static p-5">
                  <h3 className="text-sm font-bold text-red-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cons
                  </h3>
                  <ul className="space-y-2">
                    {casino.review.cons.map((con, i) => (
                      <li key={i} className="text-sm text-muted flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">−</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Responsible Gambling */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
            Responsible Gambling
          </h2>
          <div className="card-static p-5">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              {[
                { label: "Self-Exclusion", available: casino.responsibleGambling.selfExclusion },
                { label: "Deposit Limits", available: casino.responsibleGambling.depositLimits },
                { label: "Session Limits", available: casino.responsibleGambling.sessionLimits },
                { label: "Reality Check", available: casino.responsibleGambling.realityCheck },
                { label: "Cooling-Off Period", available: casino.responsibleGambling.coolingOffPeriod },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  {item.available ? (
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                    </svg>
                  )}
                  <span className={item.available ? "text-foreground" : "text-text-faint"}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        {casino.review.faq && casino.review.faq.length > 0 && (
          <FAQSection faqs={casino.review.faq} title={`${casino.name} — Frequently Asked Questions`} />
        )}

        {/* Methodology */}
        <section>
          <h2 className="text-xl font-bold mb-4">Our Methodology</h2>
          <div className="card-static p-6 text-sm text-muted leading-relaxed space-y-3">
            <p>
              Every CasinoLynora profile is built from structured, verified data. We clearly indicate
              when information was last verified and distinguish between editorial content and
              affiliate relationships.
            </p>
            <p>
              We do not publish fabricated reviews, fake testimonials, or unverifiable claims.
              If information has not been verified, we mark it accordingly.
            </p>
          </div>
        </section>
      </div>

      {/* Sidebar */}
      <div className="space-y-6">
        {/* CTA Card */}
        <div className="card-static p-6 sticky top-24">
          <AffiliateCTA
            affiliateOffers={casino.affiliateOffers}
            size="lg"
            fullWidth
          />
          <AffiliateDisclosure variant="inline" className="mt-4" />
        </div>

        {/* Key Facts */}
        <KeyFacts casino={casino} />
      </div>
    </div>
  );
}
