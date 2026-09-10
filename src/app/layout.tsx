import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { AnalyticsInit } from "@/components/analytics/AnalyticsInit";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4F46E5",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://casinolynora.com";

export const metadata: Metadata = {
  title: {
    default: "CasinoLynora — AI-Powered Casino Matching",
    template: "%s | CasinoLynora",
  },
  description:
    "Find the perfect online casino with CasinoLynora's AI-powered matching. Answer a few questions and get personalized casino recommendations based on your preferences.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "CasinoLynora",
    title: "CasinoLynora — AI-Powered Casino Matching",
    description:
      "Find the perfect online casino with AI-powered matching. Personalized recommendations based on your preferences.",
    url: siteUrl,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "CasinoLynora — AI-Powered Casino Matching",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CasinoLynora — AI-Powered Casino Matching",
    description:
      "Find the perfect online casino with AI-powered matching. Personalized recommendations based on your preferences.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.svg",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CasinoLynora",
  url: siteUrl,
  description: "AI-powered casino comparison platform for European players.",
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "CasinoLynora",
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl}/casinos?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-white focus:text-primary">
          Skip to content
        </a>
        <AnalyticsInit />
        <Header />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
