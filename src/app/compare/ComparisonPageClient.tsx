"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ComparisonTable,
  DifferenceHighlights,
  SortControls,
  CasinoSelector,
  PaymentOverlap,
} from "@/components/compare";
import {
  toComparisonCasino,
  sortCasinos,
  detectDifferences,
  calculatePaymentOverlap,
  buildComparisonUrl,
  MAX_COMPARECasinos,
} from "@/lib/compare";
import type { Casino } from "@/lib/types";
import type { ComparisonCasino, SortField, SortDirection } from "@/lib/compare";

type ComparisonPageClientProps = {
  allCasinos: Casino[];
  initialSlugs: string[];
};

export function ComparisonPageClient({
  allCasinos,
  initialSlugs,
}: ComparisonPageClientProps) {
  const router = useRouter();
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(initialSlugs);
  const [sortField, setSortField] = useState<SortField>("editorialScore");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Transform all casinos to comparison models
  const allComparisonCasinos = useMemo(
    () => allCasinos.map((c) => toComparisonCasino(c)),
    [allCasinos]
  );

  // Get selected casinos
  const selectedCasinos = useMemo(() => {
    const selected = selectedSlugs
      .map((slug) => allComparisonCasinos.find((c) => c.slug === slug))
      .filter(Boolean) as ComparisonCasino[];
    return sortCasinos(selected, sortField, sortDirection);
  }, [selectedSlugs, allComparisonCasinos, sortField, sortDirection]);

  // Available casinos (not selected)
  const availableCasinos = useMemo(
    () => allComparisonCasinos.filter((c) => !selectedSlugs.includes(c.slug)),
    [allComparisonCasinos, selectedSlugs]
  );

  // Detect differences for current selection
  const currentDifferences = useMemo(
    () => detectDifferences(selectedCasinos),
    [selectedCasinos]
  );

  // Calculate payment overlap for current selection
  const currentPaymentOverlap = useMemo(
    () => calculatePaymentOverlap(selectedCasinos),
    [selectedCasinos]
  );

  // Handle add casino
  const handleAdd = (id: string) => {
    const casino = allComparisonCasinos.find((c) => c.id === id);
    if (!casino) return;
    if (selectedSlugs.length >= MAX_COMPARECasinos) return;
    if (selectedSlugs.includes(casino.slug)) return;

    const newSlugs = [...selectedSlugs, casino.slug];
    setSelectedSlugs(newSlugs);
    router.push(buildComparisonUrl(newSlugs), { scroll: false });
  };

  // Handle remove casino
  const handleRemove = (id: string) => {
    const casino = allComparisonCasinos.find((c) => c.id === id);
    if (!casino) return;

    const newSlugs = selectedSlugs.filter((s) => s !== casino.slug);
    setSelectedSlugs(newSlugs);
    if (newSlugs.length >= 2) {
      router.push(buildComparisonUrl(newSlugs), { scroll: false });
    } else {
      router.push("/compare", { scroll: false });
    }
  };

  // Handle sort
  const handleSort = (field: SortField, direction: SortDirection) => {
    setSortField(field);
    setSortDirection(direction);
  };

  // Empty state
  if (selectedCasinos.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-bg-subtle mx-auto mb-4">
          <svg
            className="w-7 h-7 text-text-faint"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
            />
          </svg>
        </div>
        <p className="text-muted font-medium">Select casinos to compare</p>
        <p className="text-sm text-text-faint mt-1">
          Choose {MAXCOMPARE_MINIMUM} or more casinos from the list above.
        </p>
      </div>
    );
  }

  // One casino state
  if (selectedCasinos.length === 1) {
    return (
      <div className="text-center py-16">
        <p className="text-muted font-medium">Add another casino to compare.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Casino Selector */}
      <CasinoSelector
        selected={selectedCasinos.map((c) => ({ id: c.id, name: c.name }))}
        available={availableCasinos.map((c) => ({ id: c.id, name: c.name }))}
        onAdd={handleAdd}
        onRemove={handleRemove}
      />

      {/* Sort Controls */}
      <SortControls
        currentField={sortField}
        currentDirection={sortDirection}
        onSort={handleSort}
        className="mt-4 mb-6"
      />

      {/* Comparison Table */}
      <div className="mb-8">
        <ComparisonTable
          casinos={selectedCasinos}
        />
      </div>

      {/* Key Differences */}
      <DifferenceHighlights differences={currentDifferences} />

      {/* Payment Overlap */}
      <PaymentOverlap
        common={currentPaymentOverlap.common}
        unique={currentPaymentOverlap.unique}
      />
    </div>
  );
}

const MAXCOMPARE_MINIMUM = 2;
