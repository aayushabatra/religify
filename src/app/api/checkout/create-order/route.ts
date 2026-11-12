import { NextResponse } from "next/server";
import { getCart } from "@/lib/cart";
import { createCheckoutOrder } from "@/lib/payments/orders";
import { persistAnalyticsEvent } from "@/lib/analytics/persist";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const input = body as {
    name?: string;
    phone?: string;
    email?: string;
    addressLine?: string;
    pinCode?: string;
    deliveryInstructions?: string;
  };

  const name = String(input.name ?? "").trim();
  const phone = String(input.phone ?? "").replace(/\s+/g, "");
  const addressLine = String(input.addressLine ?? "").trim();
  const pinCode = String(input.pinCode ?? "").trim();

  if (!name || !phone || !addressLine || !pinCode) {
    return NextResponse.json(
      { ok: false, error: "Missing required customer fields." },
      { status: 400 },
    );
  }
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid 10-digit Indian mobile number." },
      { status: 400 },
    );
  }

  const cart = await getCart();
  const result = await createCheckoutOrder(cart, {
    name,
    phone,
    email: input.email?.trim(),
    addressLine,
    pinCode,
    deliveryInstructions: input.deliveryInstructions?.trim(),
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  await persistAnalyticsEvent({
    name: "begin_checkout",
    payload: {
      checkout_mode: "razorpay",
      order_id: result.orderId,
      value_in_paise: result.amountInPaise,
      currency: "INR",
      payment_taken: false,
    },
  });

  return NextResponse.json(result);
}
