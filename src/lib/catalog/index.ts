import { eq } from "drizzle-orm";
import { getDb } from "@/db/client";
import { collections as collectionsTable, products as productsTable } from "@/db/schema";
import { SAMPLE_COLLECTIONS, SAMPLE_PRODUCTS } from "./seed";
import { mapDbCollection, mapDbProduct } from "./mappers";
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

function seedActiveProducts(): Product[] {
  return SAMPLE_PRODUCTS.filter((p) => p.isActive);
}

async function loadCollections(): Promise<Collection[]> {
  const db = getDb();
  if (!db) return SAMPLE_COLLECTIONS;

  try {
    const rows = await db.select().from(collectionsTable);
    if (rows.length === 0) return SAMPLE_COLLECTIONS;
    return rows.map(mapDbCollection);
  } catch (error) {
    console.warn("[catalog] DB collections failed; using seed fallback", error);
    return SAMPLE_COLLECTIONS;
  }
}

async function loadActiveProducts(): Promise<Product[]> {
  const db = getDb();
  if (!db) return seedActiveProducts();

  try {
    const rows = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.isActive, true));
    if (rows.length === 0) return seedActiveProducts();
    return rows.map(mapDbProduct);
  } catch (error) {
    console.warn("[catalog] DB products failed; using seed fallback", error);
    return seedActiveProducts();
  }
}

export async function getCollections(): Promise<Collection[]> {
  return loadCollections();
}

export async function getCollectionBySlug(
  slug: string,
): Promise<Collection | undefined> {
  const all = await loadCollections();
  return all.find((c) => c.slug === slug);
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const products = await loadActiveProducts();
  return products.find((p) => p.slug === slug);
}

export async function getProductById(
  id: string,
): Promise<Product | undefined> {
  const products = await loadActiveProducts();
  return products.find((p) => p.id === id);
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const active = await loadActiveProducts();
  const sameCollection = active.filter(
    (p) => p.collectionSlug === product.collectionSlug && p.id !== product.id,
  );
  if (sameCollection.length >= limit) return sameCollection.slice(0, limit);

  const extras = active.filter(
    (p) =>
      p.id !== product.id && !sameCollection.some((s) => s.id === p.id),
  );
  return [...sameCollection, ...extras].slice(0, limit);
}

export async function getFeaturedKits(limit = 4): Promise<Product[]> {
  const active = await loadActiveProducts();
  return active
    .filter((p) => p.isFeatured && p.collectionSlug === "ritual-kits")
    .slice(0, limit);
}

export async function getEssentials(limit = 6): Promise<Product[]> {
  const active = await loadActiveProducts();
  return active.filter((p) => p.isEssential).slice(0, limit);
}

export async function getAllProducts(
  sort: SortOption = "featured",
): Promise<CatalogListResult> {
  const products = sortProducts(await loadActiveProducts(), sort);
  return { products, total: products.length };
}

export async function getProductsByCollection(
  slug: CollectionSlug | string,
  sort: SortOption = "featured",
): Promise<CatalogListResult> {
  const [collection, active] = await Promise.all([
    getCollectionBySlug(slug),
    loadActiveProducts(),
  ]);
  const products = sortProducts(
    active.filter((p) => p.collectionSlug === slug),
    sort,
  );
  return { products, total: products.length, collection };
}

export async function searchProducts(
  query: string,
  sort: SortOption = "featured",
): Promise<CatalogListResult> {
  const q = query.trim().toLowerCase();
  const active = await loadActiveProducts();
  const filtered = !q
    ? active
    : active.filter((p) => {
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
