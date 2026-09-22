import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CasinoGrid } from "@/components/casino/CasinoGrid";
import { SITE_URL } from "@/lib/config/site";
import { getFullDatasetCasinos } from "@/lib/seo/payment-data";
import { buildPaymentEntityMap, getGeoToPayments } from "@/lib/seo/payment-entities";
import { selectCasinosForGeoComparison, buildComparisonUrl } from "@/lib/compare";

const SUPPORTED_GEOS = ["de", "fr", "nl", "be", "at", "it", "ch", "ie", "gb", "se", "fi", "no"] as const;
type Geo = typeof SUPPORTED_GEOS[number];

const geoConfig: Record<Geo, {
  name: string;
  flag: string;
  language: string;
  isoCode: string;
  hasCasinoData: boolean;
  legalNote?: string;
  regulator: string;
  regulatorFull: string;
  regulatoryOverview: string;
  paymentLandscape: string;
  popularPayments: string[];
  currency: string;
  relevantGuides: Array<{ slug: string; label: string }>;
  faqItems: Array<{ question: string; answer: string }>;
}> = {
  de: {
    name: "Germany",
    flag: "\u{1F1E9}\u{1F1EA}",
    language: "de",
    isoCode: "DE",
    hasCasinoData: true,
    regulator: "GGL",
    regulatorFull: "Gemeinsame Gl\u00FCcksspielbeh\u00F6rde der L\u00E4nder",
    regulatoryOverview:
      "Germany regulates online gambling through the Interstate Treaty on Gambling (Gl\u00FCStV), enforced by the Joint Gambling Authority (GGL). Operators must hold a GGL license to offer slots, poker, or casino games to German players. The framework includes a \u20AC1 stake limit per spin on slots, a 5-second minimum spin time, and mandatory 1% monthly deposit cap enforcement for player protection.",
    paymentLandscape:
      "German players commonly use SEPA bank transfers, PayPal, Skrill, Neteller, and Paysafecard. The Giropay and SOFORT (now Klarna) instant-bank-transfer systems are widely integrated. Visa and Mastercard are accepted, though some German banks restrict gambling transactions.",
    popularPayments: ["PayPal", "Skrill", "SOFORT/Klarna", "Paysafecard", "SEPA Transfer"],
    currency: "EUR",
    relevantGuides: [
      { slug: "payment-methods-guide", label: "Payment Methods Guide" },
      { slug: "casino-licensing-guide", label: "Licensing Guide" },
    ],
    faqItems: [
      {
        question: "Is online gambling legal in Germany?",
        answer: "Yes. Online slots, poker, and virtual casino games are legal in Germany under the Gl\u00FCStV, provided the operator holds a license from the GGL. Sports betting is also regulated under the same treaty.",
      },
      {
        question: "What is the minimum age for online gambling in Germany?",
        answer: "Players must be at least 18 years old to gamble at online casinos in Germany.",
      },
      {
        question: "What are the stake limits for online slots in Germany?",
        answer: "German regulations impose a maximum stake of \u20AC1 per spin on online slot games, along with a 5-second minimum time between spins.",
      },
    ],
  },
  fr: {
    name: "France",
    flag: "\u{1F1EB}\u{1F1F7}",
    language: "fr",
    isoCode: "FR",
    hasCasinoData: false,
    legalNote:
      "Online casino games (slots, roulette, blackjack) are not permitted in France under ANJ regulations. Only sports betting, horse racing, and poker are licensed.",
    regulator: "ANJ",
    regulatorFull: "Autorit\u00E9 Nationale des Jeux",
    regulatoryOverview:
      "France's gambling market is regulated by the Autorit\u00E9 Nationale des Jeux (ANJ). Online sports betting, horse racing, and poker are legal and licensed. Online casino games such as slots, roulette, and blackjack are not permitted under current French law. All operators must hold an ANJ license.",
    paymentLandscape:
      "French players use a mix of international and domestic payment methods. Carte Bancaire (CB), Visa, and Mastercard are widely accepted. PayPal, PayLib (bank-to-bank), and Paysafecard are also popular. ANJ-licensed operators must offer responsible gambling deposit limits.",
    popularPayments: ["Carte Bancaire", "Visa", "PayPal", "PayLib", "Paysafecard"],
    currency: "EUR",
    relevantGuides: [
      { slug: "casino-licensing-guide", label: "Licensing Guide" },
      { slug: "responsible-gambling-tips", label: "Responsible Gambling" },
    ],
    faqItems: [
      {
        question: "Can I play online casino games in France?",
        answer: "No. Online slots, roulette, and blackjack are not licensed in France. Only sports betting, horse racing, and online poker are legal under ANJ regulations.",
      },
      {
        question: "Is sports betting legal in France?",
        answer: "Yes. Online sports betting is legal and regulated by the ANJ. Licensed operators can offer sports betting to French residents.",
      },
      {
        question: "What is the ANJ?",
        answer: "The Autorit\u00E9 Nationale des Jeux (ANJ) is France's national gambling regulator. It licenses and supervises all legal gambling operators in the country.",
      },
    ],
  },
  nl: {
    name: "Netherlands",
    flag: "\u{1F1F3}\u{1F1F1}",
    language: "nl",
    isoCode: "NL",
    hasCasinoData: true,
    regulator: "KSA",
    regulatorFull: "Kansspelautoriteit",
    regulatoryOverview:
      "The Netherlands regulates online gambling through the Remote Gambling Act (Wet op de kansspelen op afstand), enforced by the Kansspelautoriteit (KSA). Operators must hold a KSA license to offer online casino games, sports betting, or poker to Dutch players. The framework includes a self-exclusion register (CRUKS), mandatory affordability checks, and advertising restrictions.",
    paymentLandscape:
      "iDEAL is the dominant payment method in the Netherlands, used by the vast majority of Dutch consumers for online transactions. Bancontact is also common. Credit cards (Visa, Mastercard) are accepted but less preferred. E-wallets like PayPal, Skrill, and Neteller are available. Paysafecard and bank transfers via Trustly are also popular.",
    popularPayments: ["iDEAL", "Bancontact", "PayPal", "Skrill", "Trustly"],
    currency: "EUR",
    relevantGuides: [
      { slug: "payment-methods-guide", label: "Payment Methods Guide" },
      { slug: "casino-licensing-guide", label: "Licensing Guide" },
    ],
    faqItems: [
      {
        question: "Is online gambling legal in the Netherlands?",
        answer: "Yes. Online gambling has been legal in the Netherlands since October 2021 under the Remote Gambling Act. Operators must hold a KSA license.",
      },
      {
        question: "What is CRUKS?",
        answer: "CRUKS (Centraal Register Uitsluiting Kansspelen) is the Dutch national self-exclusion register. Players who register are blocked from all licensed gambling operators in the Netherlands.",
      },
      {
        question: "Can I use iDEAL at online casinos?",
        answer: "Yes. iDEAL is widely accepted at KSA-licensed online casinos in the Netherlands and is one of the most popular deposit methods.",
      },
    ],
  },
  be: {
    name: "Belgium",
    flag: "\u{1F1E7}\u{1F1EA}",
    language: "nl",
    isoCode: "BE",
    hasCasinoData: true,
    regulator: "BGC",
    regulatorFull: "Belgian Gaming Commission (Belgische Kansspelcommissie)",
    regulatoryOverview:
      "Belgium regulates online gambling through the Belgian Gaming Act, enforced by the Belgian Gaming Commission (BGC). Operators must hold a Belgian license (A+ or B+ for online). Belgium maintains a land-based casino requirement for online licenses, and imposes strict advertising rules including a ban on advertising during live sports broadcasts.",
    paymentLandscape:
      "Belgian players use a mix of European payment methods. Bancontact (formerly Bancontact/Mister Cash) is the leading debit card system. PayPal, Skrill, Neteller, and Paysafecard are widely available. Visa and Mastercard are accepted at most licensed operators. Belgian Online Gaming Association (BAGO) members must offer responsible gambling tools.",
    popularPayments: ["Bancontact", "PayPal", "Skrill", "Paysafecard", "Visa"],
    currency: "EUR",
    relevantGuides: [
      { slug: "payment-methods-guide", label: "Payment Methods Guide" },
      { slug: "casino-licensing-guide", label: "Licensing Guide" },
    ],
    faqItems: [
      {
        question: "Is online gambling legal in Belgium?",
        answer: "Yes. Online gambling is legal in Belgium for operators holding a B+ or A+ license from the Belgian Gaming Commission (BGC).",
      },
      {
        question: "What is the legal gambling age in Belgium?",
        answer: "Players must be at least 21 years old to gamble at online casinos in Belgium.",
      },
      {
        question: "What payment methods are popular in Belgium?",
        answer: "Bancontact is the most popular payment method, followed by PayPal, Skrill, and Paysafecard. Visa and Mastercard are also widely accepted.",
      },
    ],
  },
  at: {
    name: "Austria",
    flag: "\u{1F1E6}\u{1F1F9}",
    language: "de",
    isoCode: "AT",
    hasCasinoData: false,
    regulator: "Ministry of Finance",
    regulatorFull: "Austrian Ministry of Finance (Finanzministerium)",
    regulatoryOverview:
      "Austria's gambling market is regulated under the 2010 Gambling Act (Gl\u00FCcksspielgesetz). The Ministry of Finance grants licenses for online casino games, while the provincial governments regulate lotteries. State monopolies operate in several provinces. Operators must hold an Austrian license or EU/EEA license with Austrian regulatory approval.",
    paymentLandscape:
      "Austrian players commonly use SEPA bank transfers, eps (Electronic Payment Standard — an Austrian online banking system), PayPal, and major credit cards. Paysafecard and e-wallets like Skrill and Neteller are also available. eps is particularly popular for direct bank transfers.",
    popularPayments: ["eps", "PayPal", "SEPA Transfer", "Visa", "Paysafecard"],
    currency: "EUR",
    relevantGuides: [
      { slug: "payment-methods-guide", label: "Payment Methods Guide" },
      { slug: "casino-licensing-guide", label: "Licensing Guide" },
    ],
    faqItems: [
      {
        question: "Is online gambling legal in Austria?",
        answer: "Yes. Online gambling is legal in Austria under the 2010 Gambling Act. Operators must hold a license from the Austrian Ministry of Finance.",
      },
      {
        question: "What is eps in Austria?",
        answer: "eps (Electronic Payment Standard) is an Austrian online banking system that allows direct transfers from your bank account. It is widely used for online casino deposits.",
      },
      {
        question: "Are there online casino state monopolies in Austria?",
        answer: "Yes. Several Austrian provinces operate state gambling monopolies through casinos Austria AG and its subsidiaries. Private operators can apply for online licenses.",
      },
    ],
  },
  it: {
    name: "Italy",
    flag: "\u{1F1EE}\u{1F1F9}",
    language: "it",
    isoCode: "IT",
    hasCasinoData: false,
    regulator: "ADM",
    regulatorFull: "Agenzia delle Dogane e dei Monopoli",
    regulatoryOverview:
      "Italy regulates online gambling through the ADM (Agenzia delle Dogane e dei Monopoli), which is Italy's customs and monopoly agency. Online casino games, poker, sports betting, and bingo are all legal and licensed. Operators must hold an ADM license (concessione) and comply with Italian tax and advertising regulations.",
    paymentLandscape:
      "Italian players use a range of payment methods. PostePay (prepaid card from Italian Post) is very popular. PayPal, Skrill, Neteller, and Visa/Mastercard are widely accepted. Bank transfers and prepaid cards like Paysafecard are also available. ADM-licensed operators must support responsible gambling tools.",
    popularPayments: ["PostePay", "PayPal", "Skrill", "Visa", "Paysafecard"],
    currency: "EUR",
    relevantGuides: [
      { slug: "payment-methods-guide", label: "Payment Methods Guide" },
      { slug: "casino-licensing-guide", label: "Licensing Guide" },
    ],
    faqItems: [
      {
        question: "Is online gambling legal in Italy?",
        answer: "Yes. Online casino games, poker, sports betting, and bingo are all legal in Italy. Operators must hold an ADM license (concessione).",
      },
      {
        question: "What is the ADM?",
        answer: "The Agenzia delle Dogane e dei Monopoli (ADM) is Italy's customs and monopoly agency responsible for regulating and licensing all gambling activities in Italy.",
      },
      {
        question: "What is PostePay?",
        answer: "PostePay is a prepaid card issued by Poste Italiane (Italian Post). It is widely used in Italy for online transactions, including casino deposits, and is accepted at most ADM-licensed operators.",
      },
    ],
  },
  ch: {
    name: "Switzerland",
    flag: "\u{1F1E8}\u{1F1ED}",
    language: "de",
    isoCode: "CH",
    hasCasinoData: false,
    regulator: "EJBK/GCF",
    regulatorFull: "Intercantonal Gaming Board (EJBK) / Swiss Gambling Commission (GCF)",
    regulatoryOverview:
      "Switzerland regulates online gambling under the 2019 Gambling Act (Geldspielgesetz), which came into force on January 1, 2022. Only Swiss-licensed land-based casinos can offer online gambling. The Intercantonal Gaming Board (EJBK) and the Swiss Gambling Commission (GCF) oversee enforcement. Unlicensed foreign operators are blocked.",
    paymentLandscape:
      "Swiss players use a combination of local and international payment methods. PostFinance (Swiss Post's financial service) is widely used. TWINT (Swiss mobile payment), PayPal, credit cards (Visa, Mastercard), and bank transfers via IBAN are common. Paysafecard is also available. Foreign payment methods may face restrictions at licensed operators.",
    popularPayments: ["PostFinance", "TWINT", "PayPal", "Visa", "Bank Transfer"],
    currency: "CHF",
    relevantGuides: [
      { slug: "payment-methods-guide", label: "Payment Methods Guide" },
      { slug: "casino-licensing-guide", label: "Licensing Guide" },
    ],
    faqItems: [
      {
        question: "Is online gambling legal in Switzerland?",
        answer: "Yes, but only through Swiss-licensed land-based casinos. Since January 2022, Swiss-licensed casinos can offer online gambling. Unlicensed foreign operators are blocked by Swiss ISPs.",
      },
      {
        question: "What is TWINT?",
        answer: "TWINT is a Swiss mobile payment system developed by Swiss Post and SIX Payment Services. It is widely used for online payments, including at licensed Swiss online casinos.",
      },
      {
        question: "Can I play at foreign online casinos in Switzerland?",
        answer: "No. Switzerland blocks access to unlicensed foreign gambling websites. Only online casinos operated by Swiss-licensed land-based casinos are legally available.",
      },
    ],
  },
  ie: {
    name: "Ireland",
    flag: "\u{1F1EE}\u{1F1EA}",
    language: "en",
    isoCode: "IE",
    hasCasinoData: false,
    regulator: "GGL (Regulated)",
    regulatorFull: "Gambling Regulatory Authority of Ireland (GRAI)",
    regulatoryOverview:
      "Ireland is implementing the Gambling Regulation Bill, which establishes the Gambling Regulatory Authority of Ireland (GRAI) to regulate all gambling activities including online casinos, betting, and lotteries. The current framework includes the Betting Act 1955 for sports betting and the Gaming and Lotteries Act 1956 for land-based gaming. Online casino regulation is being modernized under the new bill.",
    paymentLandscape:
      "Irish players use a wide range of international payment methods. Visa and Mastercard are the most common. PayPal, Skrill, Neteller, and Paysafecard are widely available. Bank transfers via SEPA are supported. Most international operators accept Irish players and offer EUR currency.",
    popularPayments: ["Visa", "Mastercard", "PayPal", "Skrill", "Paysafecard"],
    currency: "EUR",
    relevantGuides: [
      { slug: "payment-methods-guide", label: "Payment Methods Guide" },
      { slug: "casino-licensing-guide", label: "Licensing Guide" },
    ],
    faqItems: [
      {
        question: "Is online gambling legal in Ireland?",
        answer: "Online gambling is regulated under existing Irish legislation, with the Gambling Regulation Bill modernizing the framework. Sports betting is legal under the Betting Act 1955. Online casino regulation is being updated under the new GRAI framework.",
      },
      {
        question: "What is the GRAI?",
        answer: "The Gambling Regulatory Authority of Ireland (GRAI) is the new regulator being established under the Gambling Regulation Bill to oversee all gambling activities in Ireland, including online casinos.",
      },
      {
        question: "What currency do Irish online casinos use?",
        answer: "Most online casinos available to Irish players operate in EUR (Euro), as Ireland uses the Euro as its official currency.",
      },
    ],
  },
  gb: {
    name: "Great Britain",
    flag: "\u{1F1EC}\u{1F1E7}",
    language: "en",
    isoCode: "GB",
    hasCasinoData: true,
    regulator: "UKGC",
    regulatorFull: "United Kingdom Gambling Commission",
    regulatoryOverview:
      "Great Britain regulates online gambling through the Gambling Act 2005, enforced by the United Kingdom Gambling Commission (UKGC). Operators must hold a UKGC licence to offer casino games, slots, poker, or sports betting to British players. The framework requires responsible gambling tools, advertising standards, and player protection measures including self-exclusion via GamStop.",
    paymentLandscape:
      "British players use a wide range of payment methods. Visa and Mastercard are widely accepted. PayPal, Skrill, Neteller, and Paysafecard are popular e-wallet options. Apple Pay is growing in popularity. Bank transfers and Klarna are also available at many operators.",
    popularPayments: ["Visa", "Mastercard", "PayPal", "Skrill", "Paysafecard"],
    currency: "GBP",
    relevantGuides: [
      { slug: "payment-methods-guide", label: "Payment Methods Guide" },
      { slug: "casino-licensing-guide", label: "Licensing Guide" },
      { slug: "responsible-gambling-tips", label: "Responsible Gambling" },
    ],
    faqItems: [
      {
        question: "Is online gambling legal in Great Britain?",
        answer: "Yes. Online casino games, slots, poker, and sports betting are legal in Great Britain for operators holding a UKGC licence. Players must be at least 18 years old.",
      },
      {
        question: "What is the UKGC?",
        answer: "The United Kingdom Gambling Commission (UKGC) is the regulatory body that oversees all gambling activities in Great Britain, including online casinos. It issues licences and enforces player protection standards.",
      },
      {
        question: "What is GamStop?",
        answer: "GamStop is a free self-exclusion scheme for British players. Once registered, you are blocked from all UKGC-licensed online gambling operators for a period of your choice.",
      },
    ],
  },
  se: {
    name: "Sweden",
    flag: "\u{1F1F8}\u{1F1EA}",
    language: "sv",
    isoCode: "SE",
    hasCasinoData: true,
    regulator: "Spelinspektionen",
    regulatorFull: "Swedish Gambling Authority (Spelinspektionen)",
    regulatoryOverview:
      "Sweden regulates online gambling through the Gambling Act (Spellagen), enforced by the Swedish Gambling Authority (Spelinspektionen). Operators must hold a Swedish licence to offer casino games, slots, or sports betting to Swedish players. The framework includes deposit limits, bonus restrictions (one welcome bonus per licence holder), and mandatory self-exclusion via Spelpaus.",
    paymentLandscape:
      "Swedish players commonly use Trustly for instant bank transfers, which is widely integrated at licensed operators. Visa, Mastercard, and e-wallets like Skrill and PayPal are also available. Klarna is popular for larger transactions. Paysafecard and Apple Pay are used by some players.",
    popularPayments: ["Trustly", "Visa", "Mastercard", "Skrill", "PayPal"],
    currency: "SEK",
    relevantGuides: [
      { slug: "payment-methods-guide", label: "Payment Methods Guide" },
      { slug: "casino-licensing-guide", label: "Licensing Guide" },
      { slug: "responsible-gambling-tips", label: "Responsible Gambling" },
    ],
    faqItems: [
      {
        question: "Is online gambling legal in Sweden?",
        answer: "Yes. Online gambling has been regulated in Sweden since January 2019 under the Gambling Act. Operators must hold a Swedish licence from Spelinspektionen to offer casino games to Swedish players.",
      },
      {
        question: "What is Spelpaus?",
        answer: "Spelpaus is the Swedish national self-exclusion register. Players who register are blocked from all licensed gambling operators in Sweden for a period of 1,  3, or 6 months, or permanently.",
      },
      {
        question: "Are there bonus restrictions in Sweden?",
        answer: "Yes. Swedish gambling regulations limit operators to offering only one bonus per licence holder — typically a welcome bonus. Reload bonuses and free spins offers are restricted under current rules.",
      },
    ],
  },
  fi: {
    name: "Finland",
    flag: "\u{1F1EB}\u{1F1EE}",
    language: "fi",
    isoCode: "FI",
    hasCasinoData: true,
    regulator: "POLIISI",
    regulatorFull: "National Police Board (Poliisi)",
    regulatoryOverview:
      "Finland operates a monopoly system for gambling through Veikkaus, the state-owned operator. The National Police Board (Poliisi) oversees enforcement. While the monopoly model is in place, many Finnish players access international licensed operators. The Finnish government has been reviewing its gambling framework for potential reforms.",
    paymentLandscape:
      "Finnish players use a mix of international and local payment methods. Trustly bank transfers are popular. Visa, Mastercard, and e-wallets like Skrill, Neteller, and PayPal are widely available. Paysafecard and Klarna are also commonly used. Apple Pay adoption is growing.",
    popularPayments: ["Trustly", "Visa", "Mastercard", "Skrill", "PayPal"],
    currency: "EUR",
    relevantGuides: [
      { slug: "payment-methods-guide", label: "Payment Methods Guide" },
      { slug: "casino-licensing-guide", label: "Licensing Guide" },
      { slug: "responsible-gambling-tips", label: "Responsible Gambling" },
    ],
    faqItems: [
      {
        question: "Is online gambling legal in Finland?",
        answer: "Finland operates a state monopoly on gambling through Veikkaus. While many Finnish players access international operators, the legal framework is based on the monopoly model. Reforms are being considered.",
      },
      {
        question: "What is Veikkaus?",
        answer: "Veikkaus is the state-owned gambling operator in Finland. It holds the exclusive right to offer casino games, lottery, and sports betting within Finland.",
      },
      {
        question: "Can Finnish players use international online casinos?",
        answer: "Finnish players can access international licensed operators, though the Finnish monopoly framework means these operators are not licensed within Finland. Players should ensure any operator they use holds a valid international licence.",
      },
    ],
  },
  no: {
    name: "Norway",
    flag: "\u{1F1F3}\u{1F1F4}",
    language: "no",
    isoCode: "NO",
    hasCasinoData: true,
    regulator: "Lotteritilsynet",
    regulatorFull: "Norwegian Lottery Authority (Lotteritilsynet)",
    regulatoryOverview:
      "Norway operates a strict monopoly system for gambling through Norsk Tipping and Norsk Rikstoto. The Norwegian Lottery Authority (Lotteritilsynet) enforces the Gambling Act. Unlicensed foreign operators are blocked by payment service providers under the Payment Blocking Regulation. Norwegian players accessing unlicensed sites face potential payment restrictions.",
    paymentLandscape:
      "Norwegian players primarily use Visa and Mastercard, though some banks restrict gambling transactions. Trustly is available at some operators. E-wallets like Skrill, Neteller, and PayPal are commonly used. Paysafecard and Klarna provide additional options. Apple Pay is growing in popularity.",
    popularPayments: ["Visa", "Mastercard", "Skrill", "PayPal", "Paysafecard"],
    currency: "NOK",
    relevantGuides: [
      { slug: "payment-methods-guide", label: "Payment Methods Guide" },
      { slug: "casino-licensing-guide", label: "Licensing Guide" },
      { slug: "responsible-gambling-tips", label: "Responsible Gambling" },
    ],
    faqItems: [
      {
        question: "Is online gambling legal in Norway?",
        answer: "Norway operates a state monopoly on gambling through Norsk Tipping and Norsk Rikstoto. Online casino games from unlicensed foreign operators are restricted under Norwegian law.",
      },
      {
        question: "What is Norsk Tipping?",
        answer: "Norsk Tipping is the state-owned gambling company in Norway, offering lottery, sports betting, and casino games. It is the only legal operator for most forms of gambling in Norway.",
      },
      {
        question: "Can Norwegian players use international online casinos?",
        answer: "Norwegian players can technically access international operators, but payment blocking regulations mean many banks and payment providers are required to block transactions to unlicensed gambling sites.",
      },
    ],
  },
};

