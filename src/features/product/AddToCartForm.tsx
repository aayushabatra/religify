"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { addToCart } from "@/lib/cart/actions";
import type { Product } from "@/lib/catalog";
import { QuantitySelector } from "./QuantitySelector";

type AddToCartFormProps = {
  product: Product;
};

export function AddToCartForm({ product }: AddToCartFormProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    startTransition(async () => {
      const result = await addToCart(product.id, quantity);
      if (!result.ok) {
        setError(result.error);
        return;
      }

      track({
        name: "add_to_cart",
        payload: {
          item_id: product.id,
          item_name: product.name,
          item_slug: product.slug,
          price_in_paise: product.priceInPaise,
          quantity,
          currency: "INR",
          sample_data: true,
        },
      });

      setMessage(`Added ${quantity} to cart`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <QuantitySelector
        value={quantity}
        onChange={setQuantity}
        max={Math.min(20, Math.max(1, product.stockQuantity || 1))}
        disabled={pending}
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={pending}>
          {pending ? "Adding…" : "Add to cart"}
        </Button>
        <Button href="/cart" variant="outline" size="lg" className="w-full sm:w-auto">
          View cart
        </Button>
      </div>

      {error ? (
        <p className="text-sm text-burgundy" role="alert">
          {error}
        </p>
      ) : null}
      {message ? (
        <p className="text-sm text-forest" role="status">
          {message}
        </p>
      ) : null}
      <p className="text-xs text-charcoal/50">
        Sample catalogue — prices are placeholders, not live offers.
      </p>
    </form>
  );
}
