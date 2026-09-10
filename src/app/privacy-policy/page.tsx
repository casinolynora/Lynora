import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy — CasinoLynora",
  description: "CasinoLynora privacy policy. How we collect, use, and protect your data.",
  alternates: { canonical: "https://casinolynora.com/privacy-policy" },
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
              <p>CasinoLynora respects your privacy. This policy explains how we handle your data.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">2. Information We Collect</h2>
              <p>We collect minimal data: preferences you provide during matching, usage analytics (if enabled), and technical data (IP, browser) for security.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">3. How We Use Information</h2>
              <p>To provide casino matching, improve our service, and ensure security. We do not sell your data.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">4. Cookies</h2>
              <p>Essential cookies for site functionality. Optional analytics cookies with your consent.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">5. Third-Party Services</h2>
              <p>Google Analytics (if enabled), OpenAI (for AI matching explanations), and Vercel (hosting).</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">6. Data Retention</h2>
              <p>Matching preferences are processed in real-time and not stored long-term.</p>
            </section>
            <section>
              <h2 className="text-xl font-bold mb-3 text-foreground">7. Contact</h2>
              <p>For privacy questions: <a href="mailto:hello@casinolynora.com" className="text-brand-700 hover:underline">hello@casinolynora.com</a></p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
