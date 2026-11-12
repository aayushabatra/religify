import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPolicyPage() {
  return (
    <Container className="py-16 sm:py-20">
      <h1 className="font-display text-4xl text-charcoal">Privacy policy</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal/70">
        Privacy and data-handling practices to be completed with the business
        before launch. Placeholder page only.
      </p>
    </Container>
  );
}
