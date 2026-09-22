import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SITE_NAME, SITE_URL } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Responsible Gambling — BeInCasinos",
  description:
    "Resources and support for responsible gambling. Learn how to stay in control, recognise warning signs, and find professional help.",
  alternates: { canonical: "/responsible-gambling" },
  openGraph: {
    title: "Responsible Gambling — BeInCasinos",
    description: "Resources and support for responsible gambling.",
  },
  twitter: {
    card: "summary",
    title: "Responsible Gambling — BeInCasinos",
    description: "Resources and support for responsible gambling.",
  },
};

const KEY_PRINCIPLES = [
  {
    title: "Only Gamble with Money You Can Afford to Lose",
    body: "Never use money designated for rent, bills, food, or other essentials. Set a strict gambling budget that, if lost entirely, would not affect your daily life or financial obligations.",
  },
  {
    title: "Set Strict Time and Money Limits",
    body: "Before you start playing, decide exactly how much you will spend and how long you will play. Stick to those limits no matter what happens — wins or losses.",
  },
  {
    title: "Never Chase Losses",
    body: "Trying to win back money you have already lost is one of the fastest paths to problem gambling. Accept that losses are part of the experience and walk away when your limit is reached.",
  },
  {
    title: "Gambling Is Entertainment, Not Income",
    body: "No gambling strategy guarantees profit. Treat every stake as the price of entertainment — not as an investment or a way to solve financial problems.",
  },
  {
    title: "Take Regular Breaks",
    body: "Extended sessions impair judgment. Step away from the screen, refresh your mind, and reassess whether you still want to continue.",
  },
];

const WARNING_SIGNS = [
  {
    sign: "Spending More Than Intended",
    description:
      "You regularly exceed the budget or time limits you set for yourself, or you find yourself thinking about gambling when you should be focused on other tasks.",
  },
  {
    sign: "Borrowing to Gamble",
    description:
      "You have taken out loans, sold possessions, or used credit cards to fund gambling activity. This is a serious warning sign that gambling has become unsustainable.",
  },
  {
    sign: "Lying About Gambling",
    description:
      "You hide the extent of your gambling from family, friends, or colleagues. Secrecy around gambling often indicates that you know the behaviour has become problematic.",
  },
  {
    sign: "Neglecting Responsibilities",
    description:
      "Work, school, household duties, or relationships are suffering because of the time or money you spend gambling.",
  },
  {
    sign: "Mood Swings and Emotional Volatility",
    description:
      "You feel irritable, anxious, or depressed when not gambling, or your mood is increasingly dictated by whether you won or lost.",
  },
];

const SELF_ASSESSMENT_QUESTIONS = [
  "Have you ever gambled more than you could afford to lose?",
  "Have you needed to borrow money or sell possessions to keep gambling?",
  "Have you felt guilty or ashamed about the amount of money or time you spend gambling?",
  "Have you tried to cut back or stop gambling, only to find you could not?",
  "Have you隐瞒 (concealed) the extent of your gambling from people close to you?",
  "Has gambling caused arguments, stress, or problems in your relationships?",
];

const PRACTICAL_TIPS = [
  {
    title: "Set Deposit Limits",
    body: "Most licensed online casinos allow you to set daily, weekly, or monthly deposit limits. Use them — they are one of the most effective tools for staying in control.",
  },
  {
    title: "Use Self-Exclusion Tools",
    body: "If you feel you are losing control, self-exclusion programmes allow you to block yourself from gambling sites for a set period. Services like GAMSTOP (UK) make this easy to activate across multiple operators at once.",
  },
  {
    title: "Don't Gamble When Emotional",
    body: "Avoid gambling when you are stressed, depressed, angry, or under the influence of alcohol or drugs. Impaired judgment leads to impulsive decisions and bigger losses.",
  },
  {
    title: "Keep Gambling as Entertainment",
    body: "Balance gambling with other hobbies and social activities. If gambling becomes the only thing you do for fun, it is time to reassess your relationship with it.",
  },
  {
    title: "Track Your Spending",
    body: "Keep a record of every deposit and withdrawal. Seeing the numbers in black and white helps you stay aware of your actual spending versus what you think you spent.",
  },
];

const EXTERNAL_RESOURCES = [
  {
    name: "BeGambleAware",
    url: "https://www.begambleaware.org",
    description:
      "Free, confidential information and support for anyone affected by problem gambling. BeGambleAware provides practical tools, a helpline, and live chat services.",
  },
  {
    name: "GamCare",
    url: "https://www.gamcare.org.uk",
    description:
      "Free information, advice, and support for anyone affected by gambling harms. GamCare operates the National Gambling Helpline and provides counselling services.",
  },
  {
    name: "Gamblers Anonymous",
    url: "https://www.gamblersanonymous.org",
    description:
      "A fellowship of people who share their experience to solve their common problem. Gamblers Anonymous offers support groups in many countries worldwide.",
  },
  {
    name: "Gambling Therapy",
    url: "https://www.gamblingtherapy.org",
    description:
      "Online support for anyone affected by problem gambling. Gambling Therapy offers live chat, email support, and a global community of people dealing with similar issues.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Responsible Gambling",
      item: `${SITE_URL}/responsible-gambling`,
    },
  ],
};

