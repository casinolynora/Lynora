"use client";

import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/Badge";
import { AffiliateCTA } from "@/components/casino/AffiliateCTA";
import { RatingDisplay } from "@/components/casino/RatingDisplay";
import type { Casino } from "@/lib/types";

type ComparisonTableProps = {
  casinos: Casino[];
};

export function ComparisonTable({ casinos }: ComparisonTableProps) {
  const [selected, setSelected] = useState<string[]>(
    casinos.slice(0, 3).map((c) => c.id)
  );

  const selectedCasinos = useMemo(
    () => selected.map((id) => casinos.find((c) => c.id === id)).filter(Boolean) as Casino[],
    [selected, casinos]
  );

  const toggleCasino = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 4) {
      setSelected([...selected, id]);
    }
  };

  const available = casinos.filter((c) => !selected.includes(c.id));

  if (selectedCasinos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg-subtle mx-auto mb-4">
          <svg className="w-7 h-7 text-text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
          </svg>
        </div>
        <p className="text-muted font-medium">Select casinos to compare</p>
      </div>
    );
  }

  return (
    <div>
      {/* Casino selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {selectedCasinos.map((c) => (
          <Badge key={c.id} variant="primary" size="md" className="gap-1.5 pr-1.5">
            {c.name}
            <button
              onClick={() => toggleCasino(c.id)}
              className="ml-1 w-7 h-7 rounded-full bg-brand-200 hover:bg-brand-300 flex items-center justify-center transition-colors"
              aria-label={`Remove ${c.name}`}
            >
              <svg className="w-3.5 h-3.5 text-brand-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </Badge>
        ))}
        {available.length > 0 && selected.length < 4 && (
          <select
            onChange={(e) => { if (e.target.value) { toggleCasino(e.target.value); e.target.value = ""; } }}
            className="rounded-full border border-border bg-white px-3 py-1 text-sm text-muted focus:outline-none focus:ring-2 focus:ring-brand-400"
            aria-label="Add casino to comparison"
          >
            <option value="">+ Add casino</option>
            {available.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 pr-4 text-xs font-bold text-text-faint uppercase tracking-wider w-40">Feature</th>
              {selectedCasinos.map((c) => (
                <th key={c.id} className="text-left py-3 px-4 font-bold text-foreground">
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row label="Rating">
              {selectedCasinos.map((c) => (
                <td key={c.id} className="py-3 px-4">
                  <RatingDisplay rating={c.rating} size="sm" showLabel={false} />
                </td>
              ))}
            </Row>
            <Row label="License">
              {selectedCasinos.map((c) => (
                <td key={c.id} className="py-3 px-4">
                  {c.licenses?.[0]?.issuer ?? "—"}
                </td>
              ))}
            </Row>
            <Row label="Min Deposit">
              {selectedCasinos.map((c) => (
                <td key={c.id} className="py-3 px-4">
                  {c.minDeposit != null ? `€${c.minDeposit}` : "—"}
                </td>
              ))}
            </Row>
            <Row label="Payment Methods">
              {selectedCasinos.map((c) => (
                <td key={c.id} className="py-3 px-4">
                  {c.paymentMethods?.length ?? 0} methods
                </td>
              ))}
            </Row>
            <Row label="Live Casino">
              {selectedCasinos.map((c) => (
                <td key={c.id} className="py-3 px-4">
                  {c.hasLiveCasino ? "Yes" : "No"}
                </td>
              ))}
            </Row>
            <Row label="Sports Betting">
              {selectedCasinos.map((c) => (
                <td key={c.id} className="py-3 px-4">
                  {c.hasSportsBetting ? "Yes" : "No"}
                </td>
              ))}
            </Row>
            <Row label="Mobile">
              {selectedCasinos.map((c) => (
                <td key={c.id} className="py-3 px-4">
                  {c.hasMobile ? "Yes" : "No"}
                </td>
              ))}
            </Row>
            <Row label="Games">
              {selectedCasinos.map((c) => (
                <td key={c.id} className="py-3 px-4">
                  {c.games?.length ?? 0} categories
                </td>
              ))}
            </Row>
            <Row label="Visit">
              {selectedCasinos.map((c) => (
                <td key={c.id} className="py-3 px-4">
                  <AffiliateCTA affiliateOffers={c.affiliateOffers} size="sm" />
                </td>
              ))}
            </Row>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b border-border-subtle hover:bg-surface-hover transition-colors">
      <td className="py-3 pr-4 text-xs font-semibold text-text-faint uppercase tracking-wider">{label}</td>
      {children}
    </tr>
  );
}
