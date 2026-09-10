import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Our Methodology — How We Rate & Match Casinos",
  description:
    "Learn how CasinoLynora rates and matches casinos. Transparent methodology using structured data, not subjective opinions.",
  openGraph: {
    title: "Our Methodology — CasinoLynora",
    description: "Learn how CasinoLynora rates and matches casinos using transparent, data-driven methodology.",
  },
  twitter: {
    card: "summary",
    title: "Our Methodology — CasinoLynora",
    description: "Learn how CasinoLynora rates and matches casinos using transparent, data-driven methodology.",
  },
  alternates: { canonical: "https://casinolynora.com/methodology" },
};

export default function MethodologyPage() {
  return (
    <Container className="py-12 lg:py-20 max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Our Methodology</h1>
      <p className="text-muted mb-8 leading-relaxed">
        Transparency is core to CasinoLynora. Here is exactly how we rate and match casinos.
      </p>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-3">Data-Driven Ratings</h2>
          <p className="text-muted leading-relaxed">
            CasinoLynora does not use subjective reviews or personal opinions for our ratings.
            Every casino score is calculated using a weighted algorithm based on structured,
            verified data. This means our ratings are:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li>Objective — based on measurable criteria</li>
            <li>Consistent — the same methodology for every casino</li>
            <li>Transparent — you can see exactly what factors affect the score</li>
            <li>Verifiable — all data points have a &quot;last verified&quot; date</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Score Components</h2>
          <div className="space-y-4">
            {[
              { name: "License Quality (25%)", desc: "We evaluate the licensing authority, jurisdiction, and regulatory requirements. MGA and UKGC licenses score highest due to strict regulatory standards." },
              { name: "Payment Methods (20%)", desc: "Variety, availability, processing speed, and fee structure of payment options including cards, e-wallets, bank transfers, and cryptocurrencies." },
              { name: "Game Variety (15%)", desc: "Number of game categories, quality and quantity of game providers, and availability of popular titles." },
              { name: "Minimum Deposit (10%)", desc: "Accessibility for different budget levels. Lower minimum deposits score higher for accessibility." },
              { name: "Withdrawal Speed (10%)", desc: "How quickly winnings can be withdrawn. Instant or same-day processing scores highest." },
              { name: "Bonus Value (10%)", desc: "Welcome bonus generosity, wagering requirements, and ongoing promotions. We factor in wagering requirements to assess real value." },
              { name: "Trust Score (10%)", desc: "Years in operation, ownership track record, player complaint history, and overall reputation in the industry." },
            ].map(item => (
              <div key={item.name} className="bg-surface-elevated rounded-xl p-5 border border-border">
                <h3 className="font-bold mb-1">{item.name}</h3>
                <p className="text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">AI Matching Algorithm</h2>
          <p className="text-muted leading-relaxed">
            Our AI Casino Matchmaker uses a deterministic scoring system to match player preferences
            with casino attributes. The matching considers:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li>Country availability (25%)</li>
            <li>Payment method compatibility (20%)</li>
            <li>Minimum deposit suitability (10%)</li>
            <li>Game preference match (15%)</li>
            <li>Live casino availability (5%)</li>
            <li>Sports betting availability (5%)</li>
            <li>Bonus preference match (10%)</li>
            <li>Withdrawal speed (5%)</li>
            <li>Cryptocurrency support (5%)</li>
          </ul>
          <p className="text-muted leading-relaxed mt-3">
            The AI explanation layer adds natural-language context to the scored results, but it
            never invents information. All explanations reference actual data from our casino database.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Data Verification</h2>
          <p className="text-muted leading-relaxed">
            We regularly verify casino data. Each casino profile displays a &quot;Last Verified&quot; date.
            We verify:
          </p>
          <ul className="list-disc list-inside text-muted space-y-1 mt-2">
            <li>License status and validity</li>
            <li>Available payment methods</li>
            <li>Minimum and maximum deposits</li>
            <li>Bonus terms and wagering requirements</li>
            <li>Game availability</li>
            <li>Countries of operation</li>
            <li>Withdrawal processing times</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">What We Do NOT Do</h2>
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>We do not publish fabricated user reviews or testimonials</li>
            <li>We do not create fake ratings based on affiliate commissions</li>
            <li>We do not claim casinos are &quot;verified&quot; when they are not</li>
            <li>We do not use misleading urgency tactics</li>
            <li>We do not guarantee winnings or claim any casino is &quot;risk-free&quot;</li>
          </ul>
        </section>
      </div>
    </Container>
  );
}
