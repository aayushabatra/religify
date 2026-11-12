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

export default function HomePage() {
  const collections = getCollections();
  const featuredKits = getFeaturedKits(4);
  const essentials = getEssentials(6);

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
