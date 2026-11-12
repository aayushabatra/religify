import type { ReactNode } from "react";
import { getCartSummary } from "@/lib/cart";
import { getCollections } from "@/lib/catalog";
import { AnnouncementBar } from "./AnnouncementBar";
import { Footer } from "./Footer";
import { Header } from "./Header";

export async function SiteShell({ children }: { children: ReactNode }) {
  const collections = getCollections();
  const { itemCount } = await getCartSummary();

  return (
    <div className="flex min-h-dvh flex-col bg-ivory text-charcoal">
      <AnnouncementBar />
      <Header collections={collections} cartCount={itemCount} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
