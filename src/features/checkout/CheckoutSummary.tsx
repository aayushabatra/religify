import Image from "next/image";
import { storeConfig } from "@/config/store";
import type { Cart } from "@/lib/cart";
import { formatInr } from "@/lib/currency";

type CheckoutSummaryProps = {
  cart: Cart;
};

export function CheckoutSummary({ cart }: CheckoutSummaryProps) {
  return (
    <aside className="rounded-sm border border-gold/30 bg-[#f8f4ec] p-6">
      <h2 className="font-display text-2xl text-charcoal">Order summary</h2>
      <ul className="mt-6 space-y-4">
        {cart.lines.map((line) => {
          const image = line.product.images[0];
          return (
            <li key={line.productId} className="flex gap-3">
              <div className="relative h-16 w-12 shrink-0 overflow-hidden bg-[#ebe4d8]">
                {image ? (
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                    unoptimized={image.src.endsWith(".svg")}
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-charcoal">{line.product.name}</p>
                <p className="text-xs text-charcoal/55">Qty {line.quantity}</p>
              </div>
              <p className="text-sm text-charcoal">
                {formatInr(line.lineTotalInPaise)}
              </p>
            </li>
          );
        })}
      </ul>

      <dl className="mt-6 space-y-2 border-t border-gold/30 pt-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-charcoal/65">Subtotal</dt>
          <dd>{formatInr(cart.subtotalInPaise)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-charcoal/65">Shipping</dt>
          <dd className="text-charcoal/70">To be confirmed</dd>
        </div>
        <div className="flex justify-between font-medium">
          <dt>Enquiry total (sample)</dt>
          <dd>{formatInr(cart.subtotalInPaise)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-charcoal/55">
        {storeConfig.sampleDataNotice}
      </p>
    </aside>
  );
}
