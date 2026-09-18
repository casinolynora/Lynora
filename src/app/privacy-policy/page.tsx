import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CONTACT_EMAILS } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy — BeInCasinos",
  description: "BeInCasinos privacy policy. How we collect, use, and protect your data.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "Privacy Policy — BeInCasinos",
    description: "BeInCasinos privacy policy.",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy — BeInCasinos",
    description: "BeInCasinos privacy policy.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Privacy Policy</h1>
          <p className="text-sm text-muted mb-8">Last updated: September 2026</p>

          <div className="space-y-8 text-muted leading-relaxed">
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">1. Introduction</h2>
              <p>
                BeInCasinos is an informational casino comparison and matching platform. We help you
                find casinos that match your preferences by processing the answers you provide in our
                questionnaire and comparing them against our structured casino database. We do not
                operate, manage, or have any business relationship with the casinos listed on our
                site.
              </p>
              <p className="mt-3">
                This privacy policy explains what information we collect, how we use it, and what
                rights you have. It applies to all visitors of BeInCasinos. By using our site, you
                acknowledge that you have read and understood this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">2. Information We Collect</h2>
              <p>
                We collect very little personal information. BeInCasinos does not require account
                creation, and we do not maintain user accounts or profiles.
              </p>

              <h3 className="text-lg font-semibold mt-5 mb-2 text-foreground">
                Information you provide directly
              </h3>
              <p>
                If you contact us via email, we collect your email address and the contents of your
                message solely for the purpose of responding to your inquiry.
              </p>

              <h3 className="text-lg font-semibold mt-5 mb-2 text-foreground">
                Matchmaking questionnaire responses
              </h3>
              <p>
                The preferences you enter during the matching process (such as preferred game types,
                payment methods, and budget ranges) are processed in-memory to generate your results.
                These responses are not stored in any database, linked to your identity, or retained
                after your session ends.
              </p>

              <h3 className="text-lg font-semibold mt-5 mb-2 text-foreground">
                Automatically collected technical information
              </h3>
              <p>
                Our hosting provider (Vercel) automatically collects certain technical data in server
                logs when you visit the site. This includes your IP address, browser type and version,
                operating system, the pages you visit, the date and time of your visit, and the
                referring URL. This information is used for security, debugging, and ensuring the site
                functions correctly. Server logs are retained for a limited period and are not used
                for tracking or profiling.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">3. Cookies and Similar Technologies</h2>
              <p>
                BeInCasinos uses a minimal number of cookies, and none of them are used for tracking
                or advertising purposes.
              </p>

              <h3 className="text-lg font-semibold mt-5 mb-2 text-foreground">Essential cookies</h3>
              <p>
                We store your cookie consent preference in your browser&apos;s local storage. This allows
                us to remember whether you have accepted or declined non-essential cookies so that we
                do not prompt you repeatedly. This data never leaves your device and is not sent to
                any server.
              </p>

              <h3 className="text-lg font-semibold mt-5 mb-2 text-foreground">No tracking cookies</h3>
              <p>
                We do not currently use any analytics, advertising, or third-party tracking cookies.
                If we add such technologies in the future, we will update this policy and obtain your
                consent before any non-essential cookies are set.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">4. Analytics</h2>
              <p>
                BeInCasinos does not currently use any analytics service. No Google Analytics,
                Plausible, Matomo, or any other analytics platform is connected to this site. We do
                not use any pixel tags, web beacons, or similar tracking technologies.
              </p>
              <p className="mt-3">
                If we decide to add an analytics service in the future, we will implement it only
                after obtaining your explicit consent through our cookie consent mechanism. We will
                update this privacy policy to reflect any such changes before they take effect.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">5. Affiliate Links</h2>
              <p>
                BeInCasinos is a free service supported in part through affiliate partnerships.
                Some of the links on our site are affiliate links, meaning that if you click on
                such a link and subsequently sign up or make a deposit at a casino, we may receive
                a commission from that casino.
              </p>
              <p className="mt-3">
                Affiliate links do not affect what information we collect. We do not receive any
                personal information about you from our affiliate partners. The commission is based
                on your registration or activity at the casino, not on any data we share with them.
                We do not sell, trade, or share your personal information with affiliate partners.
              </p>
              <p className="mt-3">
                Our editorial recommendations are independent of any affiliate arrangements. A
                casino&apos;s presence on our site or its position in match results is determined by our
                matching algorithm, not by affiliate relationships.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">6. Third-Party Services</h2>
              <p>We use a limited number of third-party services to operate this site:</p>

              <h3 className="text-lg font-semibold mt-5 mb-2 text-foreground">Vercel (hosting)</h3>
              <p>
                BeInCasinos is hosted on Vercel, which provides our infrastructure and CDN. Vercel
                automatically collects server logs including IP addresses, browser information, and
                request metadata for security and performance purposes. Vercel processes this data
                in accordance with their privacy policy.
              </p>

              <h3 className="text-lg font-semibold mt-5 mb-2 text-foreground">Email</h3>
              <p>
                If you contact us by email, your message and email address are handled by our email
                provider. We use this information solely to respond to your inquiry and do not use
                your email for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">7. Data Retention</h2>
              <p>
                We retain data only as long as necessary for the purposes described in this policy:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>
                  <strong>Server logs</strong> are retained for a limited period (typically no longer
                  than 30 days) for security and debugging purposes, after which they are
                  automatically deleted.
                </li>
                <li>
                  <strong>Contact emails</strong> are retained until your inquiry has been resolved,
                  after which they may be kept for a reasonable period for record-keeping before
                  being deleted.
                </li>
                <li>
                  <strong>Matchmaking responses</strong> are processed in-memory and not stored after
                  your session ends.
                </li>
                <li>
                  <strong>Cookie consent state</strong> is stored in your browser&apos;s local storage
                  until you clear it or until the consent mechanism is updated.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">8. Your Rights</h2>
              <p>
                Depending on your jurisdiction, you may have the following rights regarding your
                personal data:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>
                  <strong>Right of access</strong> — You have the right to request a copy of the
                  personal data we hold about you.
                </li>
                <li>
                  <strong>Right to rectification</strong> — You have the right to request that we
                  correct any inaccurate personal data.
                </li>
                <li>
                  <strong>Right to erasure</strong> — You have the right to request that we delete
                  your personal data, subject to certain legal exceptions.
                </li>
                <li>
                  <strong>Right to withdraw consent</strong> — Where we rely on your consent to
                  process data, you may withdraw that consent at any time.
                </li>
                <li>
                  <strong>Right to lodge a complaint</strong> — You have the right to lodge a
                  complaint with your local data protection supervisory authority if you believe
                  your rights have been infringed.
                </li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, please contact us using the email address listed
                below. We will respond to your request within a reasonable timeframe.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">9. Children&apos;s Privacy</h2>
              <p>
                BeInCasinos is not directed at individuals under the age of 18. We do not
                knowingly collect personal information from children. If you are a parent or
                guardian and believe that your child has provided us with personal data, please
                contact us immediately so we can take steps to delete such information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">10. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time to reflect changes in our
                practices, legal requirements, or for other operational reasons. When we make
                material changes, we will update the &quot;Last updated&quot; date at the top of this
                page. We encourage you to review this policy periodically.
              </p>
              <p className="mt-3">
                Your continued use of BeInCasinos after any changes to this policy constitutes
                your acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">11. Contact</h2>
              <p>
                If you have any questions, concerns, or requests regarding this privacy policy or
                our data practices, please contact us at:
              </p>
              <p className="mt-3">
                <a
                  href={`mailto:${CONTACT_EMAILS.general}`}
                  className="text-brand-700 hover:underline"
                >
                  {CONTACT_EMAILS.general}
                </a>
              </p>
              <p className="mt-3">
                We aim to respond to all privacy-related inquiries within 30 days.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
