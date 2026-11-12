import { NextResponse } from "next/server";
import { persistAnalyticsEvent } from "@/lib/analytics/persist";
import {
  getPaymentConfig,
  verifyWebhookSignature,
} from "@/lib/payments";
import { markOrderPaidFromWebhook } from "@/lib/payments/orders";

export const runtime = "nodejs";

/**
 * Razorpay webhook — verifies HMAC signature before marking paid.
 * Never trust client redirects alone.
 */
export async function POST(request: Request) {
  const config = getPaymentConfig();
  if (!config.webhookSecretPresent) {
    return NextResponse.json(
      { ok: false, error: "Webhook secret not configured" },
      { status: 503 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json(
      { ok: false, error: "Invalid signature" },
      { status: 401 },
    );
  }

  let event: {
    event?: string;
    payload?: {
      payment?: {
        entity?: {
          id?: string;
          order_id?: string;
          amount?: number;
          currency?: string;
          status?: string;
        };
      };
    };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const paymentEntity = event.payload?.payment?.entity;
  const razorpayOrderId = paymentEntity?.order_id;
  const razorpayPaymentId = paymentEntity?.id;
  const status = paymentEntity?.status;

  if (
    event.event !== "payment.captured" &&
    !(event.event === "order.paid") &&
    status !== "captured"
  ) {
    // Acknowledge non-capture events without mutating order state
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (!razorpayOrderId || !razorpayPaymentId) {
    return NextResponse.json(
      { ok: false, error: "Missing payment identifiers" },
      { status: 400 },
    );
  }

  const result = await markOrderPaidFromWebhook({
    razorpayOrderId,
    razorpayPaymentId,
    rawEvent: event as Record<string, unknown>,
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  await persistAnalyticsEvent({
    name: "purchase",
    payload: {
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      amount_in_paise: paymentEntity?.amount ?? null,
      currency: paymentEntity?.currency ?? "INR",
      source: "razorpay_webhook",
    },
  });

  return NextResponse.json({ ok: true });
}
