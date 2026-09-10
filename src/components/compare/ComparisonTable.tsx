"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Casino } from "@/lib/types";
import { RatingDisplay } from "@/components/casino/RatingDisplay";
import { AffiliateCTA } from "@/components/casino/AffiliateCTA";

type ComparisonTableProps = {
  casinos: Casino[];
};

export function ComparisonTable({ casinos }: ComparisonTableProps) {
  const [selectedCasinos, setSelectedCasinos] = useState<string[]>(
    casinos.slice(0, 3).map(c => c.id)
  );

  const toggleCasino = useCallback((id: string) => {
    setSelectedCasinos(prev => {
      if (prev.includes(id)) return prev.filter(c => c !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }, []);

  const selected = casinos.filter(c => selectedCasinos.includes(c.id));
  const available = casinos.filter(c => !selectedCasinos.includes(c.id));

  return (
    <div>
      {available.length > 0 && selectedCasinos.length < 4 && (
        <div className="mb-6">
          <p className="text-sm text-muted mb-2">Add casinos to compare (max 4):</p>
          <div className="flex flex-wrap gap-2">
            {available.map(casino => (
              <button
                key={casino.id}
                onClick={() => toggleCasino(casino.id)}
                className="px-3 py-1.5 text-sm rounded-lg border border-border hover:border-primary hover:text-primary transition-colors"
              >
                + {casino.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {selected.length === 0 ? (
        <p className="text-center text-muted py-8">Select casinos to compare.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-4 px-4 text-sm font-medium text-muted w-40">Feature</th>
                {selected.map(casino => (
                  <th key={casino.id} className="py-4 px-4 text-center min-w-[180px]">
                    <div className="flex flex-col items-center gap-1">
                      <Link href={`/casino-reviews/${casino.slug}`} className="font-bold text-foreground hover:text-primary transition-colors">
                        {casino.name}
                      </Link>
                      <button
                        onClick={() => toggleCasino(casino.id)}
                        className="text-xs text-muted hover:text-danger transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <Row label="Rating">
                {selected.map(c => (
                  <td key={c.id} className="py-4 px-4 text-center">
                    <div className="flex justify-center">
                      <RatingDisplay rating={c.rating} size="sm" showLabel={false} />
                    </div>
                  </td>
                ))}
              </Row>
              <Row label="License">
                {selected.map(c => (
                  <td key={c.id} className="py-4 px-4 text-center text-sm">
                    {c.licenses.map(l => l.issuer).join(", ")}
                  </td>
                ))}
              </Row>
              <Row label="Min Deposit">
                {selected.map(c => (
                  <td key={c.id} className="py-4 px-4 text-center text-sm font-medium">
                    €{c.minDeposit}
                  </td>
                ))}
              </Row>
              <Row label="Payment Methods">
                {selected.map(c => (
                  <td key={c.id} className="py-4 px-4 text-center text-sm">
                    {c.paymentMethods.slice(0, 4).map(p => p.name).join(", ")}
                  </td>
                ))}
              </Row>
              <Row label="Withdrawal Speed">
                {selected.map(c => (
                  <td key={c.id} className="py-4 px-4 text-center text-sm">
                    {c.withdrawalProcessingTime ?? "N/A"}
                  </td>
                ))}
              </Row>
              <Row label="Live Casino">
                {selected.map(c => (
                  <td key={c.id} className="py-4 px-4 text-center text-sm">
                    {c.hasLiveCasino ? "✓" : "✗"}
                  </td>
                ))}
              </Row>
              <Row label="Sports Betting">
                {selected.map(c => (
                  <td key={c.id} className="py-4 px-4 text-center text-sm">
                    {c.hasSportsBetting ? "✓" : "✗"}
                  </td>
                ))}
              </Row>
              <Row label="Games">
                {selected.map(c => (
                  <td key={c.id} className="py-4 px-4 text-center text-sm">
                    {c.games.filter(g => g.available).length} categories
                  </td>
                ))}
              </Row>
              <Row label="Welcome Bonus">
                {selected.map(c => {
                  const bonus = c.bonuses.find(b => b.type === "welcome") ?? c.bonuses[0];
                  return (
                    <td key={c.id} className="py-4 px-4 text-center text-sm">
                      {bonus ? bonus.title : "N/A"}
                    </td>
                  );
                })}
              </Row>
              <Row label="Wagering">
                {selected.map(c => {
                  const bonus = c.bonuses.find(b => b.type === "welcome");
                  return (
                    <td key={c.id} className="py-4 px-4 text-center text-sm">
                      {bonus?.wageringRequirement ?? "N/A"}
                    </td>
                  );
                })}
              </Row>
              <Row label="Countries">
                {selected.map(c => (
                  <td key={c.id} className="py-4 px-4 text-center text-sm">
                    {c.countries.length} countries
                  </td>
                ))}
              </Row>
              <Row label="Visit">
                {selected.map(c => (
                  <td key={c.id} className="py-4 px-4 text-center">
                    <AffiliateCTA affiliateOffers={c.affiliateOffers} size="sm" />
                  </td>
                ))}
              </Row>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b border-border/50 hover:bg-surface-elevated/50 transition-colors">
      <td className="py-3 px-4 text-sm font-medium text-muted">{label}</td>
      {children}
    </tr>
  );
}
