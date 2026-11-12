/**
 * Payments interface — Razorpay live checkout is Phase C.
 * Phase B never claims a successful payment, even if env keys exist.
 */

export type PaymentProvider = "razorpay" | "none";

export type PaymentConfig = {
  provider: PaymentProvider;
  /** Live charge enabled — always false until Phase C webhook path ships. */
  enabled: boolean;
  keysPresent: boolean;
  mode: "order-enquiry" | "razorpay-pending";
  note: string;
};

export function getPaymentConfig(): PaymentConfig {
  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  const keysPresent = Boolean(keyId && keySecret);

  if (!keysPresent) {
    return {
      provider: "none",
      enabled: false,
      keysPresent: false,
      mode: "order-enquiry",
      note: "Razorpay keys are not configured. Checkout is a labelled demo / order-enquiry flow only — no payment is taken.",
    };
  }

  return {
    provider: "razorpay",
    enabled: false,
    keysPresent: true,
    mode: "razorpay-pending",
    note: "Razorpay keys are present, but live checkout and webhooks are Phase C. This build will not charge a card or mark an order paid.",
  };
}
