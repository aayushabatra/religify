import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "FAQs",
};

export default function FaqPage() {
  return (
    <Container className="py-16 sm:py-20">
      <h1 className="font-display text-4xl text-charcoal">FAQs</h1>
      <p className="mt-4 max-w-xl text-sm text-charcoal/70">
        FAQ content will be added once shipping, returns, and fulfilment rules
        are confirmed by the business.
      </p>
    </Container>
  );
}
