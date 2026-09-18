"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

function getInitialVisibility(): boolean {
  if (typeof window === "undefined") return false;
  return !localStorage.getItem("beincasinos_cookie_consent");
}

export function CookieConsent() {
  const [visible, setVisible] = useState(getInitialVisibility);

  const handleAccept = () => {
    localStorage.setItem("beincasinos_cookie_consent", "accepted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("beincasinos_cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="mx-auto max-w-2xl card-static p-5 shadow-xl animate-fade-in-up">
        <p className="text-sm text-muted mb-4">
          We use essential cookies to make this site work. Optional analytics cookies help us
          improve the site. You can choose to accept or decline analytics cookies.
        </p>
        <div className="flex items-center gap-3 justify-end">
          <Button variant="ghost" size="sm" onClick={handleDecline}>
            Decline
          </Button>
          <Button variant="primary" size="sm" onClick={handleAccept}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
