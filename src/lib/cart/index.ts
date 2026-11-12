/**
 * Cart service stub — Phase B will add server cart + guest cookie.
 * Phase A only exposes a zero count for header UI.
 */

export type CartSummary = {
  itemCount: number;
};

export function getCartSummary(): CartSummary {
  return { itemCount: 0 };
}
