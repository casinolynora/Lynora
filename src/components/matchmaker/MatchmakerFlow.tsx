"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Questionnaire } from "./Questionnaire";
import { MatchResults } from "./MatchResults";
import { casinoDb } from "@/lib/data/accessor";
import type { UserPreferences, MatchResult } from "@/lib/types";

type FlowState = "entry" | "questionnaire" | "loading" | "results" | "error";

const ANALYSIS_STAGES = [
  "Reviewing your preferences",
  "Checking verified casino data",
  "Calculating compatibility",
  "Preparing your matches",
];

export function MatchmakerFlow() {
  const [state, setState] = useState<FlowState>("entry");
  const [results, setResults] = useState<MatchResult[]>([]);
  const [country, setCountry] = useState("INT");
  const [_error, setError] = useState("");
  const [analysisStage, setAnalysisStage] = useState(0);
  const [refineInput, setRefineInput] = useState("");
  const [refining, setRefining] = useState(false);
  const [lastPreferences, setLastPreferences] = useState<UserPreferences | null>(null);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout);
    };
  }, []);

  const handleStart = () => setState("questionnaire");

  const handleComplete = useCallback(async (preferences: UserPreferences) => {
    setState("loading");
    setCountry(preferences.country);
    setAnalysisStage(0);
    setLastPreferences(preferences);

    const stageTimers: ReturnType<typeof setTimeout>[] = [];
    timersRef.current = stageTimers;
    ANALYSIS_STAGES.forEach((_, i) => {
      if (i < ANALYSIS_STAGES.length - 1) {
        stageTimers.push(setTimeout(() => setAnalysisStage(i + 1), 600 + i * 700));
      }
    });

    try {
      const response = await fetch("/api/ai/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) throw new Error("Failed to get matches");

      const data = await response.json();
      stageTimers.push(setTimeout(() => {
        setResults(data.results || []);
        setState("results");
      }, 300));
    } catch (err) {
      stageTimers.forEach(clearTimeout);
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  }, []);

  const handleRefine = useCallback(async () => {
    if (!refineInput.trim() || !lastPreferences) return;
    setRefining(true);
    try {
      const response = await fetch("/api/ai/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: refineInput, currentPreferences: lastPreferences }),
      });

      if (!response.ok) throw new Error("Refinement failed");

      const data = await response.json();
      if (data.updatedPreferences) {
        setLastPreferences(data.updatedPreferences);
        const matchResponse = await fetch("/api/ai/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data.updatedPreferences),
        });
        if (matchResponse.ok) {
          const matchData = await matchResponse.json();
          setResults(matchData.results || []);
        }
      }
      setRefineInput("");
    } catch {
      setError("Refinement unavailable. Please try again.");
    } finally {
      setRefining(false);
    }
  }, [refineInput, lastPreferences]);

  const handleStartOver = () => {
    setState("entry");
    setResults([]);
    setError("");
    setAnalysisStage(0);
    setRefineInput("");
  };

  const allCasinos = useMemo(() => casinoDb.getAllCasinos(), []);

  return (
    <main id="main-content">
      {/* ─── ENTRY SCREEN ──────────────────────────────────────────── */}
      {state === "entry" && (
        <section className="matchmaker-bg min-h-[90vh] flex items-center">
          <Container className="relative z-10 py-20 lg:py-28">
            <div className="max-w-3xl mx-auto text-center">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8">
                <svg className="w-4 h-4 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
                <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">AI Casino Matchmaker</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 text-balance">
                Find the casino
                <br />
                <span className="text-slate-300">that fits you.</span>
              </h1>

              {/* Supporting copy */}
              <p className="text-lg sm:text-xl text-slate-300/80 max-w-2xl mx-auto mb-12 leading-relaxed">
                Answer a few questions about how you play, what matters to you, and which features you prefer.
                BeInCasinos uses your preferences and verified casino data to create a personalized match.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button variant="brand" size="lg" onClick={handleStart}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start Matching
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-slate-300 hover:text-white hover:bg-white/10 border border-white/10"
                  onClick={() => {
                    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  How it works
                </Button>
              </div>

              {/* How it works — 3 steps */}
              <div id="how-it-works" className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                {[
                  {
                    step: "01",
                    title: "Tell us about you",
                    description: "Country, budget, payment method, games, and features.",
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    ),
                  },
                  {
                    step: "02",
                    title: "We analyze verified data",
                    description: "Our engine scores casinos against your preferences using structured data.",
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                      </svg>
                    ),
                  },
                  {
                    step: "03",
                    title: "Get your matches",
                    description: "Personalized results with clear explanations of why each one fits.",
                    icon: (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                  },
                ].map((item, i) => (
                  <div
                    key={item.step}
                    className="p-6 rounded-[var(--radius-xl)] border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-accent-500/10 text-accent-400 border border-accent-500/20">
                        {item.icon}
                      </div>
                      <span className="text-[11px] font-bold text-white/30 uppercase tracking-widest">Step {item.step}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1.5">{item.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>

              {/* Trust signals */}
              <div className="mt-12 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verified data only
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                  Transparent scoring
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  No fake reviews
                </span>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ─── QUESTIONNAIRE ─────────────────────────────────────────── */}
      {state === "questionnaire" && (
        <section className="matchmaker-bg min-h-screen">
          <Container className="relative z-10 py-8 lg:py-12">
            <Questionnaire onComplete={handleComplete} onBack={() => setState("entry")} />
          </Container>
        </section>
      )}

      {/* ─── LOADING / ANALYSIS ────────────────────────────────────── */}
      {state === "loading" && (
        <section className="matchmaker-bg min-h-screen flex items-center">
          <Container className="relative z-10 py-20">
            <div className="max-w-md mx-auto text-center">
              {/* Animated icon */}
              <div className="w-20 h-20 mx-auto mb-8 rounded-full gradient-brand flex items-center justify-center animate-pulse-subtle shadow-lg shadow-brand-500/20">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">Analyzing your preferences</h2>
              <p className="text-slate-300/70 mb-10">Our engine is scoring casinos against your criteria.</p>

              {/* Staged progress */}
              <div className="space-y-3 text-left max-w-xs mx-auto">
                {ANALYSIS_STAGES.map((stage, i) => (
                  <div
                    key={stage}
                    className="flex items-center gap-3"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    {i <= analysisStage ? (
                      <div className="w-5 h-5 rounded-full bg-accent-500 flex items-center justify-center flex-shrink-0 animate-check-pop">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-white/10 flex-shrink-0" />
                    )}
                    <span className={`text-sm transition-colors duration-300 ${
                      i <= analysisStage ? "text-white" : "text-white/30"
                    }`}>
                      {stage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ─── RESULTS ───────────────────────────────────────────────── */}
      {state === "results" && (
        <section className="matchmaker-bg min-h-screen">
          <Container className="relative z-10 py-8 lg:py-12">
            {/* Results header */}
            <div className="max-w-3xl mx-auto mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold text-accent-400 uppercase tracking-wider mb-2">Your Matches</p>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    {results.length > 0 ? "Your best matches" : "No strong matches found"}
                  </h1>
                  <p className="text-sm text-slate-300/60 mt-1">
                    {results.length > 0
                      ? `${results.length} casino${results.length !== 1 ? "s" : ""} matched your preferences. Based on verified data and your selections.`
                      : "We could not find strong matches for your current preferences."}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleStartOver} className="text-slate-300 hover:text-white hover:bg-white/10 border border-white/10">
                  Start Over
                </Button>
              </div>
            </div>

            <div className="max-w-3xl mx-auto">
              <MatchResults results={results} casinos={allCasinos} country={country} baseUrl="" />

              {/* Empty state */}
              {results.length === 0 && (
                <div className="mt-6 p-8 rounded-[var(--radius-xl)] border border-white/[0.06] bg-white/[0.03] text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">We could not find a strong match yet.</h3>
                  <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
                    This may be because there are limited verified casinos for your region, or your
                    preferences are very specific. You can adjust your criteria and try again.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button variant="primary" size="sm" onClick={handleStartOver}>Adjust Preferences</Button>
                    <Button href="/casinos" variant="secondary" size="sm" className="border-white/10 text-white hover:bg-white/10">Browse Casinos</Button>
                  </div>
                </div>
              )}

              {/* Refine section */}
              {results.length > 0 && (
                <div className="mt-8 p-6 rounded-[var(--radius-xl)] border border-white/[0.06] bg-white/[0.03]">
                  <h3 className="font-bold text-white mb-1">Refine your matches</h3>
                  <p className="text-sm text-slate-400 mb-4">
                    Want to adjust your criteria? Tell us what you would like to change.
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={refineInput}
                      onChange={(e) => setRefineInput(e.target.value)}
                      placeholder="e.g., I prefer casinos with PayPal..."
                      className="flex-1 rounded-[var(--radius-md)] border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500/50"
                      onKeyDown={(e) => { if (e.key === "Enter") handleRefine(); }}
                    />
                    <Button
                      variant="primary"
                      size="md"
                      onClick={handleRefine}
                      disabled={refining || !refineInput.trim()}
                    >
                      {refining ? "Updating..." : "Update"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Responsible gambling */}
              <div className="mt-10 p-4 rounded-[var(--radius-lg)] border border-white/[0.04] bg-white/[0.02] text-center">
                <p className="text-xs text-slate-500">
                  Gambling should be entertaining, not a way to make money. Never bet more than you can afford to lose. Must be 18+.
                </p>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* ─── ERROR ─────────────────────────────────────────────────── */}
      {state === "error" && (
        <section className="matchmaker-bg min-h-screen flex items-center">
          <Container className="relative z-10 py-20">
            <div className="max-w-md mx-auto text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">We could not complete the match right now.</h2>
              <p className="text-slate-300/60 mb-8">Your answers are safe. Please try again.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="primary" onClick={handleStartOver}>Try Again</Button>
                <Button href="/" variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 border border-white/10">Go Home</Button>
              </div>
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}
