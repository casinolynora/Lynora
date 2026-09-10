import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Contact — CasinoLynora",
  description: "Get in touch with the CasinoLynora team.",
  alternates: { canonical: "https://casinolynora.com/contact" },
};

export default function ContactPage() {
  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Contact</h1>
          <p className="text-lg text-muted mb-10">
            Get in touch with the CasinoLynora team.
          </p>

          <div className="space-y-4">
            {[
              { label: "General Inquiries", email: "hello@casinolynora.com", description: "General questions and feedback" },
              { label: "Affiliate Partnerships", email: "affiliates@casinolynora.com", description: "Partnership and affiliate inquiries" },
              { label: "Data Corrections", email: "data@casinolynora.com", description: "Report incorrect casino data" },
              { label: "Responsible Gambling Support", email: "support@casinolynora.com", description: "Gambling-related support inquiries" },
            ].map((item) => (
              <a
                key={item.email}
                href={`mailto:${item.email}`}
                className="card-static p-5 flex items-center justify-between hover:border-brand-200 transition-colors group"
              >
                <div>
                  <h3 className="font-bold text-sm group-hover:text-brand-700 transition-colors">{item.label}</h3>
                  <p className="text-xs text-muted">{item.description}</p>
                </div>
                <span className="text-sm text-brand-700 font-medium">{item.email}</span>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </main>
  );
}
