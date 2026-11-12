import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { storeConfig } from "@/config/store";

export function StoryStrip() {
  return (
    <section className="bg-burgundy py-16 text-ivory sm:py-20" aria-labelledby="story-strip">
      <Container className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
        <div className="animate-fade-in">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-gold">
            Our story
          </p>
          <h2 id="story-strip" className="mt-3 font-display text-3xl sm:text-4xl">
            From {storeConfig.brand.legacyName} to {storeConfig.brand.name}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ivory/80 sm:text-base">
            {storeConfig.brand.name} — {storeConfig.brand.descriptor} is the
            contemporary expression of {storeConfig.brand.legacyName}, a
            family-run pooja business rooted in the everyday traditions of Indian
            homes in Hisar, Haryana. Draft positioning copy — confirm family
            details before publishing specific history.
          </p>
        </div>
        <div className="md:justify-self-end">
          <Button
            href="/about"
            variant="outline"
            className="border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory/10 hover:text-ivory focus-visible:ring-ivory/40 focus-visible:ring-offset-burgundy"
          >
            Read our story
          </Button>
        </div>
      </Container>
    </section>
  );
}
