"use client";

import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";
import type { UserPreferences } from "@/lib/types";

type QuestionnaireProps = {
  onComplete: (preferences: UserPreferences) => void;
  onBack: () => void;
};

const STEPS = [
  { id: "country", title: "Where are you playing from?", subtitle: "This determines which casinos are available to you.", category: "Location" },
  { id: "deposit", title: "What is your typical deposit range?", subtitle: "We will match casinos that fit your budget.", category: "Budget" },
  { id: "payment", title: "Preferred payment method?", subtitle: "Choose the method you use most often.", category: "Payments" },
  { id: "games", title: "What games do you enjoy?", subtitle: "Select all that apply.", category: "Gameplay" },
  { id: "features", title: "Any specific features?", subtitle: "Toggle the ones that matter to you.", category: "Preferences" },
  { id: "bonus", title: "Bonus preferences?", subtitle: "What type of bonus interests you?", category: "Bonuses" },
];

const COUNTRIES = [
  { code: "DE", name: "Germany", flag: "\u{1F1E9}\u{1F1EA}" },
  { code: "AT", name: "Austria", flag: "\u{1F1E6}\u{1F1F9}" },
  { code: "CH", name: "Switzerland", flag: "\u{1F1E8}\u{1F1ED}" },
  { code: "NL", name: "Netherlands", flag: "\u{1F1F3}\u{1F1F1}" },
  { code: "BE", name: "Belgium", flag: "\u{1F1E7}\u{1F1EA}" },
  { code: "FR", name: "France", flag: "\u{1F1EB}\u{1F1F7}" },
  { code: "IT", name: "Italy", flag: "\u{1F1EE}\u{1F1F9}" },
  { code: "ES", name: "Spain", flag: "\u{1F1EA}\u{1F1F8}" },
  { code: "PT", name: "Portugal", flag: "\u{1F1F5}\u{1F1F9}" },
  { code: "SE", name: "Sweden", flag: "\u{1F1F8}\u{1F1EA}" },
  { code: "NO", name: "Norway", flag: "\u{1F1F3}\u{1F1F4}" },
  { code: "FI", name: "Finland", flag: "\u{1F1EB}\u{1F1EE}" },
  { code: "DK", name: "Denmark", flag: "\u{1F1E9}\u{1F1F0}" },
  { code: "IE", name: "Ireland", flag: "\u{1F1EE}\u{1F1EA}" },
  { code: "PL", name: "Poland", flag: "\u{1F1F5}\u{1F1F1}" },
  { code: "CZ", name: "Czech Republic", flag: "\u{1F1E8}\u{1F1FF}" },
  { code: "GR", name: "Greece", flag: "\u{1F1EC}\u{1F1F7}" },
  { code: "RO", name: "Romania", flag: "\u{1F1F7}\u{1F1F4}" },
  { code: "BG", name: "Bulgaria", flag: "\u{1F1E7}\u{1F1EC}" },
  { code: "HR", name: "Croatia", flag: "\u{1F1ED}\u{1F1F7}" },
  { code: "HU", name: "Hungary", flag: "\u{1F1ED}\u{1F1FA}" },
  { code: "SK", name: "Slovakia", flag: "\u{1F1F8}\u{1F1F0}" },
  { code: "SI", name: "Slovenia", flag: "\u{1F1F8}\u{1F1EE}" },
  { code: "EE", name: "Estonia", flag: "\u{1F1EA}\u{1F1EA}" },
  { code: "LV", name: "Latvia", flag: "\u{1F1F1}\u{1F1FB}" },
  { code: "LT", name: "Lithuania", flag: "\u{1F1F1}\u{1F1F9}" },
  { code: "LU", name: "Luxembourg", flag: "\u{1F1F1}\u{1F1FA}" },
  { code: "MT", name: "Malta", flag: "\u{1F1F2}\u{1F1F9}" },
  { code: "CY", name: "Cyprus", flag: "\u{1F1E8}\u{1F1FE}" },
  { code: "INT", name: "International", flag: "\u{1F30D}" },
];

