import Image from "next/image";
import Link from "next/link";
import { SampleBadge } from "@/components/ui/SampleBadge";
import { formatInr } from "@/lib/currency";
import type { Product } from "@/lib/catalog";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const image = product.images[0];

  return (
    <article className="group">
      <Link
        href={`/products/${product.slug}`}
        className="block rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe4d8]">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              priority={priority}
              unoptimized={image.src.endsWith(".svg")}
            />
          ) : null}
          {product.isSampleData ? (
            <SampleBadge className="absolute left-2 top-2" />
          ) : null}
        </div>
        <div className="mt-3 space-y-1">
          <h3 className="font-display text-lg leading-snug text-charcoal transition-colors group-hover:text-burgundy">
            {product.name}
          </h3>
          <p className="text-xs text-charcoal/60">{product.subtitle}</p>
          <p className="pt-1 text-sm text-charcoal">
            {formatInr(product.priceInPaise)}
            <span className="ml-2 text-[10px] uppercase tracking-wider text-charcoal/45">
              sample price
            </span>
          </p>
        </div>
      </Link>
    </article>
  );
}
