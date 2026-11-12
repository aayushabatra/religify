import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import {
  CartEmpty,
  CartLineItem,
  CartSummaryPanel,
  TrackViewCart,
} from "@/features/cart";
import { getCart } from "@/lib/cart";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your NARAYAN cart. Sample prices validated on the server.",
};

export default async function CartPage() {
  const cart = await getCart();

  return (
    <Container className="py-10 sm:py-14">
      <TrackViewCart
        itemCount={cart.itemCount}
        subtotalInPaise={cart.subtotalInPaise}
      />

      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-burgundy/80">
        Cart
      </p>

      {cart.lines.length === 0 ? (
        <CartEmpty />
      ) : (
        <>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h1 className="font-display text-4xl text-charcoal">Your cart</h1>
            <p className="text-sm text-charcoal/55">
              {cart.itemCount} {cart.itemCount === 1 ? "item" : "items"}
            </p>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div>
              {cart.lines.map((line) => (
                <CartLineItem key={line.productId} line={line} />
              ))}
            </div>
            <CartSummaryPanel cart={cart} />
          </div>
        </>
      )}
    </Container>
  );
}
