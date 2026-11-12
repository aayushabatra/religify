import {
  Essentials,
  FeaturedKits,
  Hero,
  ShopByCategory,
  StoryStrip,
  TrackPageView,
  TrustStrip,
} from "@/features/home";
import {
  getCollections,
  getEssentials,
  getFeaturedKits,
} from "@/lib/catalog";
import { storeConfig } from "@/config/store";

export default async function HomePage() {
  const [collections, featuredKits, essentials] = await Promise.all([
    getCollections(),
    getFeaturedKits(4),
    getEssentials(6),
  ]);

  return (
    <>
      <TrackPageView page={`${storeConfig.brand.name} Home`} />
      <Hero />
      <ShopByCategory collections={collections} />
      <FeaturedKits products={featuredKits} />
      <Essentials products={essentials} />
      <StoryStrip />
      <TrustStrip />
    </>
  );
}
