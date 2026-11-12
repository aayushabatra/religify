"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { SampleBadge } from "@/components/ui/SampleBadge";
import { track } from "@/lib/analytics";
import { removeFromCart, updateCartQuantity } from "@/lib/cart/actions";
import type { CartLine } from "@/lib/cart";
import { formatInr } from "@/lib/currency";
import { QuantitySelector } from "@/features/product/QuantitySelector";

type CartLineItemProps = {
  line: CartLine;
};

export function CartLineItem({ line }: CartLineItemProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const image = line.product.images[0];

  function refresh() {
    router.refresh();
  }

  function onQuantityChange(next: number) {
    startTransition(async () => {
      await updateCartQuantity(line.productId, next);
      refresh();
    });
  }

  function onRemove() {
    startTransition(async () => {
      await removeFromCart(line.productId);
      track({
        name: "remove_from_cart",
        payload: {
          item_id: line.product.id,
          item_name: line.product.name,
          quantity: line.quantity,
          price_in_paise: line.unitPriceInPaise,
          currency: "INR",
          sample_data: true,
        },
      });
      refresh();
    });
  }

  return (
    <article className="grid grid-cols-[5rem_1fr] gap-4 border-b border-gold/25 py-6 sm:grid-cols-[7rem_1fr_auto] sm:gap-6">
      <Link
        href={`/products/${line.product.slug}`}
        className="relative aspect-[4/5] overflow-hidden bg-[#ebe4d8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40"
      >
        {image ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="112px"
            className="object-cover"
            unoptimized={image.src.endsWith(".svg")}
          />
        ) : null}
        {line.product.isSampleData ? (
          <SampleBadge className="absolute left-1 top-1 scale-90" />
        ) : null}
      </Link>

      <div className="min-w-0">
        <h2 className="font-display text-xl text-charcoal">
          <Link
            href={`/products/${line.product.slug}`}
            className="hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30"
          >
            {line.product.name}
          </Link>
        </h2>
        <p className="mt-1 text-xs text-charcoal/55">{line.product.subtitle}</p>
        <p className="mt-2 text-sm text-charcoal">
          {formatInr(line.unitPriceInPaise)}
          <span className="ml-2 text-[10px] uppercase tracking-wider text-charcoal/45">
            sample / unit
          </span>
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          <QuantitySelector
            id={`qty-${line.productId}`}
            value={line.quantity}
            onChange={onQuantityChange}
            max={Math.min(20, Math.max(1, line.product.stockQuantity || 1))}
            disabled={pending}
          />
          <button
            type="button"
            onClick={onRemove}
            disabled={pending}
            className="text-sm text-burgundy underline-offset-4 hover:underline disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="col-span-2 flex items-start justify-between sm:col-span-1 sm:flex-col sm:items-end sm:justify-start">
        <p className="text-sm font-medium text-charcoal">
          {formatInr(line.lineTotalInPaise)}
        </p>
        <p className="text-[10px] uppercase tracking-wider text-charcoal/45">
          line total
        </p>
      </div>
    </article>
  );
}
