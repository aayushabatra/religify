import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SampleBadge } from "@/components/ui/SampleBadge";
import { formatInr } from "@/lib/currency";
import { getProductBySlug, SAMPLE_PRODUCTS } from "@/lib/catalog";
import { storeConfig } from "@/config/store";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return SAMPLE_PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.seoTitle,
    description: product.seoDescription,
  };
}

/** Phase A stub — full PDP gallery / ATC arrives in Phase B. */
export default async function ProductStubPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const image = product.images[0];

  return (
    <Container className="py-10 sm:py-14">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-burgundy/80">
        Product · Phase B coming soon
      </p>
      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe4d8]">
          {image ? (
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
              unoptimized={image.src.endsWith(".svg")}
            />
          ) : null}
          <SampleBadge className="absolute left-3 top-3" />
        </div>
        <div>
          <h1 className="font-display text-4xl text-charcoal sm:text-5xl">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-charcoal/65">{product.subtitle}</p>
          <p className="mt-6 text-lg text-charcoal">
            {formatInr(product.priceInPaise)}
            <span className="ml-2 text-xs uppercase tracking-wider text-charcoal/45">
              sample price
            </span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-charcoal/75">
            {product.shortDescription}
          </p>
          <p className="mt-4 text-xs leading-relaxed text-charcoal/55">
            {storeConfig.sampleDataNotice} Full product detail, variants, and add
            to cart ship in the next phase.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={`/collections/${product.collectionSlug}`} variant="outline">
              Back to collection
            </Button>
            <Button href="/cart" variant="secondary">
              Cart (stub)
            </Button>
          </div>
          <p className="mt-6 text-sm">
            <Link
              href="/shop"
              className="text-burgundy underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30"
            >
              Continue shopping
            </Link>
          </p>
        </div>
      </div>
    </Container>
  );
}
