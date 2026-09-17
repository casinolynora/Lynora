import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ListingForm } from "./listing-form";

export const metadata: Metadata = {
  title: "Submit Your Casino to CasinoLynora",
  description:
    "List your casino on CasinoLynora to reach players across Europe. Submit your brand for review and choose a listing plan that fits your goals.",
  alternates: { canonical: "/for-casinos/list-your-casino" },
  openGraph: {
    title: "Submit Your Casino to CasinoLynora",
    description: "Submit your brand for review and reach players across Europe.",
  },
  twitter: {
    card: "summary",
    title: "Submit Your Casino to CasinoLynora",
    description: "Submit your brand for review and reach players across Europe.",
  },
};

export default function ListYourCasinoPage() {
  return (
    <main id="main-content">
      <Container className="py-12 lg:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <Badge variant="primary" size="md" className="mb-4">
              For Casino Operators
            </Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Submit Your Casino
            </h1>
            <p className="text-lg text-muted">
              List your casino on CasinoLynora to reach players across Europe.
              Fill out the form below and our team will review your submission.
            </p>
          </div>
          <ListingForm />
        </div>
      </Container>
    </main>
  );
}
