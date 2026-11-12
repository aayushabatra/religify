"use server";

import { getDb } from "@/db/client";
import { newId } from "@/db/ids";
import { contactSubmissions } from "@/db/schema";
import { getCart } from "@/lib/cart";
import { clearCart } from "@/lib/cart/actions";
import { persistAnalyticsEvent } from "@/lib/analytics/persist";

export type EnquiryInput = {
  name: string;
  phone: string;
  email?: string;
  addressLine: string;
  pinCode: string;
  instructions?: string;
};

export type EnquiryResult =
  | { ok: true; id: string; stored: boolean }
  | { ok: false; error: string };

export async function submitOrderEnquiry(
  input: EnquiryInput,
): Promise<EnquiryResult> {
  const name = input.name.trim();
  const phone = input.phone.replace(/\s+/g, "");
  const addressLine = input.addressLine.trim();
  const pinCode = input.pinCode.trim();

  if (!name || !phone || !addressLine || !pinCode) {
    return { ok: false, error: "Please fill in name, mobile, address, and PIN code." };
  }
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return { ok: false, error: "Enter a valid 10-digit Indian mobile number." };
  }

  const cart = await getCart();
  const id = newId("enq");
  let stored = false;

  const db = getDb();
  if (db) {
    try {
      await db.insert(contactSubmissions).values({
        id,
        kind: "order_enquiry",
        name,
        phone,
        email: input.email?.trim() || null,
        addressLine,
        pinCode,
        message: input.instructions?.trim() || null,
        cartSnapshot: {
          itemCount: cart.itemCount,
          subtotalInPaise: cart.subtotalInPaise,
          lines: cart.lines.map((line) => ({
            productId: line.productId,
            slug: line.product.slug,
            name: line.product.name,
            quantity: line.quantity,
            unitPriceInPaise: line.unitPriceInPaise,
            lineTotalInPaise: line.lineTotalInPaise,
          })),
          paymentTaken: false,
        },
      });
      stored = true;
    } catch (error) {
      console.warn("[contact] DB insert failed; continuing demo path", error);
    }
  }

  await persistAnalyticsEvent({
    name: "contact_submit",
    payload: {
      form: "order_enquiry",
      item_count: cart.itemCount,
      value_in_paise: cart.subtotalInPaise,
      payment_taken: false,
      stored,
    },
  });

  await clearCart();
  return { ok: true, id, stored };
}
