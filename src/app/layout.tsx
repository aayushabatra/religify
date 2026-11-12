import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
import { storeConfig } from "@/config/store";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${storeConfig.brand.name} — ${storeConfig.brand.descriptor}`,
    template: `%s · ${storeConfig.brand.name}`,
  },
  description: `${storeConfig.brand.tagline} Thoughtfully curated essentials for everyday rituals from Hisar, Haryana.`,
  metadataBase: new URL("https://example.com"),
  openGraph: {
    title: `${storeConfig.brand.name} — ${storeConfig.brand.descriptor}`,
    description: storeConfig.brand.tagline,
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${manrope.variable} antialiased`}>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
