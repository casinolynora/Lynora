"use client";

import { useEffect } from "react";
import { initAnalytics } from "@/lib/analytics/events";

export function AnalyticsInit() {
  useEffect(() => {
    initAnalytics();
  }, []);

  return null;
}
