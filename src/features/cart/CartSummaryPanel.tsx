import { Button } from "@/components/ui/Button";
import { storeConfig } from "@/config/store";
import type { Cart } from "@/lib/cart";
import { formatInr } from "@/lib/currency";

type CartSummaryPanelProps = {
  cart: Cart;
};

export function CartSummaryPanel({ cart }: CartSummaryPanelProps) {
  return (
    <aside className="rounded-sm border border-gold/30 bg-[#f8f4ec] p-6">
      <h2 className="font-display text-2xl text-charcoal">Order summary</h2>
      <dl className="mt-6 space-y-3 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-charcoal/65">Subtotal</dt>
          <dd className="font-medium text-charcoal">
            {formatInr(cart.subtotalInPaise)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-charcoal/65">Shipping</dt>
          <dd className="text-charcoal/70">Calculated at checkout</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-charcoal/55">
        {storeConfig.sampleDataNotice} Prices are revalidated from the catalogue
        on the server — not taken from the browser.
      </p>
      <div className="mt-6 space-y-3">
        <Button href="/checkout" size="lg" className="w-full">
          Checkout
        </Button>
        <Button href="/shop" variant="outline" size="lg" className="w-full">
          Continue shopping
        </Button>
      </div>
    </aside>
  );
}
