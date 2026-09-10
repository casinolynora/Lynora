"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils/format";
import { Button } from "@/components/ui/Button";
import type { UserPreferences } from "@/lib/types";

type QuestionnaireProps = {
  onComplete: (preferences: UserPreferences) => void;
};

const STEPS = [
  { id: "country", title: "Where are you playing from?", subtitle: "This helps us find casinos available in your region." },
  { id: "deposit", title: "What is your typical deposit range?", subtitle: "We will match casinos that fit your budget." },
  { id: "payment", title: "Preferred payment method?", subtitle: "Choose the method you use most often." },
  { id: "games", title: "What games do you enjoy?", subtitle: "Select all that apply." },
  { id: "features", title: "Any specific features?", subtitle: "Toggle the ones that matter to you." },
  { id: "bonus", title: "Bonus preferences?", subtitle: "What type of bonus interests you?" },
];

const COUNTRIES = [
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "AT", name: "Austria", flag: "🇦🇹" },
  { code: "CH", name: "Switzerland", flag: "🇨🇭" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "BE", name: "Belgium", flag: "🇧🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "SE", name: "Sweden", flag: "🇸🇪" },
  { code: "NO", name: "Norway", flag: "🇳🇴" },
  { code: "FI", name: "Finland", flag: "🇫🇮" },
  { code: "DK", name: "Denmark", flag: "🇩🇰" },
  { code: "IE", name: "Ireland", flag: "🇮🇪" },
  { code: "PL", name: "Poland", flag: "🇵🇱" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "RO", name: "Romania", flag: "🇷🇴" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬" },
  { code: "HR", name: "Croatia", flag: "🇭🇷" },
  { code: "HU", name: "Hungary", flag: "🇭🇺" },
  { code: "SK", name: "Slovakia", flag: "🇸🇰" },
  { code: "SI", name: "Slovenia", flag: "🇸🇮" },
  { code: "EE", name: "Estonia", flag: "🇪🇪" },
  { code: "LV", name: "Latvia", flag: "🇱🇻" },
  { code: "LT", name: "Lithuania", flag: "🇱🇹" },
  { code: "LU", name: "Luxembourg", flag: "🇱🇺" },
  { code: "MT", name: "Malta", flag: "🇲🇹" },
  { code: "CY", name: "Cyprus", flag: "🇨🇾" },
  { code: "INT", name: "International", flag: "🌍" },
];

const PAYMENT_METHODS = [
  "PayPal", "Visa", "Mastercard", "Sofort", "Klarna",
  "Trustly", "Apple Pay", "Google Pay", "Neteller", "Skrill",
  "Paysafecard", "Bank Transfer", "Bitcoin", "Ethereum",
];

const GAME_TYPES = [
  "Slots", "Live Casino", "Blackjack", "Roulette", "Poker",
  "Baccarat", "Game Shows", "Sports Betting",
];

const FEATURES = [
  { key: "hasLiveCasino" as const, label: "Live Casino", icon: "🎰" },
  { key: "hasSportsBetting" as const, label: "Sports Betting", icon: "⚽" },
  { key: "hasCrypto" as const, label: "Cryptocurrency", icon: "₿" },
  { key: "hasMobile" as const, label: "Mobile Friendly", icon: "📱" },
];

const BONUS_TYPES = [
  { value: "any", label: "Any Bonus" },
  { value: "welcome", label: "Welcome Bonus" },
  { value: "free-spins", label: "Free Spins" },
  { value: "cashback", label: "Cashback" },
  { value: "no-deposit", label: "No Deposit" },
  { value: "none", label: "No Bonus Needed" },
];

export function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [step, setStep] = useState(0);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({});

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
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-muted mb-2">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full gradient-brand rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="mb-8 animate-fade-in" key={step}>
        <h2 className="text-2xl font-bold mb-2">{currentStep.title}</h2>
        <p className="text-muted">{currentStep.subtitle}</p>
      </div>

      {/* Step-specific content */}
      <div className="min-h-[300px] mb-8">
        {step === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {COUNTRIES.map((country) => (
              <button
                key={country.code}
                onClick={() => setPreferences({ ...preferences, country: country.code })}
                className={cn(
                  "flex items-center gap-2.5 p-3 rounded-[var(--radius-lg)] border text-left text-sm transition-all",
                  preferences.country === country.code
                    ? "border-brand-400 bg-brand-50 text-brand-800 shadow-sm"
                    : "border-border bg-white text-muted hover:border-slate-300 hover:bg-surface-hover"
                )}
              >
                <span className="text-lg">{country.flag}</span>
                <span className="font-medium">{country.name}</span>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Minimum Deposit</label>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={preferences.minDeposit ?? 20}
                onChange={(e) => setPreferences({ ...preferences, minDeposit: Number(e.target.value) })}
                className="w-full accent-brand-600"
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>€5</span>
                <span className="font-medium text-foreground">€{preferences.minDeposit ?? 20}</span>
                <span>€200</span>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Maximum Deposit</label>
              <input
                type="range"
                min={50}
                max={5000}
                step={50}
                value={preferences.maxDeposit ?? 1000}
                onChange={(e) => setPreferences({ ...preferences, maxDeposit: Number(e.target.value) })}
                className="w-full accent-brand-600"
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>€50</span>
                <span className="font-medium text-foreground">€{(preferences.maxDeposit ?? 1000).toLocaleString()}</span>
                <span>€5,000</span>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <button
              onClick={() => setPreferences({ ...preferences, preferredPaymentMethod: "any" })}
              className={cn(
                "p-3 rounded-[var(--radius-lg)] border text-sm font-medium transition-all",
                preferences.preferredPaymentMethod === "any"
                  ? "border-brand-400 bg-brand-50 text-brand-800"
                  : "border-border bg-white text-muted hover:border-slate-300"
              )}
            >
              Any Method
            </button>
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method}
                onClick={() => setPreferences({ ...preferences, preferredPaymentMethod: method })}
                className={cn(
                  "p-3 rounded-[var(--radius-lg)] border text-sm font-medium transition-all",
                  preferences.preferredPaymentMethod === method
                    ? "border-brand-400 bg-brand-50 text-brand-800"
                    : "border-border bg-white text-muted hover:border-slate-300"
                )}
              >
                {method}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {GAME_TYPES.map((game) => {
              const selected = preferences.preferredGames?.includes(game) ?? false;
              return (
                <button
                  key={game}
                  onClick={() => {
                    const current = preferences.preferredGames || [];
                    setPreferences({
                      ...preferences,
                      preferredGames: selected
                        ? current.filter((g) => g !== game)
                        : [...current, game],
                    });
                  }}
                  className={cn(
                    "p-3 rounded-[var(--radius-lg)] border text-sm font-medium transition-all",
                    selected
                      ? "border-brand-400 bg-brand-50 text-brand-800"
                      : "border-border bg-white text-muted hover:border-slate-300"
                  )}
                >
                  {game}
                </button>
              );
            })}
          </div>
        )}

        {step === 4 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    "flex items-center gap-3 p-4 rounded-[var(--radius-lg)] border text-left transition-all",
                    selected
                      ? "border-brand-400 bg-brand-50"
                      : "border-border bg-white hover:border-slate-300"
                  )}
                >
                  <span className="text-xl">{feature.icon}</span>
                  <span className={cn("text-sm font-medium", selected ? "text-brand-800" : "text-muted")}>
                    {feature.label}
                  </span>
                  <div className={cn(
                    "ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                    selected ? "border-brand-600 bg-brand-600" : "border-slate-300"
                  )}>
                    {selected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {step === 5 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BONUS_TYPES.map((bonus) => (
              <button
                key={bonus.value}
                onClick={() => setPreferences({ ...preferences, bonusPreference: bonus.value as UserPreferences["bonusPreference"] })}
                className={cn(
                  "p-3 rounded-[var(--radius-lg)] border text-sm font-medium transition-all",
                  preferences.bonusPreference === bonus.value
                    ? "border-brand-400 bg-brand-50 text-brand-800"
                    : "border-border bg-white text-muted hover:border-slate-300"
                )}
              >
                {bonus.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep(Math.max(0, step - 1))}
          disabled={step === 0}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </Button>

        {step < STEPS.length - 1 ? (
          <Button
            variant="primary"
            onClick={() => setStep(step + 1)}
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
            onClick={handleComplete}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Find My Match
          </Button>
        )}
      </div>
    </div>
  );
}