export default function ResponsibleGamblingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <main id="main-content">
        <Container className="py-12 lg:py-20">
          <div className="max-w-3xl mx-auto">
          {/* Warning Banner */}
          <div className="card-static p-6 border-l-4 border-l-amber-500 bg-amber-50 mb-10">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
              <div>
                <h2 className="text-lg font-bold text-amber-800 mb-1">
                  Gambling Involves Financial Risk
                </h2>
                <p className="text-sm text-amber-700">
                  Gambling is not a way to earn money or solve financial difficulties. Only gamble
                  where it is legal in your jurisdiction, and never stake more than you can
                  comfortably afford to lose. If gambling is no longer fun, stop — and seek help.
                </p>
              </div>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Responsible Gambling</h1>
          <p className="text-muted leading-relaxed mb-10">
            {SITE_NAME} is an informational resource. We do not operate casinos or take bets. Our
            goal is to help you make informed decisions and enjoy gambling as a safe form of
            entertainment. The information on this page is not a substitute for professional advice.
          </p>

          <div className="card-static p-5 mb-10">
            <h2 className="font-bold text-sm mb-2">Looking for practical tips?</h2>
            <p className="text-sm text-muted mb-3">
              We have a dedicated guide with actionable advice for staying in control while playing.
            </p>
            <Link href="/guides/responsible-gambling-tips" className="text-sm font-semibold text-brand-700 hover:text-brand-600 transition-colors">
              Read our Responsible Gambling Tips guide →
            </Link>
          </div>

          <div className="space-y-12">
            {/* Key Principles */}
            <section aria-labelledby="key-principles">
              <h2 id="key-principles" className="text-2xl font-bold mb-5">
                Key Principles for Safe Play
              </h2>
              <div className="space-y-5">
                {KEY_PRINCIPLES.map((principle) => (
                  <div key={principle.title} className="card-static p-5">
                    <h3 className="font-bold text-sm mb-1">{principle.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{principle.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Warning Signs */}
            <section aria-labelledby="warning-signs">
              <h2 id="warning-signs" className="text-2xl font-bold mb-5">
                Signs of Problem Gambling
              </h2>
              <p className="text-muted leading-relaxed mb-5">
                Problem gambling can develop gradually. Recognising the signs early is the first step
                toward getting back in control. If any of the following resonate with you, please
                reach out for support.
              </p>
              <div className="space-y-3">
                {WARNING_SIGNS.map((item) => (
                  <div key={item.sign} className="flex items-start gap-3">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                    <div>
                      <h3 className="font-bold text-sm">{item.sign}</h3>
                      <p className="text-sm text-muted">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Self-Assessment */}
            <section aria-labelledby="self-assessment">
              <h2 id="self-assessment" className="text-2xl font-bold mb-5">
                Self-Assessment
              </h2>
              <p className="text-muted leading-relaxed mb-5">
                Answering &ldquo;yes&rdquo; to any of the following questions may indicate that your
                gambling habits warrant closer attention. Be honest with yourself.
              </p>
              <ol className="space-y-3 list-decimal list-inside">
                {SELF_ASSESSMENT_QUESTIONS.map((question, i) => (
                  <li key={i} className="text-sm text-muted pl-1">
                    {question}
                  </li>
                ))}
              </ol>
              <p className="text-sm text-muted mt-4 italic">
                If you answered yes to several of these, consider speaking with a professional or
                contacting one of the support organisations listed below.
              </p>
            </section>

            {/* Practical Tips */}
            <section aria-labelledby="practical-tips">
              <h2 id="practical-tips" className="text-2xl font-bold mb-5">
                Practical Tips to Stay in Control
              </h2>
              <div className="space-y-4">
                {PRACTICAL_TIPS.map((tip) => (
                  <div key={tip.title} className="card-static p-5">
                    <h3 className="font-bold text-sm mb-1">{tip.title}</h3>
                    <p className="text-sm text-muted leading-relaxed">{tip.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* External Support Resources */}
            <section aria-labelledby="support-resources">
              <h2 id="support-resources" className="text-2xl font-bold mb-5">
                External Support Resources
              </h2>
              <p className="text-muted leading-relaxed mb-5">
                If you or someone you know is struggling with gambling, the following organisations
                provide free, confidential help. They are not affiliated with {SITE_NAME}.
              </p>
              <div className="space-y-3">
                {EXTERNAL_RESOURCES.map((resource) => (
                  <a
                    key={resource.name}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-static p-5 flex items-center justify-between hover:border-brand-200 transition-colors group"
                  >
                    <div className="pr-4">
                      <h3 className="font-bold text-sm group-hover:text-brand-700 transition-colors">
                        {resource.name}
                      </h3>
                      <p className="text-sm text-muted leading-relaxed mt-1">
                        {resource.description}
                      </p>
                    </div>
                    <svg
                      className="w-4 h-4 text-text-faint flex-shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                      />
                    </svg>
                  </a>
                ))}
              </div>
            </section>

            {/* Age Restriction */}
            <section aria-labelledby="age-restriction">
              <h2 id="age-restriction" className="text-2xl font-bold mb-5">
                Age Restriction
              </h2>
              <p className="text-muted leading-relaxed">
                Gambling is restricted to adults. You must be at least 18 years old — or the minimum
                legal gambling age in your jurisdiction, whichever is higher — to use {SITE_NAME} or
                to gamble. We do not knowingly collect data from minors. If you are under the legal
                age, please leave this site immediately.
              </p>
            </section>

            {/* Disclaimer */}
            <section aria-labelledby="disclaimer">
              <h2 id="disclaimer" className="text-2xl font-bold mb-5">
                Disclaimer
              </h2>
              <p className="text-muted leading-relaxed">
                {SITE_NAME} is an independent informational resource. We do not operate, manage, or
                control any casino or gambling platform. We cannot intervene in disputes between
                players and operators, process withdrawals, or resolve account issues. If you have a
                dispute with a gambling operator, please contact the operator directly or seek
                assistance from the relevant regulatory authority in your jurisdiction.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </main>
    </>
  );
}
