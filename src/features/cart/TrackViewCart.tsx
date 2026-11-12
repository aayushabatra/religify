"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

type TrackViewCartProps = {
  itemCount: number;
  subtotalInPaise: number;
};

export function TrackViewCart({ itemCount, subtotalInPaise }: TrackViewCartProps) {
  useEffect(() => {
    track({
      name: "view_cart",
      payload: {
        item_count: itemCount,
        value_in_paise: subtotalInPaise,
        currency: "INR",
      },
    });
  }, [itemCount, subtotalInPaise]);

  return null;
}