type Props = {
  params: Promise<{ geo: string }>;
};

export function generateStaticParams() {
  return SUPPORTED_GEOS.map((geo) => ({ geo }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { geo } = await params;
  const config = geoConfig[geo as Geo];
  if (!config) return {};

  const isGerman = geo === "de";

  const title = isGerman
    ? `Online-Casinos in Deutschland \u2014 BeInCasinos`
    : `Best Online Casinos in ${config.name} \u2014 BeInCasinos`;
  const description = isGerman
    ? `GGL-lizenzierte Online-Casinos f\u00FCr deutsche Spieler. Verifizierte Daten zu Lizenzen, Zahlungsmethoden und verantwortungsbewusstem Spielen.`
    : `Find the best online casinos in ${config.name} with BeInCasinos' independent reviews and comparisons. Personalized recommendations for ${config.name} players.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/${geo}`,
      languages: {
        "en": `/${geo}`,
      },
    },
    openGraph: {
      title,
      description: isGerman
        ? `GGL-lizenzierte Online-Casinos mit verifizierten Daten f\u00FCr deutsche Spieler.`
        : `Independent casino reviews for ${config.name} players.`,
    },
    twitter: {
      card: "summary",
      title,
      description: isGerman
        ? `GGL-lizenzierte Online-Casinos mit verifizierten Daten f\u00FCr deutsche Spieler.`
        : `Independent casino reviews for ${config.name} players.`,
    },
  };
}

