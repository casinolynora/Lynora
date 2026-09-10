import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main id="main-content">
      <Container className="py-20 lg:py-32">
        <div className="max-w-md mx-auto text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bg-subtle mx-auto mb-6">
            <svg className="w-8 h-8 text-text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
          <p className="text-muted mb-8">
            The page you are looking for does not exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/" variant="primary">Go Home</Button>
            <Button href="/casinos" variant="secondary">Browse Casinos</Button>
            <Button href="/ai-casino-match" variant="ghost">Try Matchmaker</Button>
          </div>
        </div>
      </Container>
    </main>
  );
}
