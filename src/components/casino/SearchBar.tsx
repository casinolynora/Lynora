"use client";

import { useRef, useCallback } from "react";

type SearchBarProps = {
  onSearch: (query: string) => void;
  placeholder?: string;
};

export function SearchBar({ onSearch, placeholder = "Search casinos..." }: SearchBarProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        onSearch(e.target.value);
      }, 200);
    },
    [onSearch]
  );

  return (
    <div role="search" className="relative">
      <label htmlFor="casino-search" className="sr-only">
        Search casinos
      </label>
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-faint pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <input
        id="casino-search"
        type="search"
        placeholder={placeholder}
        onChange={handleChange}
        className="w-full rounded-[var(--radius-lg)] border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-text-faint focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-brand-400 transition-shadow"
      />
    </div>
  );
}
