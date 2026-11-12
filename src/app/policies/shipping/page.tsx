import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { storeConfig } from "@/config/store";

export const metadata: Metadata = { title: "Shipping" };

export default function ShippingPolicyPage() {
  return (
    <Container className="py-16 sm:py-20">
      <h1 className="font-display text-4xl text-charcoal">Shipping</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/70">
        {storeConfig.shipping.summary} Full policy copy pending owner review.
      </p>
    </Container>
  );
}
