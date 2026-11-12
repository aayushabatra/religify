"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, type FormEvent, type HTMLAttributes } from "react";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics";
import { clearCart } from "@/lib/cart/actions";

type RazorpayCheckoutFormProps = {
  keyId: string;
  itemCount: number;
  subtotalInPaise: number;
};

type RazorpaySuccessResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (window.Razorpay) return true;
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayCheckoutForm({
  keyId,
  itemCount,
  subtotalInPaise,
}: RazorpayCheckoutFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [awaitingWebhook, setAwaitingWebhook] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const addressLine = String(form.get("address") ?? "").trim();
    const pinCode = String(form.get("pin") ?? "").trim();
    const deliveryInstructions = String(form.get("instructions") ?? "").trim();
    const honeypot = String(form.get("company") ?? "").trim();

    if (honeypot) return;

    if (!name || !phone || !addressLine || !pinCode) {
      setError("Please fill in name, mobile, address, and PIN code.");
      return;
    }

    startTransition(async () => {
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setError("Could not load Razorpay Checkout. Try again or use order enquiry.");
        return;
      }

      const createRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email: email || undefined,
          addressLine,
          pinCode,
          deliveryInstructions: deliveryInstructions || undefined,
        }),
      });
      const created = (await createRes.json()) as {
        ok: boolean;
        error?: string;
        orderId?: string;
        razorpayOrderId?: string;
        amountInPaise?: number;
        currency?: string;
        keyId?: string;
      };

      if (!created.ok || !created.razorpayOrderId || !created.amountInPaise) {
        setError(created.error ?? "Could not create payment order.");
        return;
      }

      track({
        name: "begin_checkout",
        payload: {
          checkout_mode: "razorpay",
          item_count: itemCount,
          value_in_paise: subtotalInPaise,
          order_id: created.orderId ?? null,
          payment_taken: false,
        },
      });

      const rzp = new window.Razorpay({
        key: created.keyId ?? keyId,
        amount: created.amountInPaise,
        currency: created.currency ?? "INR",
        name: "NARAYAN",
        description: "Rituals & Living order",
        order_id: created.razorpayOrderId,
        prefill: { name, contact: phone, email: email || undefined },
        handler: async (response: RazorpaySuccessResponse) => {
          // Do NOT mark paid here — webhook is authoritative.
          setAwaitingWebhook(true);
          await clearCart();
          router.refresh();
          void response;
        },
        modal: {
          ondismiss: () => {
            setError("Payment window closed. Your order is not marked paid.");
          },
        },
      });

      rzp.on("payment.failed", () => {
        setError("Payment failed. No charge was completed for this attempt.");
      });

      rzp.open();
    });
  }

  if (awaitingWebhook) {
    return (
      <div className="rounded-sm border border-forest/30 bg-forest/5 p-6" role="status">
        <h2 className="font-display text-2xl text-charcoal">
          Payment submitted — awaiting confirmation
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
          Your payment was sent to Razorpay. This storefront marks orders paid
          only after a <strong>verified webhook</strong> — not from this browser
          redirect. If confirmation takes too long, contact the shop with your
          Razorpay payment id.
        </p>
        <div className="mt-6">
          <Button href="/shop" variant="outline">
            Continue browsing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <p className="rounded-sm border border-forest/30 bg-forest/5 px-4 py-3 text-sm text-charcoal/80">
        <strong className="font-medium text-forest">Razorpay Checkout.</strong>{" "}
        Card/UPI data stays with Razorpay. Paid status is confirmed only via
        signed webhook — this form will never fake a successful purchase.
      </p>

      <Field label="Full name" name="name" required autoComplete="name" />
      <Field
        label="Mobile number"
        name="phone"
        required
        autoComplete="tel"
        inputMode="tel"
        placeholder="10-digit mobile"
      />
      <Field label="Email (optional)" name="email" type="email" autoComplete="email" />
      <Field
        label="Delivery address"
        name="address"
        required
        autoComplete="street-address"
        as="textarea"
      />
      <Field
        label="PIN code"
        name="pin"
        required
        autoComplete="postal-code"
        inputMode="numeric"
      />
      <Field label="Delivery instructions (optional)" name="instructions" as="textarea" />

      <div className="hidden" aria-hidden="true">
        <label htmlFor="company-rz">Company</label>
        <input id="company-rz" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {error ? (
        <p className="text-sm text-burgundy" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Starting Razorpay…" : "Pay with Razorpay"}
      </Button>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  required?: boolean;
  type?: string;
  autoComplete?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  as?: "input" | "textarea";
};

function Field({
  label,
  name,
  required,
  type = "text",
  autoComplete,
  inputMode,
  placeholder,
  as = "input",
}: FieldProps) {
  const id = `rz-${name}`;
  const className =
    "mt-1.5 w-full rounded-sm border border-gold/40 bg-white/70 px-3 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20";

  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-[0.14em] text-charcoal/60">
        {label}
        {required ? <span className="text-burgundy"> *</span> : null}
      </label>
      {as === "textarea" ? (
        <textarea id={id} name={name} required={required} rows={3} className={className} />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
          placeholder={placeholder}
          className={className}
        />
      )}
    </div>
  );
}
