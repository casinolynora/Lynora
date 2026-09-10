"use client";

import { Button } from "@/components/ui/Button";

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main-content" className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 border border-red-200 mx-auto mb-6">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-muted mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="primary" onClick={reset}>Try Again</Button>
          <Button href="/" variant="secondary">Go Home</Button>
        </div>
      </div>
    </main>
  );
}
