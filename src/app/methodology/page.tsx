import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Methodology — CasinoLynora",
  description: "How CasinoLynora scores and matches casinos using structured data and transparent algorithms.",
  alternates: { canonical: "/methodology" },
  openGraph: {
    title: "Methodology — CasinoLynora",
    description: "How CasinoLynora scores and matches casinos using structured data.",
  },
  twitter: {
    card: "summary",
    title: "Methodology — CasinoLynora",
    description: "How CasinoLynora scores and matches casinos using structured data.",
  },
};

export default function MethodologyPage() {
  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Our Methodology</h1>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4">Matching Algorithm</h2>
              <p className="text-muted leading-relaxed mb-4">
                Our matching engine uses a weighted scoring algorithm that considers multiple
                factors to determine how well a casino fits your preferences.
              </p>
              <div className="card-static p-6">
                <div className="space-y-3">
                  {[
                    { label: "Country Availability", weight: "25%", description: "Is the casino licensed to operate in your region?" },
                    { label: "Payment Method Compatibility", weight: "20%", description: "Does it support your preferred payment method?" },
                    { label: "Game Variety Match", weight: "15%", description: "Does it offer the games you enjoy?" },
                    { label: "Minimum Deposit", weight: "10%", description: "Does the minimum deposit fit your budget?" },
                    { label: "Bonus Preferences", weight: "10%", description: "Does it offer the type of bonus you want?" },
                    { label: "Live Casino, Sports, Withdrawal, Crypto", weight: "20%", description: "Additional feature matching." },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium text-foreground">{item.label}</span>
                        <span className="text-muted ml-2">— {item.description}</span>
                      </div>
                      <span className="font-bold text-brand-700 ml-4 flex-shrink-0">{item.weight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Data Verification</h2>
              <p className="text-muted leading-relaxed">
                Every data point in our system includes provenance information: the source,
                verification date, and method. We verify against official license registries,
                casino websites, and regulatory bodies.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">What We Do NOT Do</h2>
              <ul className="space-y-2 text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">−</span>
                  We do not fabricate ratings, scores, or reviews.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">−</span>
                  We do not publish fake user testimonials.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">−</span>
                  We do not invent bonus terms, withdrawal times, or statistics.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">−</span>
                  We do not rank casinos based on affiliate commission potential.
                </li>
              </ul>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