export default async function GeoPage({ params }: Props) {
  const { geo } = await params;
  const config = geoConfig[geo as Geo];

  if (!config) notFound();

  const geoUpper = geo.toUpperCase();

  // Single provider call for all casino data on this GEO page
  const allCasinos = getFullDatasetCasinos();
  const casinos = config.hasCasinoData
    ? allCasinos.filter(
        (c) =>
          c.status === "active" &&
          c.verificationStatus === "verified" &&
          c.countries.includes(geoUpper)
      )
    : [];

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
        name: `${config.name} Casinos`,
        item: `${SITE_URL}/${geo}`,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: config.faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const countrySchema = {
    "@context": "https://schema.org",
    "@type": "Country",
    name: config.name,
    iso31661Alpha2: config.isoCode,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(countrySchema) }}
      />
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">{config.flag}</span>
            <h1 className="text-3xl sm:text-4xl font-bold">
              Best Online Casinos in {config.name}
            </h1>
          </div>

          <p className="text-lg text-muted mb-8">
            Find the best online casinos available in {config.name} with BeInCasinos&apos;
            independent reviews and comparisons. Get personalized
            recommendations based on your preferences.
          </p>

          {config.legalNote && (
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800 p-8 text-center mb-8">
              <p className="text-amber-800 dark:text-amber-200 font-semibold mb-2">
                Regulatory Notice
              </p>
              <p className="text-amber-700 dark:text-amber-300 text-sm mb-4">
                {config.legalNote}
              </p>
              <Button href="/ai-casino-match" variant="primary">
                Try AI Matchmaker
              </Button>
            </div>
          )}

          {config.hasCasinoData && casinos.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">
                Licensed Casinos in {config.name} ({casinos.length})
              </h2>
              <CasinoGrid casinos={casinos} baseUrl={`/${geo}`} />
            </div>
          )}

          {config.hasCasinoData && casinos.length === 0 && (
            <div className="bg-surface-elevated rounded-2xl border border-border p-8 text-center mb-8">
              <p className="text-muted mb-4">
                Casino data for {config.name} is being prepared.
              </p>
              <p className="text-sm text-muted mb-6">
                We are building verified casino profiles for {config.name} players.
                Check back soon for personalized recommendations.
              </p>
              <Button href="/ai-casino-match" variant="primary">
                Try AI Matchmaker
              </Button>
            </div>
          )}

          <div className="space-y-10">
            {/* Regulatory Overview */}
            <section>
              <h2 className="text-2xl font-bold mb-3">
                Online Gambling in {config.name}: {config.regulatorFull}
              </h2>
              <p className="text-muted leading-relaxed">
                {config.regulatoryOverview}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs bg-surface-elevated text-muted px-3 py-1 rounded-full border border-border">
                  Regulator: {config.regulator}
                </span>
                <span className="text-xs bg-surface-elevated text-muted px-3 py-1 rounded-full border border-border">
                  Currency: {config.currency}
                </span>
                <span className="text-xs bg-surface-elevated text-muted px-3 py-1 rounded-full border border-border">
                  Language: {config.language.toUpperCase()}
                </span>
              </div>
            </section>

            {/* Payment Landscape */}
            <section>
              <h2 className="text-2xl font-bold mb-3">Payment Methods in {config.name}</h2>
              <p className="text-muted leading-relaxed mb-4">
                {config.paymentLandscape}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {(() => {
                  const entityMap = buildPaymentEntityMap(allCasinos);
                  const geoPayments = getGeoToPayments(entityMap, geoUpper, allCasinos);
                  const topPayments = geoPayments.slice(0, 6);
                  if (topPayments.length === 0) {
                    return config.popularPayments.map((pm) => (
                      <span
                        key={pm}
                        className="text-xs bg-surface-elevated text-muted px-3 py-1 rounded-full border border-border"
                      >
                        {pm}
                      </span>
                    ));
                  }
                  return topPayments.map((pm) => (
                    <Link
                      key={pm.slug}
                      href={`/payments/${pm.slug}`}
                      className="text-xs bg-surface-elevated text-muted px-3 py-1 rounded-full border border-border hover:border-primary/30 transition-colors"
                    >
                      {pm.canonicalName}
                    </Link>
                  ));
                })()}
              </div>
              <Link href="/payments" className="text-sm text-primary hover:underline">
                View all payment methods &rarr;
              </Link>
            </section>

            {/* How We Match */}
            <section>
              <h2 className="text-2xl font-bold mb-3">How We Match Casinos for {config.name}</h2>
              <p className="text-muted leading-relaxed mb-3">
                Our matching system considers {config.name}-specific factors to find the best casinos:
              </p>
              <ul className="list-disc list-inside text-muted space-y-1">
                <li>Casinos licensed by {config.regulator} to operate in {config.name}</li>
                <li>Payment methods popular with {config.name} players</li>
                <li>{config.currency} currency support</li>
                <li>Your personal preferences for games, bonuses, and more</li>
              </ul>
            </section>

            {/* Relevant Guides */}
            <section>
              <h2 className="text-2xl font-bold mb-3">Useful Guides for {config.name} Players</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {config.relevantGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="block bg-surface-elevated rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all"
                  >
                    <h3 className="font-semibold text-foreground">{guide.label}</h3>
                    <p className="text-sm text-muted mt-1">
                      Read our guide on {guide.label.toLowerCase()} for {config.name} players.
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Compare CTA */}
            {(() => {
              const selectedSlugs = selectCasinosForGeoComparison(geoUpper, allCasinos);
              const compareUrl = selectedSlugs.length >= 2
                ? buildComparisonUrl(selectedSlugs)
                : "/compare";
              return (
                <section>
                  <div className="bg-surface-elevated rounded-2xl border border-border p-8 text-center">
                    <h2 className="text-2xl font-bold mb-3">Compare Casinos in {config.name}</h2>
                    <p className="text-muted leading-relaxed mb-6">
                      {selectedSlugs.length >= 2
                        ? `Compare ${selectedSlugs.length} verified ${config.name} casinos side by side.`
                        : `Use our comparison tool to find the best ${config.name}-licensed casinos side by side.`}
                      {" "}Compare bonuses, payment methods, game selections, and more.
                    </p>
                    <Button href={compareUrl} variant="primary">
                      {selectedSlugs.length >= 2 ? "Compare Selected Casinos" : "Compare Casinos"}
                    </Button>
                  </div>
                </section>
              );
            })()}

            {/* Methodology Link */}
            <section>
              <p className="text-sm text-muted leading-relaxed">
                Learn more about our independent review process and how we evaluate casinos
                in our{' '}
                <Link href="/methodology" className="text-primary hover:underline">
                  Methodology
                </Link>{' '}
                section.
              </p>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-2xl font-bold mb-4">
                Frequently Asked Questions \u2014 {config.name}
              </h2>
              <div className="space-y-4">
                {config.faqItems.map((faq, i) => (
                  <div key={i} className="bg-surface-elevated rounded-xl border border-border p-5">
                    <h3 className="font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p className="text-sm text-muted leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Responsible Gambling */}
            <section>
              <h2 className="text-2xl font-bold mb-3">Responsible Gambling in {config.name}</h2>
              <p className="text-muted leading-relaxed">
                Gambling should be entertaining. Never bet more than you can afford to lose.
                If you need help, visit our{' '}
                <Link href="/responsible-gambling" className="text-primary hover:underline">
                  Responsible Gambling
                </Link>{' '}
                page for resources and support.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </>
  );
}
