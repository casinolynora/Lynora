"use client";

import { useState } from "react";

const COOKIE_CONSENT_KEY = "casinolynora_cookie_consent";

function getStoredConsent(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(COOKIE_CONSENT_KEY);
}

export function CookieConsent() {
  const [consent, setConsent] = useState<"accepted" | "declined" | null>(() => {
    const stored = getStoredConsent();
    if (stored === "accepted" || stored === "declined") return stored;
    return null;
  });

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setConsent("accepted");
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    setConsent("declined");
  };

  if (consent) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
    >
      <div className="max-w-4xl mx-auto bg-surface-elevated border border-border rounded-2xl shadow-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-bold mb-1">Cookie Preferences</h3>
            <p className="text-sm text-muted">
              We use essential cookies to make this site work. Optional analytics cookies help us
              improve the site. You can choose to accept or decline analytics cookies.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-surface-elevated transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
