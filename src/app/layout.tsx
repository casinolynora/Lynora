import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { AnalyticsInit } from "@/components/analytics/AnalyticsInit";

const BASE_URL = process.env.NEXT_PUBLIC_CANONICAL_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://casinolynora.com";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CasinoLynora — AI-Powered Casino Matching",
    template: "%s | CasinoLynora",
  },
  description: "AI-powered casino discovery platform for European players. Structured, verified data for transparent decision-making.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_CANONICAL_URL || "https://casinolynora.com"),
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "CasinoLynora",
    title: "CasinoLynora — AI-Powered Casino Matching",
    description: "AI-powered casino discovery platform for European players.",
  },
  twitter: {
    card: "summary",
    title: "CasinoLynora — AI-Powered Casino Matching",
    description: "AI-powered casino discovery platform for European players.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f2240",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "CasinoLynora",
              url: BASE_URL,
              description: "AI-powered casino discovery platform for European players.",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "CasinoLynora",
              url: BASE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: `${BASE_URL}/casinos?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
        <AnalyticsInit />
      </body>
    </html>
  );
}
