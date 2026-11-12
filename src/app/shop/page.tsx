import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import {
  PlpHeader,
  ProductGrid,
  SortSelect,
  TrackListView,
} from "@/features/shop";
import { getAllProducts, parseSortParam } from "@/lib/catalog";
import { storeConfig } from "@/config/store";

type PageProps = {
  searchParams: Promise<{ sort?: string }>;
};

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse all NARAYAN sample products.",
};

export default async function ShopPage({ searchParams }: PageProps) {
  const { sort: sortParam } = await searchParams;
  const sort = parseSortParam(sortParam);
  const { products, total } = getAllProducts(sort);

  return (
    <Container className="py-10 sm:py-14">
      <TrackListView listName="Shop all" itemCount={total} />
      <PlpHeader
        eyebrow="Shop"
        title="All products"
        description={`Full sample catalogue for storefront development. ${storeConfig.sampleDataNotice}`}
        total={total}
      />
      <div className="mt-6 flex justify-end">
        <Suspense fallback={null}>
          <SortSelect value={sort} />
        </Suspense>
      </div>
      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </Container>
  );
}
