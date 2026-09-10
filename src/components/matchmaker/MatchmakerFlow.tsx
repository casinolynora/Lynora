"use client";

import { useState, useCallback, useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Questionnaire } from "@/components/matchmaker/Questionnaire";
import { MatchResults } from "@/components/matchmaker/MatchResults";
import { Button } from "@/components/ui/Button";
import { UserPreferences, MatchResult, Casino } from "@/lib/types";
import { AIExplanationResponse } from "@/lib/ai/provider";
import { trackEvent } from "@/lib/analytics/events";

type AppState = "questionnaire" | "loading" | "results" | "error" | "refining";

type ResultWithAI = MatchResult & { aiExplanation?: AIExplanationResponse };

type MatchApiResponse = {
  results: ResultWithAI[];
  preferences: UserPreferences;
  casinoData: Record<string, Casino>;
};

export function MatchmakerFlow() {
  const [state, setState] = useState<AppState>("questionnaire");
  const [results, setResults] = useState<ResultWithAI[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [casinoDataMap, setCasinoDataMap] = useState<Record<string, Casino>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [refinementInput, setRefinementInput] = useState("");
  const [refinementLoading, setRefinementLoading] = useState(false);
  const [refinementMessage, setRefinementMessage] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleComplete = useCallback(async (prefs: UserPreferences) => {
    setPreferences(prefs);
    setState("loading");
    setErrorMessage(null);
    trackEvent({ type: "ai_match_started", timestamp: Date.now() });

    try {
      const response = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error ?? `Request failed (${response.status})`);
      }

      const data: MatchApiResponse = await response.json();
      setResults(data.results);
      setCasinoDataMap(data.casinoData ?? {});
      setState("results");

      trackEvent({
        type: "ai_questionnaire_completed",
        timestamp: Date.now(),
        country: prefs.country,
        gameCount: prefs.preferredGames.length,
      });

      trackEvent({
        type: "ai_match_results_viewed",
        timestamp: Date.now(),
        resultCount: data.results.length,
        topMatchPct: data.results[0]?.matchPercentage ?? 0,
      });
    } catch (error) {
      console.error("Matchmaker error:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong while processing your preferences. Please try again."
      );
      setState("error");
    }
  }, []);

  const handleRestart = useCallback(() => {
    setState("questionnaire");
    setResults([]);
    setPreferences(null);
    setCasinoDataMap({});
    setErrorMessage(null);
    setRefinementInput("");
    setRefinementMessage(null);
  }, []);

  const handleRefine = useCallback(async () => {
    if (!refinementInput.trim() || !preferences) return;

    setRefinementLoading(true);
    setRefinementMessage(null);
    trackEvent({ type: "ai_refinement_started", timestamp: Date.now() });

    try {
      const response = await fetch("/api/ai/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: refinementInput.trim(),
          currentPreferences: preferences,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error ?? "Refinement failed");
      }

      const data = await response.json();
      setRefinementMessage(data.changeDescription);
      setRefinementInput("");

      // Re-run match with updated preferences
      const updatedPrefs = data.updatedPreferences as UserPreferences;
      setPreferences(updatedPrefs);
      setState("loading");

      const matchResponse = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPrefs),
      });

      if (!matchResponse.ok) throw new Error("Re-matching failed");

      const matchData: MatchApiResponse = await matchResponse.json();
      setResults(matchData.results);
      setCasinoDataMap(matchData.casinoData ?? {});
      setState("results");

      trackEvent({
        type: "ai_refinement_completed",
        timestamp: Date.now(),
        changeDescription: data.changeDescription,
      });
    } catch (error) {
      console.error("Refinement error:", error);
      setRefinementMessage("Could not process your refinement. Please try rephrasing.");
      setState("results");
    } finally {
      setRefinementLoading(false);
    }
  }, [refinementInput, preferences]);

  const casinos = results
    .map(r => casinoDataMap[r.casinoId])
    .filter(Boolean) as Casino[];

  return (
    <div className="min-h-[80vh]">
      <Container className="py-12 lg:py-20">
        {state === "questionnaire" && (
          <>
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                AI Casino Matchmaker
              </h1>
              <p className="text-muted max-w-xl mx-auto">
                Answer a few questions about your preferences, and we will match you
                with the best casinos using our data-driven recommendation engine.
              </p>
            </div>
            <Questionnaire onComplete={handleComplete} />
          </>
        )}

        {state === "loading" && (
          <div className="text-center py-20" role="status" aria-live="polite">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full gradient-primary mb-6 animate-pulse" aria-hidden="true">
              <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Analyzing your preferences...</h2>
            <p className="text-muted">Matching you with the best casinos from our database.</p>
          </div>
        )}

        {state === "error" && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
              <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-muted mb-6">{errorMessage}</p>
            <Button onClick={handleRestart} variant="primary">Try Again</Button>
          </div>
        )}

        {(state === "results" || state === "refining") && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-1">Your Best Matches</h1>
                <p className="text-muted">
                  Found {results.length} {results.length === 1 ? "casino" : "casinos"} matching your preferences.
                </p>
              </div>
              <Button onClick={handleRestart} variant="secondary" size="sm">
                Start Over
              </Button>
            </div>

            <MatchResults results={results} casinos={casinos} country={preferences?.country} baseUrl="" />

            {/* Conversational Refinement */}
            <div className="mt-12 bg-surface-elevated rounded-2xl border border-border p-6 lg:p-8">
              <h3 className="text-lg font-bold mb-2">Refine your preferences</h3>
              <p className="text-sm text-muted mb-4">
                Tell us what matters most to you in natural language. For example: &ldquo;I care more about fast withdrawals&rdquo; or &ldquo;Show me casinos with PayPal.&rdquo;
              </p>

              {refinementMessage && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
                  {refinementMessage}
                </div>
              )}

              <div className="flex gap-3">
                <textarea
                  ref={inputRef}
                  value={refinementInput}
                  onChange={(e) => setRefinementInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleRefine();
                    }
                  }}
                  placeholder="e.g. I want fast withdrawals and live casino..."
                  className="flex-1 rounded-xl border border-border bg-surface px-4 py-3 text-sm placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  rows={2}
                  disabled={refinementLoading}
                />
                <Button
                  onClick={handleRefine}
                  disabled={!refinementInput.trim() || refinementLoading}
                  variant="primary"
                  size="md"
                >
                  {refinementLoading ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Button onClick={handleRestart} variant="ghost" size="sm">
                Start completely over
              </Button>
            </div>
          </>
        )}

        {state === "questionnaire" && (
          <noscript>
            <div className="text-center py-12">
              <p className="text-muted">JavaScript is required to use the AI Casino Matchmaker.</p>
            </div>
          </noscript>
        )}
      </Container>
    </div>
  );
}
