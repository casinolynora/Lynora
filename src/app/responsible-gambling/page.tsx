import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Responsible Gambling — Play Safely",
  description:
    "Learn how to gamble responsibly. Resources, tools, and guidance for safe and enjoyable online gambling.",
  openGraph: {
    title: "Responsible Gambling — CasinoLynora",
    description: "Learn how to gamble responsibly. Resources and guidance for safe gambling.",
  },
  twitter: {
    card: "summary",
    title: "Responsible Gambling — CasinoLynora",
    description: "Learn how to gamble responsibly. Resources and guidance for safe gambling.",
  },
  alternates: { canonical: "https://casinolynora.com/responsible-gambling" },
};

export default function ResponsibleGamblingPage() {
  return (
    <Container className="py-12 lg:py-20 max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6">Responsible Gambling</h1>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
        <p className="text-amber-800 font-medium mb-2">Gambling can be addictive.</p>
        <p className="text-amber-700 text-sm">
          If you or someone you know has a gambling problem, please seek help immediately.
          Call your local gambling helpline or visit the resources listed below.
        </p>
      </div>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-3">Our Commitment</h2>
          <p className="text-muted leading-relaxed">
            CasinoLynora is committed to promoting responsible gambling. We believe online gambling
            should be a form of entertainment, not a way to make money or solve financial problems.
            We never encourage excessive gambling or make claims about guaranteed winnings.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Signs of Problem Gambling</h2>
          <ul className="list-disc list-inside text-muted space-y-1">
            <li>Spending more money or time gambling than you intended</li>
            <li>Trying to win back losses</li>
            <li>Borrowing money or selling possessions to gamble</li>
            <li>Lying about gambling habits</li>
            <li>Neglecting work, school, or family responsibilities</li>
            <li>Feeling restless or irritable when not gambling</li>
            <li>Using gambling as a way to escape problems</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Tips for Safe Gambling</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
            {[
              { title: "Set a Budget", desc: "Only gamble with money you can afford to lose. Set daily, weekly, or monthly limits." },
              { title: "Set Time Limits", desc: "Decide how long you will play before you start. Stick to that time limit." },
              { title: "Never Chase Losses", desc: "If you lose, accept it. Do not try to win it back with bigger bets." },
              { title: "Take Breaks", desc: "Step away regularly. Do not gamble for extended periods without breaks." },
              { title: "Don't Gamble When Upset", desc: "Avoid gambling when you are stressed, depressed, or under the influence of alcohol." },
              { title: "Keep Gambling Fun", desc: "Treat gambling as entertainment, not a way to make money." },
            ].map(tip => (
              <div key={tip.title} className="bg-surface rounded-xl p-4 border border-border">
                <h3 className="font-bold text-sm mb-1">{tip.title}</h3>
                <p className="text-sm text-muted">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Tools & Resources</h2>
          <div className="space-y-3 not-prose">
            <div className="bg-surface rounded-xl p-4 border border-border">
              <h3 className="font-bold mb-1">BeGambleAware</h3>
              <p className="text-sm text-muted mb-2">Free, confidential help for problem gamblers.</p>
              <a href="https://www.begambleaware.org/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                Visit BeGambleAware.org
              </a>
            </div>
            <div className="bg-surface rounded-xl p-4 border border-border">
              <h3 className="font-bold mb-1">GamCare</h3>
              <p className="text-sm text-muted mb-2">Free information, support and counselling for problem gambling.</p>
              <a href="https://www.gamcare.org.uk/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                Visit GamCare.org.uk
              </a>
            </div>
            <div className="bg-surface rounded-xl p-4 border border-border">
              <h3 className="font-bold mb-1">Gamblers Anonymous</h3>
              <p className="text-sm text-muted mb-2">A fellowship of men and women who share their experience to solve their common problem.</p>
              <a href="https://www.gamblersanonymous.org/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                Visit GamblersAnonymous.org
              </a>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Self-Exclusion</h2>
          <p className="text-muted leading-relaxed">
            Many online casinos offer self-exclusion tools that allow you to restrict your access
            to their platform. If you feel you need a break from gambling, we strongly encourage
            using these tools. Most licensed casinos provide options for temporary or permanent
            self-exclusion.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-3">Age Restriction</h2>
          <p className="text-muted leading-relaxed">
            CasinoLynora is intended for users who are 18 years of age or older (or the legal
            gambling age in your jurisdiction, whichever is higher). We do not allow minors to
            use our services.
          </p>
        </section>
      </div>
    </Container>
  );
}
