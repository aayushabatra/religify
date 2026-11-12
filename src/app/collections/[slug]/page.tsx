import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import {
  PlpHeader,
  ProductGrid,
  SortSelect,
  TrackListView,
} from "@/features/shop";
import {
  getCollectionBySlug,
  getCollections,
  getProductsByCollection,
  parseSortParam,
} from "@/lib/catalog";
import { storeConfig } from "@/config/store";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
};

export async function generateStaticParams() {
  return getCollections().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: "Collection not found" };
  return {
    title: collection.name,
    description: collection.description,
  };
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { sort: sortParam } = await searchParams;
  const collection = getCollectionBySlug(slug);
  if (!collection) notFound();

  const sort = parseSortParam(sortParam);
  const { products, total } = getProductsByCollection(slug, sort);

  return (
    <Container className="py-10 sm:py-14">
      <TrackListView listName={collection.name} itemCount={total} />
      <PlpHeader
        title={collection.name}
        description={`${collection.description} ${storeConfig.sampleDataNotice}`}
        total={total}
      />
      <div className="mt-6 flex justify-end">
        <Suspense fallback={null}>
          <SortSelect value={sort} />
        </Suspense>
      </div>
      <div className="mt-8">
        <ProductGrid
          products={products}
          emptyMessage="No sample products in this collection yet."
        />
      </div>
    </Container>
  );
}
