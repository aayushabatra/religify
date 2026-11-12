import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <Container className="py-16 sm:py-20">
      <h1 className="font-display text-4xl text-charcoal">Terms & conditions</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/70">
        Terms require legal review with the business before publication.
        Placeholder page only.
      </p>
    </Container>
  );
}
