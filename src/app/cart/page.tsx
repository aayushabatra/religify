import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Cart",
  description: "Cart arrives in Phase B.",
};

export default function CartStubPage() {
  return (
    <Container className="py-16 sm:py-20">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-burgundy/80">
        Cart · stub
      </p>
      <h1 className="mt-3 font-display text-4xl text-charcoal">Your cart is empty</h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-charcoal/70">
        Cart quantity, persistence, and checkout wire-up are planned for Phase B.
        Browse sample products in the meantime.
      </p>
      <div className="mt-8">
        <Button href="/shop">Continue shopping</Button>
      </div>
    </Container>
  );
}
