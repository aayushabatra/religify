import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/features/shop";
import type { Product } from "@/lib/catalog";

type FeaturedKitsProps = {
  products: Product[];
};

export function FeaturedKits({ products }: FeaturedKitsProps) {
  return (
    <section className="border-y border-gold/20 bg-[#f8f4ec] py-16 sm:py-20" aria-labelledby="featured-kits">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-burgundy/80">
              Ritual kits
            </p>
            <h2
              id="featured-kits"
              className="mt-3 font-display text-3xl text-charcoal sm:text-4xl"
            >
              Featured kits
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
              Sample kits for development — contents and prices are placeholders
              until verified.
            </p>
          </div>
          <Button href="/collections/ritual-kits" variant="outline">
            View all kits
          </Button>
        </div>

        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
      </Container>
    </section>
  );
}
