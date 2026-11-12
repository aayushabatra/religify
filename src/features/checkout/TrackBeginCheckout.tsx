"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

type TrackBeginCheckoutProps = {
  itemCount: number;
  subtotalInPaise: number;
  mode: string;
};

export function TrackBeginCheckout({
  itemCount,
  subtotalInPaise,
  mode,
}: TrackBeginCheckoutProps) {
  useEffect(() => {
    track({
      name: "begin_checkout",
      payload: {
        item_count: itemCount,
        value_in_paise: subtotalInPaise,
        currency: "INR",
        checkout_mode: mode,
        payment_taken: false,
      },
    });
  }, [itemCount, subtotalInPaise, mode]);

  return null;
}
