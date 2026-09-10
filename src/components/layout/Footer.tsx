import Link from "next/link";
import { Container } from "@/components/ui/Container";

const footerSections = [
  {
    title: "CasinoLynora",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/methodology", label: "Our Methodology" },
      { href: "/responsible-gambling", label: "Responsible Gambling" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Discover",
    links: [
      { href: "/casinos", label: "All Casinos" },
      { href: "/ai-casino-match", label: "AI Matchmaker" },
      { href: "/compare", label: "Compare Casinos" },
      { href: "/guides", label: "Guides" },
    ],
  },
  {
    title: "Germany",
    links: [
      { href: "/de", label: "Germany Home" },
      { href: "/de/casinos", label: "Casinos in Germany" },
      { href: "/de/best-casinos", label: "Best Casinos in Germany" },
      { href: "/de/guides", label: "Germany Guides" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/responsible-gambling", label: "Responsible Gambling" },
      { href: "/affiliate-disclosure", label: "Affiliate Disclosure" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Use" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-elevated">
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-white text-xs font-black">
                  CL
                </span>
                <span className="font-bold gradient-primary-text">CasinoLynora</span>
              </div>
              <p className="text-xs text-muted max-w-md">
                AI-powered casino matching for European players. We use structured, verified data to help you find casinos that fit your preferences.
              </p>
            </div>
            <div className="text-xs text-muted max-w-sm text-left md:text-right">
              <p className="mb-2">
                <strong>Affiliate Disclosure:</strong> CasinoLynora earns commissions through affiliate links.
                This does not affect our ratings or recommendations.{' '}
                <Link href="/affiliate-disclosure" className="text-primary hover:underline">Learn more</Link>
              </p>
              <p>
                Gambling can be addictive. Please play responsibly. Must be 18+ to play.
              </p>
            </div>
          </div>
          <div className="mt-6 text-xs text-muted text-center">
            &copy; {new Date().getFullYear()} CasinoLynora. All rights reserved. 18+
          </div>
        </div>
      </Container>
    </footer>
  );
}
