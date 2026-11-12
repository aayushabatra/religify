/**
 * Payments interface stub — Razorpay wiring is Phase C.
 * Do not claim live payments work until merchant credentials and webhooks are configured.
 */

export type PaymentProvider = "razorpay" | "none";

export type PaymentConfig = {
  provider: PaymentProvider;
  enabled: boolean;
  note: string;
};

export function getPaymentConfig(): PaymentConfig {
  return {
    provider: "none",
    enabled: false,
    note: "Payment integration not configured. Checkout remains a later phase.",
  };
}
