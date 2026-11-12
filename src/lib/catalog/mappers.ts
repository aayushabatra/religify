import type { Collection, CollectionSlug, Product } from "./types";

type DbCollectionRow = {
  id: string;
  slug: string;
  name: string;
  navLabel: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  imageIsSamplePlaceholder: boolean;
};

type DbProductRow = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  collectionSlug: string;
  images: Array<{
    src: string;
    alt: string;
    isSamplePlaceholder: boolean;
  }>;
  priceInPaise: number;
  compareAtPriceInPaise: number | null;
  sku: string;
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  isEssential: boolean;
  materialsOrIngredients: string | null;
  packContents: string[] | null;
  usageNotes: string | null;
  careAndSafety: string | null;
  seoTitle: string;
  seoDescription: string;
  isSampleData: boolean;
};

export function mapDbCollection(row: DbCollectionRow): Collection {
  return {
    slug: row.slug as CollectionSlug,
    name: row.name,
    navLabel: row.navLabel,
    description: row.description,
    image: {
      src: row.imageSrc,
      alt: row.imageAlt,
      isSamplePlaceholder: row.imageIsSamplePlaceholder,
    },
  };
}

export function mapDbProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle,
    shortDescription: row.shortDescription,
    description: row.description,
    collectionSlug: row.collectionSlug as CollectionSlug,
    images: row.images,
    priceInPaise: row.priceInPaise,
    compareAtPriceInPaise: row.compareAtPriceInPaise ?? undefined,
    sku: row.sku,
    stockQuantity: row.stockQuantity,
    isActive: row.isActive,
    isFeatured: row.isFeatured,
    isEssential: row.isEssential,
    materialsOrIngredients: row.materialsOrIngredients ?? undefined,
    packContents: row.packContents ?? undefined,
    usageNotes: row.usageNotes ?? undefined,
    careAndSafety: row.careAndSafety ?? undefined,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    isSampleData: row.isSampleData,
  };
}
