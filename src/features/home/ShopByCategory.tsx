import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { Collection } from "@/lib/catalog";

type ShopByCategoryProps = {
  collections: Collection[];
};

export function ShopByCategory({ collections }: ShopByCategoryProps) {
  return (
    <section className="py-16 sm:py-20" aria-labelledby="shop-by-category">
      <Container>
        <div className="max-w-2xl">
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-burgundy/80">
            Browse
          </p>
          <h2
            id="shop-by-category"
            className="mt-3 font-display text-3xl text-charcoal sm:text-4xl"
          >
            Shop by category
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
            Find everyday essentials, ritual kits, and pieces for sacred spaces.
          </p>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, index) => (
            <li
              key={collection.slug}
              className={index === 0 ? "sm:col-span-2 lg:col-span-1" : undefined}
            >
              <Link
                href={`/collections/${collection.slug}`}
                className="group relative block aspect-[5/4] overflow-hidden rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
              >
                <Image
                  src={collection.image.src}
                  alt={collection.image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  unoptimized={collection.image.src.endsWith(".svg")}
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/15 to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-2xl text-ivory">
                    {collection.name}
                  </h3>
                  <p className="mt-1 text-xs text-ivory/70 transition-colors group-hover:text-ivory">
                    Explore collection
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
