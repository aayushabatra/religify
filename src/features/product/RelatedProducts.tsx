import { ProductGrid } from "@/features/shop";
import type { Product } from "@/lib/catalog";

type RelatedProductsProps = {
  products: Product[];
};

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16 border-t border-gold/25 pt-12" aria-labelledby="related-products">
      <h2 id="related-products" className="font-display text-3xl text-charcoal">
        You may also like
      </h2>
      <p className="mt-2 text-sm text-charcoal/65">
        Related sample products from the catalogue.
      </p>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </section>
  );
}
