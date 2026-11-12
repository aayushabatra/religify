"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import type { Product } from "@/lib/catalog";

export function TrackViewItem({ product }: { product: Product }) {
  useEffect(() => {
    track({
      name: "view_item",
      payload: {
        item_id: product.id,
        item_name: product.name,
        item_slug: product.slug,
        price_in_paise: product.priceInPaise,
        currency: "INR",
        sample_data: true,
      },
    });
  }, [product.id, product.name, product.slug, product.priceInPaise]);

  return null;
}
