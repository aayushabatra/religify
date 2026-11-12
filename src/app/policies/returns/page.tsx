import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Returns" };

export default function ReturnsPolicyPage() {
  return (
    <Container className="py-16 sm:py-20">
      <h1 className="font-display text-4xl text-charcoal">Returns & refunds</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/70">
        Returns and refund rules to be supplied and reviewed before launch. This
        page is a structural placeholder only.
      </p>
    </Container>
  );
}