const PAYMENT_METHODS = [
  { name: "Any Method", description: "No preference" },
  { name: "PayPal", description: "E-wallet" },
  { name: "Visa", description: "Credit/debit card" },
  { name: "Mastercard", description: "Credit/debit card" },
  { name: "Sofort", description: "Bank transfer" },
  { name: "Klarna", description: "Bank transfer" },
  { name: "Trustly", description: "Bank transfer" },
  { name: "Apple Pay", description: "Mobile" },
  { name: "Google Pay", description: "Mobile" },
  { name: "Neteller", description: "E-wallet" },
  { name: "Skrill", description: "E-wallet" },
  { name: "Paysafecard", description: "Prepaid" },
  { name: "Bank Transfer", description: "Direct transfer" },
  { name: "Bitcoin", description: "Cryptocurrency" },
  { name: "Ethereum", description: "Cryptocurrency" },
];

const GAME_TYPES = [
  { name: "Slots", icon: "\u{1F3B0}" },
  { name: "Live Casino", icon: "\u{1F3AF}" },
  { name: "Blackjack", icon: "\u{1F0CF}" },
  { name: "Roulette", icon: "\u{1F3B2}" },
  { name: "Poker", icon: "\u{1F0CC}" },
  { name: "Baccarat", icon: "\u{1F0A0}" },
  { name: "Game Shows", icon: "\u{1F39E}" },
  { name: "Sports Betting", icon: "\u26BD" },
];

const FEATURES = [
  { key: "hasLiveCasino" as const, label: "Live Casino", description: "Real dealers, real-time", icon: "\u{1F3AF}" },
  { key: "hasSportsBetting" as const, label: "Sports Betting", description: "Pre-match and live", icon: "\u26BD" },
  { key: "hasCrypto" as const, label: "Cryptocurrency", description: "BTC, ETH, and more", icon: "\u26CF" },
  { key: "hasMobile" as const, label: "Mobile Friendly", description: "Play on your phone", icon: "\u{1F4F1}" },
];

const BONUS_TYPES = [
  { value: "any", label: "Any Bonus", description: "Show me all available bonuses" },
  { value: "welcome", label: "Welcome Bonus", description: "Match on first deposit" },
  { value: "free-spins", label: "Free Spins", description: "Free spins on slots" },
  { value: "cashback", label: "Cashback", description: "Return on losses" },
  { value: "no-deposit", label: "No Deposit", description: "Bonus without depositing" },
  { value: "none", label: "No Bonus Needed", description: "Skip bonus matching" },
];

