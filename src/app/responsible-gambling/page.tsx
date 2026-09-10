import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Responsible Gambling — CasinoLynora",
  description: "Resources and support for responsible gambling. Tips for safe play and where to get help.",
  alternates: { canonical: "https://casinolynora.com/responsible-gambling" },
};

export default function ResponsibleGamblingPage() {
  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          {/* Warning banner */}
          <div className="card-static p-6 border-l-4 border-l-amber-500 bg-amber-50 mb-10">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <div>
                <h2 className="text-lg font-bold text-amber-800 mb-1">Gambling can be addictive.</h2>
                <p className="text-sm text-amber-700">
                  If you or someone you know has a gambling problem, please seek help immediately.
                </p>
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-8">Responsible Gambling</h1>

          <div className="space-y-10">
            <section>
              <h2 className="text-2xl font-bold mb-4">Our Commitment</h2>
              <p className="text-muted leading-relaxed">
                CasinoLynora is committed to promoting responsible gambling. We believe online gambling
                should be a form of entertainment, not a way to make money or solve financial problems.
                We never encourage excessive gambling.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Signs of Problem Gambling</h2>
              <ul className="space-y-2 text-muted">
                {[
                  "Spending more money or time gambling than you intended",
                  "Trying to win back losses",
                  "Borrowing money or selling possessions to gamble",
                  "Lying about gambling habits",
                  "Neglecting work, school, or family responsibilities",
                  "Feeling restless or irritable when not gambling",
                  "Using gambling as a way to escape problems",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Tips for Safe Gambling</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Set a Budget", description: "Only gamble with money you can afford to lose." },
                  { title: "Set Time Limits", description: "Decide how long you will play before you start." },
                  { title: "Never Chase Losses", description: "Accept losses. Do not try to win them back." },
                  { title: "Take Breaks", description: "Step away regularly. Do not gamble for extended periods." },
                  { title: "Don't Gamble When Upset", description: "Avoid gambling when stressed, depressed, or under the influence." },
                  { title: "Keep Gambling Fun", description: "Treat gambling as entertainment, not income." },
                ].map((tip) => (
                  <div key={tip.title} className="card-static p-5">
                    <h3 className="font-bold text-sm mb-1">{tip.title}</h3>
                    <p className="text-sm text-muted">{tip.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Tools &amp; Resources</h2>
              <div className="space-y-3">
                {[
                  { name: "BeGambleAware", url: "https://www.begambleaware.org", description: "Free, confidential help for problem gamblers." },
                  { name: "GamCare", url: "https://www.gamcare.org.uk", description: "Free information, support and counselling." },
                  { name: "Gamblers Anonymous", url: "https://www.gamblersanonymous.org", description: "Fellowship for sharing experience and solving problems." },
                ].map((resource) => (
                  <a
                    key={resource.name}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-static p-4 flex items-center justify-between hover:border-brand-200 transition-colors group"
                  >
                    <div>
                      <h3 className="font-bold text-sm group-hover:text-brand-700 transition-colors">{resource.name}</h3>
                      <p className="text-xs text-muted">{resource.description}</p>
                    </div>
                    <svg className="w-4 h-4 text-text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                    </svg>
                  </a>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Age Restriction</h2>
              <p className="text-muted leading-relaxed">
                CasinoLynora is intended for users who are 18 years of age or older (or the legal
                gambling age in your jurisdiction, whichever is higher). We do not allow minors to
                use our services.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
  );
}
