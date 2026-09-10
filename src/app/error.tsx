"use client";

import { Button } from "@/components/ui/Button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-20 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
        <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h1 className="text-3xl font-bold mb-4">Something went wrong</h1>
      <p className="text-muted max-w-md mx-auto mb-8">
        An unexpected error occurred. Please try again.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={reset} variant="primary">Try Again</Button>
        <Button href="/" variant="secondary">Go Home</Button>
      </div>
    </div>
  );
}
