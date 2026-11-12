"use client";

import {
  useState,
  useTransition,
  type FormEvent,
  type HTMLAttributes,
} from "react";
import { Button } from "@/components/ui/Button";
import { storeConfig } from "@/config/store";
import { track } from "@/lib/analytics";
import { submitOrderEnquiry } from "@/lib/contact/submitEnquiry";

type OrderEnquiryFormProps = {
  itemCount: number;
  subtotalLabel: string;
};

export function OrderEnquiryForm({
  itemCount,
  subtotalLabel,
}: OrderEnquiryFormProps) {
  const [pending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();
    const address = String(form.get("address") ?? "").trim();
    const pin = String(form.get("pin") ?? "").trim();
    const honeypot = String(form.get("company") ?? "").trim();

    if (honeypot) {
      // Silent drop for bots
      setSubmitted(true);
      return;
    }

    if (!name || !phone || !address || !pin) {
      setError("Please fill in name, mobile, address, and PIN code.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone.replace(/\s+/g, ""))) {
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    startTransition(async () => {
      const email = String(form.get("email") ?? "").trim();
      const instructions = String(form.get("instructions") ?? "").trim();
      const result = await submitOrderEnquiry({
        name,
        phone,
        email: email || undefined,
        addressLine: address,
        pinCode: pin,
        instructions: instructions || undefined,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      track({
        name: "contact_submit",
        payload: {
          form: "order_enquiry",
          item_count: itemCount,
          value_label: subtotalLabel,
          payment_taken: false,
          enquiry_id: result.id,
          stored: result.stored,
        },
      });

      // Demo only — do not mark paid, do not call Razorpay
      setSubmitted(true);
    });
  }

  if (submitted) {
    return (
      <div
        className="rounded-sm border border-forest/30 bg-forest/5 p-6"
        role="status"
      >
        <h2 className="font-display text-2xl text-charcoal">
          Enquiry recorded (demo)
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
          This is a development demo. No payment was taken, no order was marked
          paid, and fulfilment was not started. When the business supplies
          verified contact details, enquiries can route to WhatsApp or email
          from Hisar.
        </p>
        <p className="mt-3 text-xs text-charcoal/55">
          Contact placeholders: {storeConfig.contact.phone} ·{" "}
          {storeConfig.contact.whatsapp}
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
      <p className="rounded-sm border border-gold/40 bg-[#f8f4ec] px-4 py-3 text-sm text-charcoal/80">
        <strong className="font-medium text-burgundy">Demo / order enquiry.</strong>{" "}
        Razorpay is not live on this build. Submitting will not charge you or
        create a paid order.
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
      <Field
        label="Email (optional)"
        name="email"
        type="email"
        autoComplete="email"
      />
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
      <Field
        label="Delivery instructions (optional)"
        name="instructions"
        as="textarea"
      />

      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {error ? (
        <p className="text-sm text-burgundy" role="alert">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Sending enquiry…" : "Send order enquiry"}
      </Button>
      <p className="text-xs text-charcoal/55">
        Shipping from Hisar, Haryana — rates and serviceable PINs to be confirmed.
        No payment details are collected on this form.
      </p>
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
  const id = `checkout-${name}`;
  const className =
    "mt-1.5 w-full rounded-sm border border-gold/40 bg-white/70 px-3 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20";

  return (
    <div>
      <label htmlFor={id} className="text-xs uppercase tracking-[0.14em] text-charcoal/60">
        {label}
        {required ? <span className="text-burgundy"> *</span> : null}
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          name={name}
          required={required}
          rows={3}
          className={className}
          placeholder={placeholder}
        />
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
