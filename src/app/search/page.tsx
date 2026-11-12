import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import {
  PlpHeader,
  ProductGrid,
  SearchForm,
  SortSelect,
  TrackListView,
} from "@/features/shop";
import { parseSortParam, searchProducts } from "@/lib/catalog";
import { storeConfig } from "@/config/store";

type PageProps = {
  searchParams: Promise<{ q?: string; sort?: string }>;
};

export const metadata: Metadata = {
  title: "Search",
  description: "Search NARAYAN sample products.",
};

export default async function SearchPage({ searchParams }: PageProps) {
  const { q = "", sort: sortParam } = await searchParams;
  const sort = parseSortParam(sortParam);
  const { products, total, query } = searchProducts(q, sort);
  const title = query ? `Results for “${query}”` : "Search";

  return (
    <Container className="py-10 sm:py-14">
      <TrackListView
        listName={query ? `Search: ${query}` : "Search"}
        itemCount={total}
        query={query ?? ""}
      />
      <PlpHeader
        eyebrow="Search"
        title={title}
        description={storeConfig.sampleDataNotice}
        total={total}
      />
      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Suspense fallback={null}>
          <SearchForm initialQuery={q} />
        </Suspense>
        <Suspense fallback={null}>
          <SortSelect value={sort} />
        </Suspense>
      </div>
      <div className="mt-8">
        <ProductGrid
          products={products}
          emptyMessage={
            query
              ? `No sample products matched “${query}”. Try camphor, kit, or brass.`
              : "Enter a search term to find sample products."
          }
        />
      </div>
    </Container>
  );
}
