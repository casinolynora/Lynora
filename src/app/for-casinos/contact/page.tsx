import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CONTACT_EMAILS } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Casino Operator Contact | CasinoLynora",
  description:
    "Contact CasinoLynora for casino operator inquiries, data corrections, affiliate partnerships, and general business questions.",
  alternates: { canonical: "/for-casinos/contact" },
};

export default function ForCasinosContactPage() {
  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Casino Operator Contact
          </h1>
          <p className="text-lg text-muted mb-4">
            This page is for casino operators, affiliate managers, and business
            partners who want to get in touch with CasinoLynora. Whether you
            need to correct listing data, discuss a partnership, or have a
            general business inquiry, we are here to help.
          </p>

          <p className="text-sm text-muted mb-10">
            We aim to respond within <strong>5 business days</strong>.
            Response times may be longer during periods of high volume.
          </p>

          <div className="space-y-4">
            <a
              href={`mailto:${CONTACT_EMAILS.affiliates}`}
              className="card-static p-5 flex items-center justify-between hover:border-brand-200 transition-colors group"
            >
              <div>
                <h3 className="font-bold text-sm group-hover:text-brand-700 transition-colors">
                  General Inquiries
                </h3>
                <p className="text-xs text-muted">
                  Partnership proposals, operator questions, and commercial
                  inquiries.
                </p>
              </div>
              <span className="text-sm text-brand-700 font-medium">
                {CONTACT_EMAILS.affiliates}
              </span>
            </a>

            <a
              href={`mailto:${CONTACT_EMAILS.data}`}
              className="card-static p-5 flex items-center justify-between hover:border-brand-200 transition-colors group"
            >
              <div>
                <h3 className="font-bold text-sm group-hover:text-brand-700 transition-colors">
                  Data Corrections
                </h3>
                <p className="text-xs text-muted">
                  Report incorrect or outdated casino data, licence information,
                  or bonus details.
                </p>
              </div>
              <span className="text-sm text-brand-700 font-medium">
                {CONTACT_EMAILS.data}
              </span>
            </a>
          </div>

          <div className="mt-10 card-static p-6">
            <h2 className="font-bold text-sm mb-2">
              Want Your Casino Listed?
            </h2>
            <p className="text-sm text-muted">
              If you would like to apply for a listing on CasinoLynora, visit
              our{" "}
              <a
                href="/for-casinos/list-your-casino"
                className="text-brand-700 font-medium hover:underline"
              >
                List Your Casino
              </a>{" "}
              page to submit an application.
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
