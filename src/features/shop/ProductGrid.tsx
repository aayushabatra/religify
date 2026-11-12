import type { Product } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  emptyMessage?: string;
};

export function ProductGrid({
  products,
  emptyMessage = "No products match this view yet.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-gold/40 bg-white/40 px-6 py-16 text-center">
        <p className="font-display text-2xl text-charcoal">Nothing here yet</p>
        <p className="mt-2 text-sm text-charcoal/65">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product, index) => (
        <li key={product.id}>
          <ProductCard product={product} priority={index < 4} />
        </li>
      ))}
    </ul>
  );
}
