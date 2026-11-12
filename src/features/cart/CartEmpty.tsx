import { Button } from "@/components/ui/Button";

export function CartEmpty() {
  return (
    <div className="py-8">
      <h1 className="font-display text-4xl text-charcoal">Your cart is empty</h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-charcoal/70">
        Browse sample essentials and ritual kits, then add items when you are
        ready. Cart lines persist in a guest cookie for this browser.
      </p>
      <div className="mt-8">
        <Button href="/shop">Continue shopping</Button>
      </div>
    </div>
  );
}
