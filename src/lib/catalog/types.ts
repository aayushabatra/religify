export type CollectionSlug =
  | "everyday-essentials"
  | "ritual-kits"
  | "sacred-living"
  | "deity-shringar"
  | "festive-gifting";

export type ProductImage = {
  src: string;
  alt: string;
  /** True when imagery is a placeholder, not real product photography */
  isSamplePlaceholder: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  shortDescription: string;
  description: string;
  collectionSlug: CollectionSlug;
  images: ProductImage[];
  /** Integer paise. Sample values only — not production pricing. */
  priceInPaise: number;
  compareAtPriceInPaise?: number;
  sku: string;
  /** Sample stock only — not production inventory. */
  stockQuantity: number;
  isActive: boolean;
  isFeatured: boolean;
  isEssential: boolean;
  materialsOrIngredients?: string;
  packContents?: string[];
  usageNotes?: string;
  careAndSafety?: string;
  seoTitle: string;
  seoDescription: string;
  /** Marks catalogue row as development sample data */
  isSampleData: true;
};

export type Collection = {
  slug: CollectionSlug;
  name: string;
  description: string;
  image: ProductImage;
  navLabel: string;
};

export type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

export type CatalogListResult = {
  products: Product[];
  total: number;
  collection?: Collection;
  query?: string;
};
