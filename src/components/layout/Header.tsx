"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { href: "/casinos", label: "Casinos" },
  { href: "/ai-casino-match", label: "AI Matchmaker", highlight: true },
  { href: "/compare", label: "Compare" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

const germanyLinks = [
  { href: "/de", label: "Germany Home" },
  { href: "/de/casinos", label: "Casinos in DE" },
  { href: "/de/best-casinos", label: "Verified Casinos" },
  { href: "/de/guides", label: "Germany Guides" },
];

const netherlandsLinks = [
  { href: "/nl", label: "Netherlands Home" },
];

const belgiumLinks = [
  { href: "/be", label: "Belgium Home" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [deOpen, setDeOpen] = useState(false);
  const [nlOpen, setNlOpen] = useState(false);
  const [beOpen, setBeOpen] = useState(false);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header className="sticky top-0 z-50 border-b border-border bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)] gradient-brand text-white text-xs font-bold tracking-tight shadow-sm">
              CL
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground hidden sm:block">
              Casino<span className="gradient-brand-text">Lynora</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((link) =>
              link.highlight ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-3 py-2 text-sm font-semibold text-brand-800 hover:text-brand-600 transition-colors rounded-[var(--radius-md)] hover:bg-brand-50"
                >
                  {link.label}
                </Link>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors rounded-[var(--radius-md)] hover:bg-surface-hover"
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Germany dropdown */}
            <div className="relative">
              <button
                onClick={() => setDeOpen(!deOpen)}
                onBlur={() => setTimeout(() => setDeOpen(false), 150)}
                className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors rounded-[var(--radius-md)] hover:bg-surface-hover flex items-center gap-1"
                aria-expanded={deOpen}
                aria-haspopup="true"
              >
                🇩🇪 DE
                <svg className={`w-3.5 h-3.5 transition-transform ${deOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {deOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 rounded-[var(--radius-lg)] border border-border bg-white shadow-lg py-1.5 animate-fade-in">
                  {germanyLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Netherlands dropdown */}
            <div className="relative">
              <button
                onClick={() => setNlOpen(!nlOpen)}
                onBlur={() => setTimeout(() => setNlOpen(false), 150)}
                className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors rounded-[var(--radius-md)] hover:bg-surface-hover flex items-center gap-1"
                aria-expanded={nlOpen}
                aria-haspopup="true"
              >
                🇳🇱 NL
                <svg className={`w-3.5 h-3.5 transition-transform ${nlOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {nlOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 rounded-[var(--radius-lg)] border border-border bg-white shadow-lg py-1.5 animate-fade-in">
                  {netherlandsLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Belgium dropdown */}
            <div className="relative">
              <button
                onClick={() => setBeOpen(!beOpen)}
                onBlur={() => setTimeout(() => setBeOpen(false), 150)}
                className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors rounded-[var(--radius-md)] hover:bg-surface-hover flex items-center gap-1"
                aria-expanded={beOpen}
                aria-haspopup="true"
              >
                🇧🇪 BE
                <svg className={`w-3.5 h-3.5 transition-transform ${beOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {beOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 rounded-[var(--radius-lg)] border border-border bg-white shadow-lg py-1.5 animate-fade-in">
                  {belgiumLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button href="/ai-casino-match" variant="primary" size="sm">
              Find My Casino
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-[var(--radius-md)] hover:bg-surface-hover transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden border-t border-border bg-white animate-fade-in"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-4 py-3 text-sm font-medium text-muted hover:text-foreground hover:bg-surface-hover rounded-[var(--radius-md)] transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}

              <div className="border-t border-border my-2 pt-2">
                <p className="px-4 py-1 text-xs font-semibold text-text-faint uppercase tracking-wider">Germany</p>
                {germanyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-surface-hover rounded-[var(--radius-md)] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-border my-2 pt-2">
                <p className="px-4 py-1 text-xs font-semibold text-text-faint uppercase tracking-wider">Netherlands</p>
                {netherlandsLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-surface-hover rounded-[var(--radius-md)] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-border my-2 pt-2">
                <p className="px-4 py-1 text-xs font-semibold text-text-faint uppercase tracking-wider">Belgium</p>
                {belgiumLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-surface-hover rounded-[var(--radius-md)] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="pt-2">
                <Button href="/ai-casino-match" variant="primary" size="md" fullWidth>
                  Find My Casino
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
