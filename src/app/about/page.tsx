import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { storeConfig } from "@/config/store";

export const metadata: Metadata = {
  title: "Our Story",
  description: `About ${storeConfig.brand.name} — ${storeConfig.brand.descriptor}.`,
};

export default function AboutPage() {
  return (
    <Container className="py-16 sm:py-20">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-burgundy/80">
        Our story
      </p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl text-charcoal sm:text-5xl">
        {storeConfig.brand.name} — {storeConfig.brand.descriptor}
      </h1>
      <div className="mt-8 max-w-2xl space-y-4 text-sm leading-relaxed text-charcoal/75 sm:text-base">
        <p>
          {storeConfig.brand.name} — {storeConfig.brand.descriptor} is the
          contemporary expression of {storeConfig.brand.legacyName}, a family-run
          pooja business rooted in the everyday traditions of Indian homes.
        </p>
        <p>
          We bring together familiar ritual essentials and thoughtfully curated
          collections to make preparing for moments of devotion simpler and more
          considered — starting from Hisar, Haryana.
        </p>
        <p className="text-charcoal/55">
          Draft positioning copy. Confirm family-business details before
          publishing specific history, founding dates, or manufacturing claims.
        </p>
      </div>
    </Container>
  );
}
