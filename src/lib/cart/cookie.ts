import { cookies } from "next/headers";
import type { CartCookieLine, CartCookiePayload } from "./types";

export const CART_COOKIE_NAME = "narayan_guest_cart";
export const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 14; // 14 days
export const CART_MAX_LINE_QTY = 20;

export function parseCartCookie(raw: string | undefined): CartCookieLine[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as CartCookiePayload;
    if (!parsed || parsed.v !== 1 || !Array.isArray(parsed.lines)) return [];
    return parsed.lines
      .filter(
        (line) =>
          typeof line?.productId === "string" &&
          typeof line?.quantity === "number" &&
          Number.isFinite(line.quantity) &&
          line.quantity > 0,
      )
      .map((line) => ({
        productId: line.productId,
        quantity: Math.min(CART_MAX_LINE_QTY, Math.floor(line.quantity)),
      }));
  } catch {
    return [];
  }
}

export function serializeCartCookie(lines: CartCookieLine[]): string {
  const payload: CartCookiePayload = { v: 1, lines };
  return JSON.stringify(payload);
}

export async function readCartCookieLines(): Promise<CartCookieLine[]> {
  const jar = await cookies();
  return parseCartCookie(jar.get(CART_COOKIE_NAME)?.value);
}

export async function writeCartCookieLines(lines: CartCookieLine[]): Promise<void> {
  const jar = await cookies();
  if (lines.length === 0) {
    jar.delete(CART_COOKIE_NAME);
    return;
  }
  jar.set(CART_COOKIE_NAME, serializeCartCookie(lines), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CART_COOKIE_MAX_AGE,
  });
}
