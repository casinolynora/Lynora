"use client";

import { useState, useCallback } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Questionnaire } from "./Questionnaire";
import { MatchResults } from "./MatchResults";
import { casinoDb } from "@/lib/data/accessor";
import type { UserPreferences, MatchResult } from "@/lib/types";

type FlowState = "questionnaire" | "loading" | "results" | "error" | "refining";

export function MatchmakerFlow() {
  const [state, setState] = useState<FlowState>("questionnaire");
  const [results, setResults] = useState<MatchResult[]>([]);
  const [country, setCountry] = useState("INT");
  const [error, setError] = useState("");
  const [refining, setRefining] = useState(false);

  const handleComplete = useCallback(async (preferences: UserPreferences) => {
    setState("loading");
    setCountry(preferences.country);

    try {
      const response = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) throw new Error("Failed to get matches");

      const data = await response.json();
      setResults(data.results || []);
      setState("results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }, []);

  const handleRefine = useCallback(async (query: string) => {
    setRefining(true);
    try {
      const response = await fetch("/api/ai/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, currentResults: results }),
      });

      if (!response.ok) throw new Error("Refinement failed");

      const data = await response.json();
      if (data.refinedResults) setResults(data.refinedResults);
    } catch {
      // Silently handle refinement errors
    } finally {
      setRefining(false);
    }
  }, [results]);

  const handleStartOver = () => {
    setState("questionnaire");
    setResults([]);
    setError("");
  };

  const allCasinos = casinoDb.getAllCasinos();

  return (
    <Container className="py-8 lg:py-12">
      {state === "questionnaire" && (
        <div>
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">AI Casino Matchmaker</h1>
            <p className="text-muted text-lg max-w-xl mx-auto">
              Answer a few questions about your preferences, and we will match you with the best
              casinos using our data-driven recommendation engine.
            </p>
          </div>
          <Questionnaire onComplete={handleComplete} />
        </div>
      )}

      {state === "loading" && (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full gradient-brand flex items-center justify-center animate-pulse-subtle">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Analyzing your preferences</h2>
          <p className="text-muted">Our engine is scoring casinos against your criteria...</p>
        </div>
      )}

      {state === "error" && (
        <div className="text-center py-20 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted mb-6">{error}</p>
          <Button variant="primary" onClick={handleStartOver}>Try Again</Button>
        </div>
      )}

      {state === "results" && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Your Matches</h1>
              <p className="text-sm text-muted">{results.length} casino{results.length !== 1 ? "s" : ""} match your preferences</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleStartOver}>
              Start Over
            </Button>
          </div>

          <MatchResults
            results={results}
            casinos={allCasinos}
            country={country}
          />

          {/* Refinement */}
          <div className="mt-8 card-static p-6">
            <h3 className="font-bold mb-3">Refine your results</h3>
            <p className="text-sm text-muted mb-4">
              Want to adjust your criteria? Tell us what you would like to change.
            </p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="e.g., I prefer casinos with PayPal..."
                className="flex-1 rounded-[var(--radius-lg)] border border-border bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    handleRefine(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  const input = document.querySelector<HTMLInputElement>(".card-static input[type='text']");
                  if (input?.value.trim()) {
                    handleRefine(input.value);
                    input.value = "";
                  }
                }}
                disabled={refining}
              >
                {refining ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
