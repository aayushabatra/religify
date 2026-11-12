import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import {
  CheckoutSummary,
  OrderEnquiryForm,
  TrackBeginCheckout,
} from "@/features/checkout";
import { formatInr } from "@/lib/currency";
import { getCart } from "@/lib/cart";
import { getPaymentConfig } from "@/lib/payments";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Demo order enquiry for NARAYAN. No live payment is processed in this phase.",
};

export default async function CheckoutPage() {
  const cart = await getCart();
  const payment = getPaymentConfig();

  if (cart.lines.length === 0) {
    return (
      <Container className="py-16 sm:py-20">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-burgundy/80">
          Checkout
        </p>
        <h1 className="mt-3 font-display text-4xl text-charcoal">
          Your cart is empty
        </h1>
        <p className="mt-4 max-w-lg text-sm text-charcoal/70">
          Add sample products before starting checkout.
        </p>
        <div className="mt-8">
          <Button href="/shop">Browse products</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-10 sm:py-14">
      <TrackBeginCheckout
        itemCount={cart.itemCount}
        subtotalInPaise={cart.subtotalInPaise}
        mode={payment.mode}
      />

      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-burgundy/80">
        Checkout · {payment.keysPresent ? "keys present · pay not live" : "demo enquiry"}
      </p>
      <h1 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">
        {payment.keysPresent ? "Checkout (payments pending)" : "Order enquiry"}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal/70">
        {payment.note}
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <OrderEnquiryForm
          itemCount={cart.itemCount}
          subtotalLabel={formatInr(cart.subtotalInPaise)}
        />
        <div className="space-y-4">
          <CheckoutSummary cart={cart} />
          <p className="text-sm">
            <Link
              href="/cart"
              className="text-burgundy underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30"
            >
              Back to cart
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
}
