import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "CasinoLynora privacy policy. Learn how we handle your data and protect your privacy.",
  alternates: { canonical: "https://casinolynora.com/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-12 lg:py-20 max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-sm text-muted mb-8">Last updated: September 2026</p>

      <div className="prose prose-gray max-w-none space-y-6">
        <section>
          <h2 className="text-2xl font-bold mb-3">1. Introduction</h2>
          <p className="text-muted leading-relaxed">
            CasinoLynora (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the casinolynora.com website.
            This Privacy Policy explains how we collect, use, and protect your information when you visit our website.
          </p>
          <p className="text-muted leading-relaxed">
            This policy does not constitute legal advice. We recommend consulting a qualified legal professional
            for compliance with applicable data protection laws in your jurisdiction.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">2. Information We Collect</h2>
          <p className="text-muted leading-relaxed">
            We collect information you provide directly and information collected automatically:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>Usage data (pages visited, features used, match preferences)</li>
            <li>Device information (browser type, operating system)</li>
            <li>Analytics data (anonymized, via Google Analytics if configured)</li>
          </ul>
          <p className="text-muted leading-relaxed">
            We do not collect personally identifiable information unless you voluntarily provide it
            (e.g., via contact form). We do not collect payment information.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>To provide and improve our casino matching service</li>
            <li>To analyze usage patterns and improve user experience</li>
            <li>To detect and prevent abuse</li>
            <li>To comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">4. Cookies</h2>
          <p className="text-muted leading-relaxed">
            We use essential cookies for website functionality. If Google Analytics is enabled,
            GA4 uses cookies to collect anonymized usage data. You can control cookies through
            your browser settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">5. Third-Party Services</h2>
          <p className="text-muted leading-relaxed">
            We use the following third-party services:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>Google Analytics (if configured) — for anonymized usage analytics</li>
            <li>OpenAI (if configured) — for AI-powered casino explanations</li>
          </ul>
          <p className="text-muted leading-relaxed">
            Affiliate links redirect you to third-party casino websites. Their privacy policies
            apply after you leave our site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">6. Data Retention</h2>
          <p className="text-muted leading-relaxed">
            We retain usage data for as long as necessary to provide our services.
            Analytics data is retained according to Google Analytics default settings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">7. Your Rights</h2>
          <p className="text-muted leading-relaxed">
            Depending on your jurisdiction, you may have the right to:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>Access the data we hold about you</li>
            <li>Request deletion of your data</li>
            <li>Object to processing of your data</li>
            <li>Data portability</li>
          </ul>
          <p className="text-muted leading-relaxed">
            To exercise these rights, please contact us at the address below.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">8. Children&apos;s Privacy</h2>
          <p className="text-muted leading-relaxed">
            Our service is not intended for users under 18 years of age. We do not knowingly
            collect information from children.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">9. Changes to This Policy</h2>
          <p className="text-muted leading-relaxed">
            We may update this Privacy Policy from time to changes. Changes will be posted on this page
            with an updated &quot;Last updated&quot; date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">10. Contact</h2>
          <p className="text-muted leading-relaxed">
            For questions about this Privacy Policy, please contact us through our
            <Link href="/contact" className="text-primary hover:underline"> contact page</Link>.
          </p>
        </section>
      </div>
    </Container>
  );
}
