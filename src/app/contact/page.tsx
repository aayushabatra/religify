import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { storeConfig } from "@/config/store";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact placeholders for NARAYAN Hisar.",
};

export default function ContactPage() {
  return (
    <Container className="py-16 sm:py-20">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-burgundy/80">
        Contact
      </p>
      <h1 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">
        Get in touch
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/70">
        Owner-supplied phone, email, WhatsApp, and hours will replace these
        placeholders. A protected contact form ships in a later phase.
      </p>
      <address className="mt-10 max-w-md space-y-3 text-sm not-italic text-charcoal/80">
        <p>{storeConfig.location.addressLine}</p>
        <p>
          {storeConfig.location.city}, {storeConfig.location.state},{" "}
          {storeConfig.location.country}
        </p>
        <p>{storeConfig.contact.phone}</p>
        <p>{storeConfig.contact.email}</p>
        <p>{storeConfig.contact.whatsapp}</p>
        <p>{storeConfig.contact.hours}</p>
      </address>
    </Container>
  );
}