export function Questionnaire({ onComplete, onBack }: QuestionnaireProps) {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({});
  const [animating, setAnimating] = useState(false);
  const [animDirection, setAnimDirection] = useState<"forward" | "backward">("forward");

  const currentStep = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  const canContinue = useMemo(() => {
    switch (step) {
      case 0: return !!preferences.country;
      case 1: return preferences.minDeposit != null;
      case 2: return !!preferences.preferredPaymentMethod;
      case 3: return (preferences.preferredGames?.length ?? 0) > 0;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  }, [step, preferences]);

  const navigateStep = useCallback((direction: "forward" | "backward") => {
    setAnimating(true);
    setAnimDirection(direction);
    setTimeout(() => {
      if (direction === "forward") {
        setStep(s => Math.min(STEPS.length - 1, s + 1));
      } else {
        setStep(s => Math.max(0, s - 1));
      }
      setAnimating(false);
    }, 200);
  }, []);

  const handleComplete = () => {
    onComplete({
      country: preferences.country || "INT",
      minDeposit: preferences.minDeposit || 20,
      maxDeposit: preferences.maxDeposit || 1000,
      preferredPaymentMethod: preferences.preferredPaymentMethod || "any",
      preferredGames: preferences.preferredGames || [],
      liveCasinoPreferred: preferences.liveCasinoPreferred ?? false,
      sportsBettingPreferred: preferences.sportsBettingPreferred ?? false,
      bonusPreference: preferences.bonusPreference || "any",
      withdrawalPreference: preferences.withdrawalPreference || "no-preference",
      cryptoPreferred: preferences.cryptoPreferred ?? false,
      mobileFriendly: preferences.mobileFriendly ?? false,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back to intro + Progress */}
      <div className="mb-8">
        <button
          onClick={step === 0 ? onBack : () => navigateStep("backward")}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-6 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          {step === 0 ? "Back to introduction" : "Previous step"}
        </button>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-white/30 uppercase tracking-widest">
              {currentStep.category}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Step {step + 1} of {STEPS.length}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, var(--accent-600) 0%, var(--accent-400) 100%)",
            }}
          />
        </div>
      </div>

      {/* Step content */}
      <div
        className={cn(
          "mb-8",
          animating
            ? animDirection === "forward" ? "animate-question-exit" : "animate-question-exit"
            : "animate-question-enter"
        )}
        key={step}
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{currentStep.title}</h2>
        <p className="text-slate-300/60">{currentStep.subtitle}</p>
      </div>

      {/* Step-specific content */}
      <div className="min-h-[340px] mb-8">
        {/* Country */}
        {step === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Select your country">
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                role="radio"
                aria-checked={preferences.country === c.code}
                onClick={() => setPreferences({ ...preferences, country: c.code })}
                className={cn(
                  "flex items-center gap-3 p-3.5 sm:p-4 rounded-[var(--radius-lg)] border text-left transition-all duration-200",
                  "min-h-[52px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400",
                  preferences.country === c.code
                    ? "border-accent-500/50 bg-accent-500/10 text-white shadow-[0_0_12px_rgba(16,185,129,0.1)]"
                    : "border-white/[0.06] bg-white/[0.03] text-slate-300 hover:border-white/10 hover:bg-white/[0.06]"
                )}
              >
                <span className="text-xl">{c.flag}</span>
                <span className="text-sm font-medium">{c.name}</span>
                {preferences.country === c.code && (
                  <svg className="w-4 h-4 text-accent-400 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Deposit range */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-white">Minimum Deposit</label>
                <span className="text-sm font-bold text-accent-400 tabular-nums">&euro;{preferences.minDeposit ?? 20}</span>
              </div>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={preferences.minDeposit ?? 20}
                onChange={(e) => setPreferences({ ...preferences, minDeposit: Number(e.target.value) })}
                className="w-full accent-accent-500 h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-500 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(16,185,129,0.3)] [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>&euro;5</span>
                <span>&euro;200</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-white">Maximum Deposit</label>
                <span className="text-sm font-bold text-accent-400 tabular-nums">&euro;{(preferences.maxDeposit ?? 1000).toLocaleString()}</span>
              </div>
              <input
                type="range"
                min={50}
                max={5000}
                step={50}
                value={preferences.maxDeposit ?? 1000}
                onChange={(e) => setPreferences({ ...preferences, maxDeposit: Number(e.target.value) })}
                className="w-full accent-accent-500 h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-500 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(16,185,129,0.3)] [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>&euro;50</span>
                <span>&euro;5,000</span>
              </div>
            </div>
          </div>
        )}

        {/* Payment method */}
        {step === 2 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Select payment method">
            {PAYMENT_METHODS.map((pm) => (
              <button
                key={pm.name}
                role="radio"
                aria-checked={preferences.preferredPaymentMethod === pm.name || (pm.name === "Any Method" && preferences.preferredPaymentMethod === "any")}
                onClick={() => setPreferences({ ...preferences, preferredPaymentMethod: pm.name === "Any Method" ? "any" : pm.name })}
                className={cn(
                  "p-3.5 sm:p-4 rounded-[var(--radius-lg)] border text-left transition-all duration-200",
                  "min-h-[52px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400",
                  (preferences.preferredPaymentMethod === pm.name || (pm.name === "Any Method" && preferences.preferredPaymentMethod === "any"))
                    ? "border-accent-500/50 bg-accent-500/10 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
                    : "border-white/[0.06] bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.06]"
                )}
              >
                <span className={cn(
                  "text-sm font-medium block",
                  (preferences.preferredPaymentMethod === pm.name || (pm.name === "Any Method" && preferences.preferredPaymentMethod === "any"))
                    ? "text-white" : "text-slate-300"
                )}>
                  {pm.name}
                </span>
                <span className="text-xs text-slate-500 mt-0.5 block">{pm.description}</span>
              </button>
            ))}
          </div>
        )}

        {/* Games — multi-select */}
        {step === 3 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="group" aria-label="Select game types">
            {GAME_TYPES.map((game) => {
              const selected = preferences.preferredGames?.includes(game.name) ?? false;
              return (
                <button
                  key={game.name}
                  aria-pressed={selected}
                  onClick={() => {
                    const current = preferences.preferredGames || [];
                    setPreferences({
                      ...preferences,
                      preferredGames: selected
                        ? current.filter((g) => g !== game.name)
                        : [...current, game.name],
                    });
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3.5 sm:p-4 rounded-[var(--radius-lg)] border text-left transition-all duration-200",
                    "min-h-[52px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400",
                    selected
                      ? "border-accent-500/50 bg-accent-500/10 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
                      : "border-white/[0.06] bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.06]"
                  )}
                >
                  <span className="text-xl">{game.icon}</span>
                  <span className={cn("text-sm font-medium", selected ? "text-white" : "text-slate-300")}>
                    {game.name}
                  </span>
                  {selected && (
                    <svg className="w-4 h-4 text-accent-400 ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Features — toggle */}
        {step === 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-label="Select features">
            {FEATURES.map((feature) => {
              const selected = feature.key === "hasLiveCasino"
                ? preferences.liveCasinoPreferred ?? false
                : feature.key === "hasSportsBetting"
                  ? preferences.sportsBettingPreferred ?? false
                  : feature.key === "hasCrypto"
                    ? preferences.cryptoPreferred ?? false
                    : preferences.mobileFriendly ?? false;
              return (
                <button
                  key={feature.key}
                  aria-pressed={selected}
                  onClick={() => {
                    if (feature.key === "hasLiveCasino") {
                      setPreferences({ ...preferences, liveCasinoPreferred: !selected });
                    } else if (feature.key === "hasSportsBetting") {
                      setPreferences({ ...preferences, sportsBettingPreferred: !selected });
                    } else if (feature.key === "hasCrypto") {
                      setPreferences({ ...preferences, cryptoPreferred: !selected });
                    } else {
                      setPreferences({ ...preferences, mobileFriendly: !selected });
                    }
                  }}
                  className={cn(
                    "flex items-center gap-4 p-4 sm:p-5 rounded-[var(--radius-lg)] border text-left transition-all duration-200",
                    "min-h-[60px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400",
                    selected
                      ? "border-accent-500/50 bg-accent-500/10 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
                      : "border-white/[0.06] bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.06]"
                  )}
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className={cn("text-sm font-medium block", selected ? "text-white" : "text-slate-300")}>
                      {feature.label}
                    </span>
                    <span className="text-xs text-slate-500">{feature.description}</span>
                  </div>
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200",
                    selected ? "border-accent-500 bg-accent-500" : "border-white/20"
                  )}>
                    {selected && (
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Bonus */}
        {step === 5 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2" role="radiogroup" aria-label="Select bonus type">
            {BONUS_TYPES.map((bonus) => (
              <button
                key={bonus.value}
                role="radio"
                aria-checked={preferences.bonusPreference === bonus.value}
                onClick={() => setPreferences({ ...preferences, bonusPreference: bonus.value as UserPreferences["bonusPreference"] })}
                className={cn(
                  "p-3.5 sm:p-4 rounded-[var(--radius-lg)] border text-left transition-all duration-200",
                  "min-h-[52px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400",
                  preferences.bonusPreference === bonus.value
                    ? "border-accent-500/50 bg-accent-500/10 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
                    : "border-white/[0.06] bg-white/[0.03] hover:border-white/10 hover:bg-white/[0.06]"
                )}
              >
                <span className={cn(
                  "text-sm font-medium block",
                  preferences.bonusPreference === bonus.value ? "text-white" : "text-slate-300"
                )}>
                  {bonus.label}
                </span>
                <span className="text-xs text-slate-500 mt-0.5 block">{bonus.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div />

        {step < STEPS.length - 1 ? (
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigateStep("forward")}
            disabled={!canContinue}
          >
            Continue
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Button>
        ) : (
          <Button
            variant="brand"
            size="lg"
            onClick={handleComplete}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Find My Match
          </Button>
        )}
      </div>
    </div>
  );
}
