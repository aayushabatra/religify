/**
 * Seed Cloud SQL / Postgres from the labelled sample catalogue.
 * Usage: DATABASE_URL=... npm run db:seed
 */
import "dotenv/config";
import { getDb, closeDb, isDatabaseConfigured } from "./client";
import { collections, products } from "./schema";
import { SAMPLE_COLLECTIONS, SAMPLE_PRODUCTS } from "@/lib/catalog/seed";

async function main() {
  if (!isDatabaseConfigured()) {
    console.error("DATABASE_URL is not set. Skipping seed.");
    process.exit(1);
  }

  const db = getDb();
  if (!db) {
    console.error("Could not connect to database.");
    process.exit(1);
  }

  console.info("Seeding collections…");
  for (const collection of SAMPLE_COLLECTIONS) {
    await db
      .insert(collections)
      .values({
        id: `col_${collection.slug}`,
        slug: collection.slug,
        name: collection.name,
        navLabel: collection.navLabel,
        description: collection.description,
        imageSrc: collection.image.src,
        imageAlt: collection.image.alt,
        imageIsSamplePlaceholder: collection.image.isSamplePlaceholder,
      })
      .onConflictDoUpdate({
        target: collections.id,
        set: {
          name: collection.name,
          navLabel: collection.navLabel,
          description: collection.description,
          imageSrc: collection.image.src,
          imageAlt: collection.image.alt,
          imageIsSamplePlaceholder: collection.image.isSamplePlaceholder,
        },
      });
  }

  console.info("Seeding sample products…");
  for (const product of SAMPLE_PRODUCTS) {
    await db
      .insert(products)
      .values({
        id: product.id,
        slug: product.slug,
        name: product.name,
        subtitle: product.subtitle,
        shortDescription: product.shortDescription,
        description: product.description,
        collectionSlug: product.collectionSlug,
        images: product.images,
        priceInPaise: product.priceInPaise,
        compareAtPriceInPaise: product.compareAtPriceInPaise ?? null,
        sku: product.sku,
        stockQuantity: product.stockQuantity,
        isActive: product.isActive,
        isFeatured: product.isFeatured,
        isEssential: product.isEssential,
        materialsOrIngredients: product.materialsOrIngredients ?? null,
        packContents: product.packContents ?? null,
        usageNotes: product.usageNotes ?? null,
        careAndSafety: product.careAndSafety ?? null,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        isSampleData: true,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: products.id,
        set: {
          slug: product.slug,
          name: product.name,
          subtitle: product.subtitle,
          shortDescription: product.shortDescription,
          description: product.description,
          collectionSlug: product.collectionSlug,
          images: product.images,
          priceInPaise: product.priceInPaise,
          compareAtPriceInPaise: product.compareAtPriceInPaise ?? null,
          sku: product.sku,
          stockQuantity: product.stockQuantity,
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          isEssential: product.isEssential,
          materialsOrIngredients: product.materialsOrIngredients ?? null,
          packContents: product.packContents ?? null,
          usageNotes: product.usageNotes ?? null,
          careAndSafety: product.careAndSafety ?? null,
          seoTitle: product.seoTitle,
          seoDescription: product.seoDescription,
          isSampleData: true,
          updatedAt: new Date(),
        },
      });
  }

  console.info(
    `Seeded ${SAMPLE_COLLECTIONS.length} collections and ${SAMPLE_PRODUCTS.length} sample products.`,
  );
  await closeDb();
}

main().catch(async (error) => {
  console.error(error);
  await closeDb();
  process.exit(1);
});
