"use client";

import { useState } from "react";
import { UserPreferences } from "@/lib/types";
import { MATCH_COUNTRIES, MATCH_PAYMENT_METHODS, MATCH_GAME_OPTIONS } from "@/lib/types/preferences";
import { cn } from "@/lib/utils/format";

type QuestionnaireProps = {
  onComplete: (preferences: UserPreferences) => void;
};

type Step = {
  id: string;
  title: string;
  subtitle: string;
};

const steps: Step[] = [
  { id: "country", title: "Where are you playing from?", subtitle: "This helps us find casinos available in your region." },
  { id: "deposit", title: "What is your preferred deposit range?", subtitle: "Set a minimum and maximum amount you are comfortable depositing." },
  { id: "payment", title: "How do you prefer to pay?", subtitle: "Select your preferred payment method." },
  { id: "games", title: "What games do you enjoy?", subtitle: "Choose one or more game types you like." },
  { id: "features", title: "Any special preferences?", subtitle: "Select additional features that matter to you." },
  { id: "bonus", title: "Bonus preference", subtitle: "What kind of bonus interests you most?" },
];

export function Questionnaire({ onComplete }: QuestionnaireProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
    preferredGames: [],
  });

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const updatePref = (key: keyof UserPreferences, value: unknown) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const toggleGame = (slug: string) => {
    setPreferences(prev => {
      const games = prev.preferredGames ?? [];
      return {
        ...prev,
        preferredGames: games.includes(slug) ? games.filter(g => g !== slug) : [...games, slug],
      };
    });
  };

  const canProceed = (): boolean => {
    switch (step.id) {
      case "country": return !!preferences.country;
      case "deposit": return true;
      case "payment": return true;
      case "games": return true;
      case "features": return true;
      case "bonus": return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(preferences as UserPreferences);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm text-muted mb-2">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full gradient-primary rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="min-h-[320px]">
        <h2 className="text-2xl font-bold mb-1">{step.title}</h2>
        <p className="text-muted mb-8">{step.subtitle}</p>

        {step.id === "country" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MATCH_COUNTRIES.map(country => (
              <button
                key={country.code}
                onClick={() => updatePref("country", country.code)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left",
                  preferences.country === country.code
                    ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/30 hover:bg-surface-elevated",
                )}
              >
                {country.name}
              </button>
            ))}
          </div>
        )}

        {step.id === "deposit" && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Minimum Deposit (€)</label>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={preferences.minDeposit ?? 20}
                onChange={(e) => updatePref("minDeposit", Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-sm text-muted mt-1">
                <span>€5</span>
                <span className="font-medium text-foreground">€{preferences.minDeposit ?? 20}</span>
                <span>€200</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Maximum Deposit (€)</label>
              <input
                type="range"
                min={50}
                max={5000}
                step={50}
                value={preferences.maxDeposit ?? 500}
                onChange={(e) => updatePref("maxDeposit", Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-sm text-muted mt-1">
                <span>€50</span>
                <span className="font-medium text-foreground">€{preferences.maxDeposit ?? 500}</span>
                <span>€5,000</span>
              </div>
            </div>
          </div>
        )}

        {step.id === "payment" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MATCH_PAYMENT_METHODS.map(pm => (
              <button
                key={pm.name}
                onClick={() => updatePref("preferredPaymentMethod", pm.name)}
                className={cn(
                  "px-4 py-3 rounded-xl text-sm font-medium border transition-all text-left",
                  preferences.preferredPaymentMethod === pm.name
                    ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/30 hover:bg-surface-elevated",
                )}
              >
                <span>{pm.name}</span>
                <span className="block text-xs text-muted capitalize">{pm.type}</span>
              </button>
            ))}
          </div>
        )}

        {step.id === "games" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MATCH_GAME_OPTIONS.map(game => {
              const selected = preferences.preferredGames?.includes(game.slug);
              return (
                <button
                  key={game.slug}
                  onClick={() => toggleGame(game.slug)}
                  className={cn(
                    "px-4 py-3 rounded-xl text-sm font-medium border transition-all",
                    selected
                      ? "border-primary bg-primary/5 text-primary ring-2 ring-primary/20"
                      : "border-border hover:border-primary/30 hover:bg-surface-elevated",
                  )}
                >
                  {game.name}
                </button>
              );
            })}
          </div>
        )}

        {step.id === "features" && (
          <div className="space-y-4">
            {[
              { key: "liveCasinoPreferred", label: "Live Casino", desc: "Real dealers streamed live" },
              { key: "sportsBettingPreferred", label: "Sports Betting", desc: "Bet on sports events" },
              { key: "cryptoPreferred", label: "Cryptocurrency", desc: "Deposit/withdraw with crypto" },
              { key: "mobileFriendly", label: "Mobile Friendly", desc: "Great mobile experience" },
            ].map(feature => (
              <button
                key={feature.key}
                onClick={() => updatePref(feature.key as keyof UserPreferences, !preferences[feature.key as keyof UserPreferences])}
                className={cn(
                  "w-full px-5 py-4 rounded-xl border transition-all text-left flex items-center justify-between",
                  preferences[feature.key as keyof UserPreferences]
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/30 hover:bg-surface-elevated",
                )}
              >
                <div>
                  <span className="font-medium">{feature.label}</span>
                  <span className="block text-sm text-muted">{feature.desc}</span>
                </div>
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  preferences[feature.key as keyof UserPreferences]
                    ? "border-primary bg-primary"
                    : "border-gray-300",
                )}>
                  {preferences[feature.key as keyof UserPreferences] && (
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {step.id === "bonus" && (
          <div className="space-y-3">
            {[
              { value: "any", label: "Any bonus", desc: "Show me all available bonuses" },
              { value: "welcome-bonus", label: "Welcome bonus", desc: "Match deposit bonus for new players" },
              { value: "free-spins", label: "Free spins", desc: "Bonus spins on slot games" },
              { value: "cashback", label: "Cashback", desc: "Get a percentage of losses back" },
              { value: "no-deposit", label: "No deposit bonus", desc: "Bonus without depositing" },
              { value: "none", label: "No bonus", desc: "I don't care about bonuses" },
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => updatePref("bonusPreference", opt.value)}
                className={cn(
                  "w-full px-5 py-4 rounded-xl border transition-all text-left flex items-center gap-4",
                  preferences.bonusPreference === opt.value
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border hover:border-primary/30 hover:bg-surface-elevated",
                )}
              >
                <div className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                  preferences.bonusPreference === opt.value ? "border-primary" : "border-gray-300",
                )}>
                  {preferences.bonusPreference === opt.value && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
                <div>
                  <span className="font-medium">{opt.label}</span>
                  <span className="block text-sm text-muted">{opt.desc}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-6 py-2.5 text-sm font-medium text-muted hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="gradient-primary text-white px-8 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {currentStep === steps.length - 1 ? "Find My Matches" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
