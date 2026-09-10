import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "CasinoLynora terms of use. Read our terms and conditions for using this website.",
  alternates: { canonical: "https://casinolynora.com/terms" },
};

export default function TermsPage() {
  return (
    <Container className="py-12 lg:py-20 max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Terms of Use</h1>
      <p className="text-sm text-muted mb-8">Last updated: September 2026</p>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-3">1. Acceptance of Terms</h2>
          <p className="text-muted leading-relaxed">
            By accessing and using CasinoLynora (casinolynora.com), you agree to be bound by these Terms of Use.
            If you do not agree to these terms, please do not use our website.
          </p>
          <p className="text-muted leading-relaxed">
            This document does not constitute legal advice. We recommend consulting a qualified legal
            professional for compliance with applicable laws in your jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">2. Eligibility</h2>
          <p className="text-muted leading-relaxed">
            You must be at least 18 years old (or the minimum gambling age in your jurisdiction,
            whichever is higher) to use this website. By using CasinoLynora, you confirm that
            you meet the minimum age requirement.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">3. About CasinoLynora</h2>
          <p className="text-muted leading-relaxed">
            CasinoLynora is an independent casino comparison platform. We provide:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>Structured casino data and reviews</li>
            <li>AI-powered matching based on your preferences</li>
            <li>Comparison tools</li>
          </ul>
          <p className="text-muted leading-relaxed">
            We are not a casino operator and do not provide gambling services.
            We do not accept bets or wagers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">4. Affiliate Relationships</h2>
          <p className="text-muted leading-relaxed">
            CasinoLynora earns commissions through affiliate links. When you click on an affiliate
            link and register with a casino, we may receive a commission. This does not affect our
            ratings, reviews, or recommendations. Our matching algorithm uses structured data and
            deterministic scoring — affiliate relationships do not influence match results.
          </p>
          <p className="text-muted leading-relaxed">
            All affiliate links are clearly labeled. See our{' '}
            <Link href="/affiliate-disclosure" className="text-primary hover:underline">Affiliate Disclosure</Link>{' '}
            for full details.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">5. No Warranties</h2>
          <p className="text-muted leading-relaxed">
            Casino information is provided &quot;as is&quot; and &quot;as available.&quot; We strive for accuracy
            but do not guarantee that all information is current or error-free. Casino terms,
            bonuses, and availability can change without notice.
          </p>
          <p className="text-muted leading-relaxed">
            Always verify current terms directly with the casino before registering.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">6. Limitation of Liability</h2>
          <p className="text-muted leading-relaxed">
            CasinoLynora shall not be liable for any damages arising from:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>Use of or inability to use our website</li>
            <li>Decisions made based on casino information provided</li>
            <li>Experiences with third-party casino websites</li>
            <li>Losses from gambling activities</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">7. Responsible Gambling</h2>
          <p className="text-muted leading-relaxed">
            Gambling should be entertaining, not a way to make money. Never bet more than you
            can afford to lose. If you or someone you know has a gambling problem, please seek
            help. Visit our{' '}
            <Link href="/responsible-gambling" className="text-primary hover:underline">Responsible Gambling</Link>{' '}
            page for resources.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">8. Intellectual Property</h2>
          <p className="text-muted leading-relaxed">
            All content on CasinoLynora, including text, graphics, logos, and software, is
            the property of CasinoLynora and is protected by copyright and trademark laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">9. Changes to Terms</h2>
          <p className="text-muted leading-relaxed">
            We reserve the right to modify these terms at any time. Changes will be effective
            upon posting. Your continued use of the website constitutes acceptance of the
            modified terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">10. Contact</h2>
          <p className="text-muted leading-relaxed">
            For questions about these Terms, please contact us through our
            <Link href="/contact" className="text-primary hover:underline"> contact page</Link>.
          </p>
        </section>
      </div>
    </Container>
  );
}
