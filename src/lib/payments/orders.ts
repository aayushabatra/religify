import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { newId } from "@/db/ids";
import { orderItems, orders, payments } from "@/db/schema";
import type { Cart } from "@/lib/cart";
import { getRazorpayClient, getPaymentConfig } from "./index";

export type CheckoutCustomerInput = {
  name: string;
  phone: string;
  email?: string;
  addressLine: string;
  pinCode: string;
  deliveryInstructions?: string;
};

export type CreateCheckoutOrderResult =
  | {
      ok: true;
      orderId: string;
      razorpayOrderId: string;
      amountInPaise: number;
      currency: "INR";
      keyId: string;
    }
  | { ok: false; error: string };

/**
 * Creates a pending DB order from a server-validated cart, then a Razorpay order.
 * Never marks the order paid — that happens only via verified webhook.
 */
export async function createCheckoutOrder(
  cart: Cart,
  customer: CheckoutCustomerInput,
): Promise<CreateCheckoutOrderResult> {
  const config = getPaymentConfig();
  if (!config.enabled || !config.keyIdPublic) {
    return {
      ok: false,
      error:
        "Live Razorpay checkout is not fully configured (keys, webhook secret, and DATABASE_URL required).",
    };
  }

  if (cart.lines.length === 0) {
    return { ok: false, error: "Cart is empty." };
  }

  // Re-validate totals from hydrated cart (catalogue prices only)
  const subtotalInPaise = cart.lines.reduce(
    (sum, line) => sum + line.unitPriceInPaise * line.quantity,
    0,
  );
  if (subtotalInPaise !== cart.subtotalInPaise || subtotalInPaise <= 0) {
    return { ok: false, error: "Cart totals failed server validation." };
  }

  const db = getDb();
  const razorpay = getRazorpayClient();
  if (!db || !razorpay) {
    return { ok: false, error: "Payment infrastructure is unavailable." };
  }

  const orderId = newId("ord");
  const shippingInPaise = 0;
  const totalInPaise = subtotalInPaise + shippingInPaise;

  await db.insert(orders).values({
    id: orderId,
    status: "pending",
    currency: "INR",
    subtotalInPaise,
    shippingInPaise,
    totalInPaise,
    customerName: customer.name,
    customerPhone: customer.phone,
    customerEmail: customer.email || null,
    addressLine: customer.addressLine,
    pinCode: customer.pinCode,
    deliveryInstructions: customer.deliveryInstructions || null,
  });

  await db.insert(orderItems).values(
    cart.lines.map((line) => ({
      id: newId("oi"),
      orderId,
      productId: line.productId,
      productSlug: line.product.slug,
      productName: line.product.name,
      quantity: line.quantity,
      unitPriceInPaise: line.unitPriceInPaise,
      lineTotalInPaise: line.lineTotalInPaise,
    })),
  );

  const rzOrder = await razorpay.orders.create({
    amount: totalInPaise,
    currency: "INR",
    receipt: orderId.slice(0, 40),
    notes: {
      narayan_order_id: orderId,
      sample_pricing: cart.isSamplePricing ? "true" : "false",
    },
  });

  const razorpayOrderId = String(rzOrder.id);

  await db
    .update(orders)
    .set({ razorpayOrderId, updatedAt: new Date() })
    .where(eq(orders.id, orderId));

  await db.insert(payments).values({
    id: newId("pay"),
    orderId,
    provider: "razorpay",
    status: "created",
    amountInPaise: totalInPaise,
    currency: "INR",
    razorpayOrderId,
  });

  return {
    ok: true,
    orderId,
    razorpayOrderId,
    amountInPaise: totalInPaise,
    currency: "INR",
    keyId: config.keyIdPublic,
  };
}

export async function markOrderPaidFromWebhook(args: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  rawEvent: Record<string, unknown>;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const db = getDb();
  if (!db) return { ok: false, error: "Database unavailable." };

  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.razorpayOrderId, args.razorpayOrderId))
    .limit(1);

  if (!order) {
    return { ok: false, error: "Order not found for Razorpay order id." };
  }

  if (order.status === "paid") {
    return { ok: true };
  }

  await db
    .update(orders)
    .set({
      status: "paid",
      paidAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(orders.id, order.id));

  const existingPayments = await db
    .select()
    .from(payments)
    .where(eq(payments.orderId, order.id));

  const open = existingPayments.find((p) => p.status !== "captured");
  if (open) {
    await db
      .update(payments)
      .set({
        status: "captured",
        razorpayPaymentId: args.razorpayPaymentId,
        rawEvent: args.rawEvent,
        updatedAt: new Date(),
      })
      .where(eq(payments.id, open.id));
  } else {
    await db.insert(payments).values({
      id: newId("pay"),
      orderId: order.id,
      provider: "razorpay",
      status: "captured",
      amountInPaise: order.totalInPaise,
      currency: "INR",
      razorpayOrderId: args.razorpayOrderId,
      razorpayPaymentId: args.razorpayPaymentId,
      rawEvent: args.rawEvent,
    });
  }

  return { ok: true };
}
