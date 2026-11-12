import { SAMPLE_COLLECTIONS, SAMPLE_PRODUCTS } from "./seed";
import type {
  CatalogListResult,
  Collection,
  CollectionSlug,
  Product,
  SortOption,
} from "./types";

export type {
  CatalogListResult,
  Collection,
  CollectionSlug,
  Product,
  ProductImage,
  SortOption,
} from "./types";

export { SAMPLE_COLLECTIONS, SAMPLE_PRODUCTS } from "./seed";

function activeProducts(): Product[] {
  return SAMPLE_PRODUCTS.filter((p) => p.isActive);
}

function sortProducts(products: Product[], sort: SortOption): Product[] {
  const next = [...products];
  switch (sort) {
    case "price-asc":
      return next.sort((a, b) => a.priceInPaise - b.priceInPaise);
    case "price-desc":
      return next.sort((a, b) => b.priceInPaise - a.priceInPaise);
    case "newest":
      return next.sort((a, b) => b.id.localeCompare(a.id));
    case "featured":
    default:
      return next.sort((a, b) => {
        if (a.isFeatured === b.isFeatured) return a.name.localeCompare(b.name);
        return a.isFeatured ? -1 : 1;
      });
  }
}

export function getCollections(): Collection[] {
  return SAMPLE_COLLECTIONS;
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return SAMPLE_COLLECTIONS.find((c) => c.slug === slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return activeProducts().find((p) => p.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return activeProducts().find((p) => p.id === id);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCollection = activeProducts().filter(
    (p) => p.collectionSlug === product.collectionSlug && p.id !== product.id,
  );
  if (sameCollection.length >= limit) return sameCollection.slice(0, limit);

  const extras = activeProducts().filter(
    (p) =>
      p.id !== product.id &&
      !sameCollection.some((s) => s.id === p.id),
  );
  return [...sameCollection, ...extras].slice(0, limit);
}

export function getFeaturedKits(limit = 4): Product[] {
  return activeProducts()
    .filter((p) => p.isFeatured && p.collectionSlug === "ritual-kits")
    .slice(0, limit);
}

export function getEssentials(limit = 6): Product[] {
  return activeProducts()
    .filter((p) => p.isEssential)
    .slice(0, limit);
}

export function getAllProducts(sort: SortOption = "featured"): CatalogListResult {
  const products = sortProducts(activeProducts(), sort);
  return { products, total: products.length };
}

export function getProductsByCollection(
  slug: CollectionSlug | string,
  sort: SortOption = "featured",
): CatalogListResult {
  const collection = getCollectionBySlug(slug);
  const products = sortProducts(
    activeProducts().filter((p) => p.collectionSlug === slug),
    sort,
  );
  return { products, total: products.length, collection };
}

export function searchProducts(
  query: string,
  sort: SortOption = "featured",
): CatalogListResult {
  const q = query.trim().toLowerCase();
  const filtered = !q
    ? activeProducts()
    : activeProducts().filter((p) => {
        const haystack = [
          p.name,
          p.subtitle,
          p.shortDescription,
          p.collectionSlug,
          p.sku,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      });

  return {
    products: sortProducts(filtered, sort),
    total: filtered.length,
    query: query.trim(),
  };
}

export function parseSortParam(value: string | undefined | null): SortOption {
  if (
    value === "price-asc" ||
    value === "price-desc" ||
    value === "newest" ||
    value === "featured"
  ) {
    return value;
  }
  return "featured";
}
