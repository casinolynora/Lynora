import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Contact CasinoLynora",
  description: "Get in touch with the CasinoLynora team for general inquiries, affiliate partnerships, or data corrections.",
  openGraph: {
    title: "Contact CasinoLynora",
    description: "Get in touch with the CasinoLynora team.",
  },
  twitter: {
    card: "summary",
    title: "Contact CasinoLynora",
    description: "Get in touch with the CasinoLynora team.",
  },
  alternates: { canonical: "https://casinolynora.com/contact" },
};

export default function ContactPage() {
  return (
    <Container className="py-12 lg:py-20 max-w-2xl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Contact Us</h1>
      <p className="text-muted mb-8">
        Have a question, suggestion, or need to get in touch? We would love to hear from you.
      </p>

      <div className="space-y-6">
        <div className="bg-surface-elevated rounded-xl p-6 border border-border">
          <h2 className="font-bold mb-2">General Inquiries</h2>
          <p className="text-sm text-muted mb-2">For general questions about CasinoLynora:</p>
          <a href="mailto:hello@casinolynora.com" className="text-primary hover:underline text-sm font-medium">
            hello@casinolynora.com
          </a>
        </div>

        <div className="bg-surface-elevated rounded-xl p-6 border border-border">
          <h2 className="font-bold mb-2">Affiliate Partnerships</h2>
          <p className="text-sm text-muted mb-2">Interested in working with us:</p>
          <a href="mailto:affiliates@casinolynora.com" className="text-primary hover:underline text-sm font-medium">
            affiliates@casinolynora.com
          </a>
        </div>

        <div className="bg-surface-elevated rounded-xl p-6 border border-border">
          <h2 className="font-bold mb-2">Data Corrections</h2>
          <p className="text-sm text-muted mb-2">
            Found incorrect information about a casino? Help us maintain accuracy:
          </p>
          <a href="mailto:data@casinolynora.com" className="text-primary hover:underline text-sm font-medium">
            data@casinolynora.com
          </a>
        </div>

        <div className="bg-surface-elevated rounded-xl p-6 border border-border">
          <h2 className="font-bold mb-2">Responsible Gambling Concerns</h2>
          <p className="text-sm text-muted mb-2">
            If you have concerns about gambling behavior (yours or someone else&apos;s):
          </p>
          <a href="mailto:support@casinolynora.com" className="text-primary hover:underline text-sm font-medium">
            support@casinolynora.com
          </a>
        </div>
      </div>
    </Container>
  );
}
