import { getProductById } from "@/lib/catalog";
import { readCartCookieLines } from "./cookie";
import type { Cart, CartCookieLine, CartLine, CartSummary } from "./types";

export type {
  Cart,
  CartCookieLine,
  CartLine,
  CartMutationResult,
  CartSummary,
} from "./types";

export {
  CART_COOKIE_NAME,
  CART_MAX_LINE_QTY,
  readCartCookieLines,
  writeCartCookieLines,
} from "./cookie";

/**
 * Hydrate cookie lines with catalogue products and server-validated prices.
 * Drops unknown / inactive products. Never trusts client-supplied prices.
 */
export async function hydrateCart(cookieLines: CartCookieLine[]): Promise<Cart> {
  const lines: CartLine[] = [];

  for (const line of cookieLines) {
    const product = await getProductById(line.productId);
    if (!product || !product.isActive) continue;

    const maxQty = Math.min(
      product.stockQuantity > 0 ? product.stockQuantity : 1,
      20,
    );
    const quantity = Math.max(1, Math.min(maxQty, Math.floor(line.quantity)));
    const unitPriceInPaise = product.priceInPaise;
    lines.push({
      productId: product.id,
      quantity,
      product,
      unitPriceInPaise,
      lineTotalInPaise: unitPriceInPaise * quantity,
    });
  }

  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const subtotalInPaise = lines.reduce(
    (sum, line) => sum + line.lineTotalInPaise,
    0,
  );

  return {
    lines,
    itemCount,
    subtotalInPaise,
    isSamplePricing: lines.every((line) => line.product.isSampleData),
  };
}

export async function getCart(): Promise<Cart> {
  const lines = await readCartCookieLines();
  return hydrateCart(lines);
}

export async function getCartSummary(): Promise<CartSummary> {
  const cart = await getCart();
  return { itemCount: cart.itemCount };
}

export function cartLinesForCookie(cart: Cart): CartCookieLine[] {
  return cart.lines.map((line) => ({
    productId: line.productId,
    quantity: line.quantity,
  }));
}
