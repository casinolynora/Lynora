"use client";

import { useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/casinos", label: "Casinos" },
  { href: "/ai-casino-match", label: "AI Matchmaker" },
  { href: "/compare", label: "Compare" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <a href="#main-content" className="skip-link">Skip to content</a>
      <header className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary text-white text-sm font-black" aria-hidden="true">
              CL
            </span>
            <span className="gradient-primary-text">CasinoLynora</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/ai-casino-match"
              className="gradient-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Find My Casino
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-muted hover:text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {mobileOpen && (
          <nav id="mobile-menu" className="md:hidden border-t border-border bg-surface" aria-label="Mobile navigation">
            <div className="flex flex-col p-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-muted hover:text-foreground hover:bg-surface-elevated transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/ai-casino-match"
                className="gradient-primary text-white px-5 py-3 rounded-xl text-sm font-semibold text-center mt-2 shadow-lg"
                onClick={() => setMobileOpen(false)}
              >
                Find My Casino
              </Link>
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
