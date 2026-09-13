import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { CONTACT_EMAILS } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Terms of Use — CasinoLynora",
  description: "CasinoLynora terms of use. Rules and responsibilities for using our platform.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Terms of Use</h1>
          <p className="text-sm text-muted mb-8">Last updated: September 2026</p>

          <div className="space-y-10 text-muted leading-relaxed">
            {/* 1. Acceptance of Terms */}
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-3">
                By accessing or using CasinoLynora (the &quot;Website&quot;), you agree to be bound by
                these Terms of Use. If you do not agree to all of these terms, you must not use the
                Website. Your continued use of the Website following the posting of any changes to
                these terms constitutes acceptance of those changes.
              </p>
              <p>
                You represent that you are at least 18 years of age (or the legal gambling age in
                your jurisdiction, whichever is higher). If you are using the Website on behalf of
                an organization, you represent that you have the authority to bind that organization
                to these terms.
              </p>
            </section>

            {/* 2. Website Purpose */}
            <section>
              <h2 className="text-2xl font-bold mb-4">2. Website Purpose</h2>
              <p className="mb-3">
                CasinoLynora is an informational casino comparison and matching platform. We provide
                structured data about online casinos and use a matching algorithm to help users
                identify casinos that may suit their preferences based on publicly available
                information such as country availability, payment methods, game libraries, and
                deposit limits.
              </p>
              <p className="mb-3">
                CasinoLynora does not operate any casino, sportsbook, or gambling service. We do
                not accept, facilitate, or process any bets, wagers, or financial transactions
                between users and casino operators. We are not a gambling operator, payment
                processor, or financial institution.
              </p>
              <p>
                The Website serves solely as an informational resource to help users compare
                publicly available casino information. Any decision to register with, deposit
                money at, or place bets with a third-party casino operator is made entirely at
                your own discretion and risk.
              </p>
            </section>

            {/* 3. Informational Nature */}
            <section>
              <h2 className="text-2xl font-bold mb-4">3. Informational Nature of Content</h2>
              <p className="mb-3">
                All content on CasinoLynora, including casino data, scores, match results, reviews,
                descriptions, and editorial content, is provided for informational and comparison
                purposes only. This content does not constitute gambling advice, financial advice,
                legal advice, or any other form of professional advice.
              </p>
              <p className="mb-3">
                While we strive to maintain accurate and up-to-date information, the online gambling
                industry changes rapidly. Casino offerings, bonuses, terms, availability, payment
                methods, and regulatory status can change without notice. We do not guarantee that
                the information presented on the Website is current, complete, or accurate at any
                given time.
              </p>
              <p>
                You should not rely on the information provided by CasinoLynora as the sole basis
                for any decision. Always verify directly with the casino operator before registering
                an account, depositing funds, or placing any bets.
              </p>
            </section>

            {/* 4. Affiliate Disclosure */}
            <section>
              <h2 className="text-2xl font-bold mb-4">4. Affiliate Disclosure</h2>
              <p className="mb-3">
                CasinoLynora participates in affiliate marketing programs. Some of the links on the
                Website are affiliate links, meaning that if you click on such a link and sign up
                or make a purchase at the linked casino operator, CasinoLynora may earn a
                commission from the operator.
              </p>
              <p className="mb-3">
                These affiliate relationships do not influence the data we present, the scores we
                assign, or the results our matching algorithm produces. Our matching methodology is
                based entirely on structured, verified casino data points and is not influenced by
                affiliate commission rates or commercial arrangements with any operator.
              </p>
              <p>
                For full details on how affiliate relationships work, see our{" "}
                <Link href="/affiliate-disclosure" className="text-brand-700 hover:underline">
                  Affiliate Disclosure
                </Link>{" "}
                page.
              </p>
            </section>

            {/* 5. Accuracy of Information */}
            <section>
              <h2 className="text-2xl font-bold mb-4">5. Accuracy of Information</h2>
              <p className="mb-3">
                We make reasonable efforts to ensure the information presented on CasinoLynora is
                accurate and based on publicly available data. However, we do not warrant or
                guarantee the accuracy, completeness, reliability, or timeliness of any
                information provided on the Website.
              </p>
              <p className="mb-3">
                Casino data may contain errors, omissions, or outdated information. Bonus offers,
                promotional terms, game availability, and regulatory status can change at any time
                and may not be reflected immediately on our platform.
              </p>
              <p>
                It is your responsibility to verify all information directly with the relevant
                casino operator before making any decisions. CasinoLynora shall not be held
                responsible for any inaccuracies in the information we present or for any decisions
                you make based on that information.
              </p>
            </section>

            {/* 6. Third-Party Websites */}
            <section>
              <h2 className="text-2xl font-bold mb-4">6. Third-Party Websites</h2>
              <p className="mb-3">
                The Website contains links to third-party casino websites and other external
                resources. These links are provided for your convenience and informational purposes
                only. The inclusion of any link does not imply endorsement, recommendation, or
                approval by CasinoLynora of the linked website or its operators.
              </p>
              <p className="mb-3">
                CasinoLynora has no control over, and assumes no responsibility for, the content,
                privacy policies, practices, availability, or legality of any third-party websites.
                We do not monitor or review the content of third-party websites and are not
                responsible for any information, materials, or services provided by such websites.
              </p>
              <p>
                When you follow a link to a third-party website, you leave the CasinoLynora
                platform and do so entirely at your own risk. You should review the terms of use
                and privacy policies of any third-party website you visit.
              </p>
            </section>

            {/* 7. Responsible Gambling */}
            <section>
              <h2 className="text-2xl font-bold mb-4">7. Responsible Gambling</h2>
              <p className="mb-3">
                Gambling involves financial risk and can be addictive. CasinoLynora strongly
                encourages all users to gamble responsibly and only with money they can afford to
                lose. Gambling should be a form of entertainment, not a way to generate income or
                solve financial problems.
              </p>
              <p className="mb-3">
                It is your responsibility to ensure that online gambling is legal in your
                jurisdiction before using the Website or engaging with any third-party casino
                operator. Laws and regulations regarding online gambling vary by country and region.
                CasinoLynora does not provide legal advice and is not responsible for ensuring your
                compliance with applicable laws.
              </p>
              <p>
                If you believe you may have a gambling problem, please seek help immediately. Visit{" "}
                <Link href="/responsible-gambling" className="text-brand-700 hover:underline">
                  our responsible gambling page
                </Link>{" "}
                for resources, support organizations, and tips for safe play.
              </p>
            </section>

            {/* 8. Prohibited Misuse */}
            <section>
              <h2 className="text-2xl font-bold mb-4">8. Prohibited Misuse</h2>
              <p className="mb-3">
                When using CasinoLynora, you agree not to:
              </p>
              <ul className="space-y-2 mb-3 pl-4">
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    Scrape, crawl, or use any automated means to extract data from the Website,
                    including but not limited to bots, scripts, spiders, or web scrapers, without
                    our prior written consent.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    Attempt to gain unauthorized access to the Website, its servers, databases, or
                    any systems or networks connected to the Website.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    Use the Website or its content in any manner that is misleading, fraudulent,
                    deceptive, or that misrepresents the source, affiliation, or nature of the
                    information provided.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    Redistribute, republish, or commercially exploit CasinoLynora content without
                    written permission.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    Interfere with or disrupt the functionality, integrity, or performance of the
                    Website or any related infrastructure.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    Use the Website to transmit any malware, viruses, or other harmful code.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-0.5">•</span>
                  <span>
                    Use the Website for any purpose that violates applicable local, national, or
                    international laws or regulations.
                  </span>
                </li>
              </ul>
              <p>
                We reserve the right to restrict or terminate your access to the Website at any
                time, without notice, for conduct that we believe violates these Terms of Use or is
                harmful to the Website, its users, or third parties.
              </p>
            </section>

            {/* 9. Intellectual Property */}
            <section>
              <h2 className="text-2xl font-bold mb-4">9. Intellectual Property</h2>
              <p className="mb-3">
                All content on the CasinoLynora website, including but not limited to text,
                graphics, logos, icons, images, data compilations, software, code, page layout,
                design, and the matching algorithm, is the property of CasinoLynora or its content
                providers and is protected by applicable intellectual property laws, including
                copyright and trademark laws.
              </p>
              <p className="mb-3">
                You may view and access the Website for personal, non-commercial informational
                purposes. You may not reproduce, distribute, modify, create derivative works of,
                publicly display, publicly perform, republish, download, store, or transmit any
                content from the Website without prior written permission from CasinoLynora.
              </p>
              <p>
                The CasinoLynora name, logo, and all related marks are trademarks of CasinoLynora.
                You may not use these marks without our prior written consent.
              </p>
            </section>

            {/* 10. Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-bold mb-4">10. Limitation of Liability</h2>
              <p className="mb-3">
                To the maximum extent permitted by applicable law, CasinoLynora, its affiliates,
                officers, directors, employees, and agents shall not be liable for any indirect,
                incidental, special, consequential, or punitive damages, including but not limited
                to losses of money, data, profits, or goodwill, arising out of or in connection
                with your use of or inability to use the Website.
              </p>
              <p className="mb-3">
                Without limiting the foregoing, CasinoLynora shall not be liable for any losses
                incurred through gambling activities at third-party casino operators, including
                but not limited to losses from bets, wagers, deposits, withdrawals, or any other
                financial transactions with such operators.
              </p>
              <p className="mb-3">
                The Website and all content are provided on an &quot;as is&quot; and &quot;as
                available&quot; basis without warranties of any kind, either express or implied,
                including but not limited to implied warranties of merchantability, fitness for a
                particular purpose, or non-infringement.
              </p>
              <p>
                CasinoLynora does not warrant that the Website will be uninterrupted, error-free,
                secure, or free of viruses or other harmful components. Your use of the Website is
                at your own risk.
              </p>
            </section>

            {/* 11. Changes to Terms */}
            <section>
              <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
              <p className="mb-3">
                We reserve the right to modify, amend, or update these Terms of Use at any time
                and at our sole discretion. When we make changes, we will update the &quot;Last
                updated&quot; date at the top of this page.
              </p>
              <p>
                It is your responsibility to review these Terms of Use periodically for changes.
                Your continued use of the Website after any changes to these terms constitutes your
                acceptance of the revised terms. If you do not agree to the modified terms, you
                must stop using the Website immediately.
              </p>
            </section>

            {/* 12. Contact */}
            <section>
              <h2 className="text-2xl font-bold mb-4">12. Contact</h2>
              <p>
                If you have any questions, concerns, or feedback regarding these Terms of Use or
                any aspect of the CasinoLynora platform, please contact us at{" "}
                <a
                  href={`mailto:${CONTACT_EMAILS.general}`}
                  className="text-brand-700 hover:underline"
                >
                  {CONTACT_EMAILS.general}
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
