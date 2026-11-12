import type { Product } from "@/lib/catalog";

/** Cookie payload — never stores prices; server rehydrates from catalogue. */
export type CartCookieLine = {
  productId: string;
  quantity: number;
};

export type CartCookiePayload = {
  v: 1;
  lines: CartCookieLine[];
};

export type CartLine = {
  productId: string;
  quantity: number;
  product: Product;
  /** Server-validated unit price from catalogue (paise). */
  unitPriceInPaise: number;
  /** Server-validated line total (paise). */
  lineTotalInPaise: number;
};

export type Cart = {
  lines: CartLine[];
  itemCount: number;
  subtotalInPaise: number;
  isSamplePricing: boolean;
};

export type CartSummary = {
  itemCount: number;
};

export type CartMutationResult =
  | { ok: true; cart: Cart }
  | { ok: false; error: string };
