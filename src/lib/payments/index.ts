import { createHmac, timingSafeEqual } from "crypto";
import Razorpay from "razorpay";
import { isDatabaseConfigured } from "@/db/client";

export type PaymentProvider = "razorpay" | "none";

export type PaymentMode = "order-enquiry" | "razorpay" | "razorpay-pending";

export type PaymentConfig = {
  provider: PaymentProvider;
  /** True only when keys + webhook secret + DB are configured for live capture. */
  enabled: boolean;
  keysPresent: boolean;
  webhookSecretPresent: boolean;
  databaseConfigured: boolean;
  mode: PaymentMode;
  keyIdPublic: string | null;
  note: string;
};

function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

export function getPaymentConfig(): PaymentConfig {
  const keyId = readEnv("RAZORPAY_KEY_ID");
  const keySecret = readEnv("RAZORPAY_KEY_SECRET");
  const webhookSecret = readEnv("RAZORPAY_WEBHOOK_SECRET");
  const keysPresent = Boolean(keyId && keySecret);
  const webhookSecretPresent = Boolean(webhookSecret);
  const databaseConfigured = isDatabaseConfigured();
  const enabled = keysPresent && webhookSecretPresent && databaseConfigured;

  if (!keysPresent) {
    return {
      provider: "none",
      enabled: false,
      keysPresent: false,
      webhookSecretPresent,
      databaseConfigured,
      mode: "order-enquiry",
      keyIdPublic: null,
      note: "Razorpay keys are not configured. Checkout is a labelled demo / order-enquiry flow only — no payment is taken.",
    };
  }

  if (!enabled) {
    return {
      provider: "razorpay",
      enabled: false,
      keysPresent: true,
      webhookSecretPresent,
      databaseConfigured,
      mode: "razorpay-pending",
      keyIdPublic: keyId ?? null,
      note:
        "Razorpay keys are present, but live checkout also needs RAZORPAY_WEBHOOK_SECRET and DATABASE_URL. Until then, use the demo enquiry path — no order will be marked paid from the client alone.",
    };
  }

  return {
    provider: "razorpay",
    enabled: true,
    keysPresent: true,
    webhookSecretPresent: true,
    databaseConfigured: true,
    mode: "razorpay",
    keyIdPublic: keyId ?? null,
    note: "Razorpay Checkout is available. Orders are marked paid only after a verified webhook — never from the browser alone.",
  };
}

export function getRazorpayClient(): Razorpay | null {
  const keyId = readEnv("RAZORPAY_KEY_ID");
  const keySecret = readEnv("RAZORPAY_KEY_SECRET");
  if (!keyId || !keySecret) return null;
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

export function verifyWebhookSignature(
  rawBody: string,
  signature: string | null,
): boolean {
  const secret = readEnv("RAZORPAY_WEBHOOK_SECRET");
  if (!secret || !signature) return false;

  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function verifyPaymentSignature(args: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  const secret = readEnv("RAZORPAY_KEY_SECRET");
  if (!secret) return false;
  const payload = `${args.orderId}|${args.paymentId}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(args.signature);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
