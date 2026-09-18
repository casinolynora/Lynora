export type AnalyticsEvent =
  | { type: "ai_match_started"; timestamp: number }
  | { type: "ai_questionnaire_completed"; timestamp: number; country: string; gameCount: number }
  | { type: "ai_match_results_viewed"; timestamp: number; resultCount: number; topMatchPct: number }
  | { type: "ai_result_clicked"; timestamp: number; casinoId: string; position: number; matchPct: number }
  | { type: "ai_review_clicked"; timestamp: number; casinoId: string; position: number }
  | { type: "ai_affiliate_clicked"; timestamp: number; casinoId: string; position: number; geo: string }
  | { type: "ai_refinement_started"; timestamp: number }
  | { type: "ai_refinement_completed"; timestamp: number; changeDescription: string };

export interface AnalyticsProvider {
  track(event: AnalyticsEvent): void;
  flush(): void;
}

// Console logger (development fallback)
const consoleProvider: AnalyticsProvider = {
  track(event) {
    if (typeof window !== "undefined") {
      console.debug("[Analytics]", event.type, event);
    }
  },
  flush() {},
};

// Google Analytics 4 provider (production)
function createGA4Provider(): AnalyticsProvider {
  return {
    track(event) {
      if (typeof window === "undefined" || typeof window.gtag !== "function") return;

      const gaEvent = mapToGA4Event(event);
      if (gaEvent) {
        window.gtag("event", gaEvent.name, gaEvent.params);
      }
    },
    flush() {
      // GA4 auto-flushes
    },
  };
}

function mapToGA4Event(event: AnalyticsEvent): { name: string; params: Record<string, string | number> } | null {
  switch (event.type) {
    case "ai_match_started":
      return { name: "ai_match_started", params: {} };
    case "ai_questionnaire_completed":
      return { name: "ai_questionnaire_completed", params: { country: event.country, game_count: event.gameCount } };
    case "ai_match_results_viewed":
      return { name: "ai_match_results_viewed", params: { result_count: event.resultCount, top_match_pct: event.topMatchPct } };
    case "ai_result_clicked":
      return { name: "ai_result_clicked", params: { casino_id: event.casinoId, position: event.position, match_pct: event.matchPct } };
    case "ai_review_clicked":
      return { name: "ai_review_clicked", params: { casino_id: event.casinoId, position: event.position } };
    case "ai_affiliate_clicked":
      return { name: "ai_affiliate_clicked", params: { casino_id: event.casinoId, position: event.position, geo: event.geo } };
    case "ai_refinement_started":
      return { name: "ai_refinement_started", params: {} };
    case "ai_refinement_completed":
      return { name: "ai_refinement_completed", params: { change_description: event.changeDescription } };
    default:
      return null;
  }
}

let activeProvider: AnalyticsProvider = consoleProvider;

export function initAnalytics(): void {
  if (typeof window === "undefined") return;

  const consent = localStorage.getItem("beincasinos_cookie_consent");
  if (consent !== "accepted") return;

  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  if (gaId) {
    activeProvider = createGA4Provider();
  }
}

export function trackEvent(event: AnalyticsEvent): void {
  activeProvider.track(event);
}

export function flushAnalytics(): void {
  activeProvider.flush();
}

// GA4 gtag type declaration
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}
