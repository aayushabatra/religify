import Link from "next/link";
import { storeConfig } from "@/config/store";
import { getCollections } from "@/lib/catalog";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "./Wordmark";

const policyLinks = [
  { href: "/policies/shipping", label: "Shipping" },
  { href: "/policies/returns", label: "Returns" },
  { href: "/policies/privacy", label: "Privacy" },
  { href: "/policies/terms", label: "Terms" },
  { href: "/faq", label: "FAQs" },
];

export async function Footer() {
  const collections = await getCollections();

  return (
    <footer className="mt-auto border-t border-gold/30 bg-forest text-ivory">
      <Container className="grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Wordmark href="/" tone="on-dark" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/75">
            Contemporary expression of {storeConfig.brand.legacyName}, rooted in
            Hisar, Haryana. {storeConfig.brand.tagline}
          </p>
        </div>

        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
            Shop
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            <li>
              <Link href="/shop" className="hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50">
                All products
              </Link>
            </li>
            {collections.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/collections/${c.slug}`}
                  className="hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                >
                  {c.navLabel}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
            About
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-ivory/80">
            <li>
              <Link href="/about" className="hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50">
                Our Story
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50">
                Contact
              </Link>
            </li>
            {policyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-ivory focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
            Visit & contact
          </h2>
          <address className="mt-4 space-y-2 text-sm not-italic text-ivory/80">
            <p>{storeConfig.location.addressLine}</p>
            <p>
              {storeConfig.location.city}, {storeConfig.location.state}
            </p>
            <p>{storeConfig.contact.phone}</p>
            <p>{storeConfig.contact.email}</p>
            <p>{storeConfig.contact.hours}</p>
          </address>
        </div>
      </Container>

      <div className="border-t border-ivory/15">
        <Container className="flex flex-col gap-2 py-4 text-xs text-ivory/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {storeConfig.brand.name}. Working brand name — not legal confirmation.</p>
          <p>{storeConfig.sampleDataNotice}</p>
        </Container>
      </div>
    </footer>
  );
}
