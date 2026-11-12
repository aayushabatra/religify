import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Checkout and payments are not live yet.",
};

export default function CheckoutStubPage() {
  return (
    <Container className="py-16 sm:py-20">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-burgundy/80">
        Checkout · not configured
      </p>
      <h1 className="mt-3 font-display text-4xl text-charcoal">Checkout coming later</h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-charcoal/70">
        Razorpay and order capture are Phase C. This page does not process
        payments and will not simulate a successful purchase.
      </p>
      <div className="mt-8">
        <Button href="/cart" variant="outline">
          Back to cart
        </Button>
      </div>
    </Container>
  );
}
