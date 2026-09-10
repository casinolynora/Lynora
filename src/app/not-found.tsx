import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="py-20 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
        <span className="text-4xl">🎰</span>
      </div>
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-muted max-w-md mx-auto mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button href="/" variant="primary">Go Home</Button>
        <Button href="/casinos" variant="secondary">Browse Casinos</Button>
        <Button href="/ai-casino-match" variant="ghost">Try Matchmaker</Button>
      </div>
    </Container>
  );
}
