export default function Loading() {
  return (
    <main id="main-content" className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center" role="status" aria-live="polite">
        <div className="w-10 h-10 mx-auto mb-4 rounded-full gradient-brand flex items-center justify-center animate-pulse-subtle">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>
        <p className="text-sm text-muted">Loading...</p>
      </div>
    </main>
  );
}
