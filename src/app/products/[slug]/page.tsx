import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { storeConfig } from "@/config/store";
import {
  AddToCartForm,
  ProductDetails,
  ProductGallery,
  RelatedProducts,
  TrackViewItem,
} from "@/features/product";
import { formatInr } from "@/lib/currency";
import {
  getCollectionBySlug,
  getProductBySlug,
  getRelatedProducts,
  SAMPLE_PRODUCTS,
  type ProductImage,
} from "@/lib/catalog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return SAMPLE_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.seoTitle,
    description: product.seoDescription,
  };
}

function galleryForProduct(
  productImages: ProductImage[],
  collectionImage?: ProductImage,
  productName?: string,
): ProductImage[] {
  const images = [...productImages];
  if (
    collectionImage &&
    !images.some((img) => img.src === collectionImage.src)
  ) {
    images.push({
      ...collectionImage,
      alt: `${productName ?? "Product"} — sample context imagery`,
      isSamplePlaceholder: true,
    });
  }
  return images;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [collection, related] = await Promise.all([
    getCollectionBySlug(product.collectionSlug),
    getRelatedProducts(product, 4),
  ]);
  const gallery = galleryForProduct(
    product.images,
    collection?.image,
    product.name,
  );

  return (
    <Container className="py-10 sm:py-14">
      <TrackViewItem product={product} />

      <nav aria-label="Breadcrumb" className="text-xs text-charcoal/55">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/shop" className="hover:text-burgundy">
              Shop
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          {collection ? (
            <>
              <li>
                <Link
                  href={`/collections/${collection.slug}`}
                  className="hover:text-burgundy"
                >
                  {collection.name}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
            </>
          ) : null}
          <li className="text-charcoal/80">{product.name}</li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <ProductGallery images={gallery} productName={product.name} />

        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-burgundy/80">
            {collection?.name ?? "Product"}
            {product.isSampleData ? " · Sample" : ""}
          </p>
          <h1 className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-charcoal/65">{product.subtitle}</p>

          <p className="mt-6 text-2xl text-charcoal">
            {formatInr(product.priceInPaise)}
            <span className="ml-2 text-xs uppercase tracking-wider text-charcoal/45">
              sample price
            </span>
          </p>
          {product.compareAtPriceInPaise ? (
            <p className="mt-1 text-sm text-charcoal/45 line-through">
              {formatInr(product.compareAtPriceInPaise)}
            </p>
          ) : null}

          <p className="mt-4 text-sm leading-relaxed text-charcoal/75">
            {product.shortDescription}
          </p>
          <p className="mt-2 text-xs text-charcoal/50">
            Availability: sample stock {product.stockQuantity} · SKU {product.sku}
          </p>

          <div className="mt-8">
            <AddToCartForm product={product} />
          </div>

          <ProductDetails product={product} />
        </div>
      </div>

      <RelatedProducts products={related} />

      <p className="mt-10 text-center text-xs text-charcoal/45">
        {storeConfig.sampleDataNotice}
      </p>
    </Container>
  );
}
