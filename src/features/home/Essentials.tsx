import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ProductGrid } from "@/features/shop";
import type { Product } from "@/lib/catalog";

type EssentialsProps = {
  products: Product[];
};

export function Essentials({ products }: EssentialsProps) {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="essentials">
      <Container>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-burgundy/80">
              Everyday
            </p>
            <h2
              id="essentials"
              className="mt-3 font-display text-3xl text-charcoal sm:text-4xl"
            >
              Everyday essentials
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
              Familiar items for daily home pooja — shown here as labelled sample
              products.
            </p>
          </div>
          <Button href="/collections/everyday-essentials" variant="outline">
            Shop essentials
          </Button>
        </div>

        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
      </Container>
    </section>
  );
}
