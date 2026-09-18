import Link from "next/link";
import { Container } from "@/components/ui/Container";

const footerSections = [
  {
    title: "BeInCasinos",
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
      { href: "/de/best-casinos", label: "Verified Casinos" },
      { href: "/de/guides", label: "Germany Guides" },
    ],
  },
  {
    title: "For Operators",
    links: [
      { href: "/for-casinos", label: "List Your Casino" },
      { href: "/for-casinos/pricing", label: "Pricing" },
      { href: "/for-casinos/list-your-casino", label: "Submit Listing" },
      { href: "/for-casinos/contact", label: "Operator Contact" },
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
    <footer className="border-t border-border bg-white" role="contentinfo">
      <Container className="py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-foreground mb-4 tracking-tight">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <Link href="/" className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] gradient-brand text-white text-[10px] font-bold">
                  BIC
                </div>
                <span className="text-base font-bold tracking-tight text-foreground">
                  Be<span className="gradient-brand-text">In</span>Casinos
                </span>
              </Link>
              <p className="text-xs text-muted max-w-md leading-relaxed">
                Independent casino reviews and comparisons for European players. Structured, verified data
                for transparent decision-making.
              </p>
            </div>

            <div className="text-xs text-muted space-y-1.5 max-w-sm">
              <p>
                Affiliate Disclosure: BeInCasinos may earn commissions through affiliate links
                when monetization is enabled. This does not affect our data or recommendations.
              </p>
              <p>
                Gambling can be addictive. Please play responsibly. Must be 18+ to play.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-text-faint">
              &copy; {new Date().getFullYear()} BeInCasinos. All rights reserved.
            </p>
            <p className="text-xs text-text-faint">
              18+ | Play Responsibly
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
