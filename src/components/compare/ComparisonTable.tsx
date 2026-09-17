"use client";

import Link from "next/link";
import { AffiliateCTA } from "@/components/casino/AffiliateCTA";
import { COMPARISON_CATEGORIES } from "@/lib/compare";
import type { ComparisonCasino, ComparisonCategory } from "@/lib/compare";

type ComparisonTableProps = {
  casinos: ComparisonCasino[];
};

export function ComparisonTable({ casinos }: ComparisonTableProps) {
  if (casinos.length === 0) {
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
    <div className="overflow-x-auto">
      <table className="w-full text-sm" role="table" aria-label="Casino comparison">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-3 pr-4 text-xs font-bold text-text-faint uppercase tracking-wider w-40">
              Feature
            </th>
            {casinos.map((c) => (
              <th key={c.id} className="text-left py-3 px-4 font-bold text-foreground min-w-[180px]">
                <Link
                  href={`/casino-reviews/${c.slug}`}
                  className="hover:text-brand-600 transition-colors"
                >
                  {c.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARISON_CATEGORIES.map((category) => (
            <CategoryRows
              key={category.id}
              category={category}
              casinos={casinos}
            />
          ))}
          {/* CTA Row */}
          <tr className="border-t-2 border-border">
            <td className="py-3 pr-4 text-xs font-bold text-text-faint uppercase tracking-wider">
              Visit
            </td>
            {casinos.map((c) => (
              <td key={c.id} className="py-3 px-4">
                <AffiliateCTA affiliateOffers={c.affiliateOffers} size="sm" />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function CategoryRows({
  category,
  casinos,
}: {
  category: ComparisonCategory;
  casinos: ComparisonCasino[];
}) {
  return (
    <>
      {/* Category Header */}
      <tr className="bg-surface">
        <td
          colSpan={casinos.length + 1}
          className="py-2 px-4 text-xs font-bold text-foreground uppercase tracking-wider"
        >
          {category.label}
        </td>
      </tr>
      {/* Fields */}
      {category.fields.map((field) => (
        <tr
          key={field.id}
          className="border-b border-border-subtle hover:bg-surface-hover transition-colors"
        >
          <td className="py-3 pr-4 text-xs font-semibold text-text-faint uppercase tracking-wider">
            {field.label}
          </td>
          {casinos.map((c) => {
            const value = field.getValue(c);
            const formatted = field.format ? field.format(value) : String(value ?? "—");
            return (
              <td key={c.id} className="py-3 px-4 text-foreground">
                {formatted}
              </td>
            );
          })}
        </tr>
      ))}
    </>
  );
}
