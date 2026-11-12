"use server";

import { revalidatePath } from "next/cache";
import { getProductById } from "@/lib/catalog";
import {
  cartLinesForCookie,
  getCart,
  hydrateCart,
  writeCartCookieLines,
} from "./index";
import { CART_MAX_LINE_QTY, readCartCookieLines } from "./cookie";
import type { CartMutationResult } from "./types";

function revalidateCommerce() {
  revalidatePath("/", "layout");
  revalidatePath("/cart");
  revalidatePath("/checkout");
}

export async function addToCart(
  productId: string,
  quantity = 1,
): Promise<CartMutationResult> {
  const product = await getProductById(productId);
  if (!product || !product.isActive) {
    return { ok: false, error: "That product is not available." };
  }

  const qty = Math.max(1, Math.min(CART_MAX_LINE_QTY, Math.floor(quantity)));
  const existing = await readCartCookieLines();
  const next = [...existing];
  const index = next.findIndex((line) => line.productId === productId);

  if (index >= 0) {
    next[index] = {
      productId,
      quantity: Math.min(CART_MAX_LINE_QTY, next[index].quantity + qty),
    };
  } else {
    next.push({ productId, quantity: qty });
  }

  const cart = await hydrateCart(next);
  await writeCartCookieLines(cartLinesForCookie(cart));
  revalidateCommerce();
  return { ok: true, cart };
}

export async function updateCartQuantity(
  productId: string,
  quantity: number,
): Promise<CartMutationResult> {
  const product = await getProductById(productId);
  if (!product || !product.isActive) {
    return { ok: false, error: "That product is not available." };
  }

  const existing = await readCartCookieLines();
  let next = [...existing];

  if (quantity <= 0) {
    next = next.filter((line) => line.productId !== productId);
  } else {
    const qty = Math.min(CART_MAX_LINE_QTY, Math.floor(quantity));
    const index = next.findIndex((line) => line.productId === productId);
    if (index >= 0) {
      next[index] = { productId, quantity: qty };
    } else {
      next.push({ productId, quantity: qty });
    }
  }

  const cart = await hydrateCart(next);
  await writeCartCookieLines(cartLinesForCookie(cart));
  revalidateCommerce();
  return { ok: true, cart };
}

export async function removeFromCart(
  productId: string,
): Promise<CartMutationResult> {
  const existing = await readCartCookieLines();
  const next = existing.filter((line) => line.productId !== productId);
  const cart = await hydrateCart(next);
  await writeCartCookieLines(cartLinesForCookie(cart));
  revalidateCommerce();
  return { ok: true, cart };
}

export async function clearCart(): Promise<CartMutationResult> {
  await writeCartCookieLines([]);
  revalidateCommerce();
  return { ok: true, cart: await getCart() };
}
