"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function LanguageSync() {
  const pathname = usePathname();

  useEffect(() => {
    const html = document.documentElement;
    if (pathname.startsWith("/de")) {
      html.setAttribute("lang", "de");
    } else {
      html.setAttribute("lang", "en");
    }
  }, [pathname]);

  return null;
}
