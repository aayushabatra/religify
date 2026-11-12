"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { Collection } from "@/lib/catalog";
import { Wordmark } from "./Wordmark";
import { MobileNav } from "./MobileNav";

type HeaderProps = {
  collections: Collection[];
  cartCount?: number;
};

const desktopLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/collections/ritual-kits", label: "Ritual Kits" },
  { href: "/collections/everyday-essentials", label: "Everyday Essentials" },
  { href: "/collections/sacred-living", label: "Sacred Living" },
  { href: "/about", label: "Our Story" },
];

export function Header({ collections, cartCount = 0 }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const q = String(form.get("q") ?? "").trim();
    setSearchOpen(false);
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gold/25 bg-ivory/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          className="rounded-sm p-2 text-charcoal hover:bg-charcoal/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={() => setMenuOpen(true)}
        >
          <span className="sr-only">Open collections menu</span>
          <HamburgerIcon />
        </button>

        <div className="min-w-0 flex-1 md:flex-none">
          <Wordmark />
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-6 md:flex" aria-label="Primary">
          {desktopLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs tracking-[0.12em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30 ${
                  active ? "text-burgundy" : "text-charcoal/75 hover:text-burgundy"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            className="rounded-sm p-2 text-charcoal hover:bg-charcoal/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40"
            aria-expanded={searchOpen}
            aria-controls="header-search"
            onClick={() => setSearchOpen((v) => !v)}
          >
            <span className="sr-only">Search</span>
            <SearchIcon />
          </button>

          <Link
            href="/cart"
            className="relative rounded-sm p-2 text-charcoal hover:bg-charcoal/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40"
            aria-label={cartCount ? `Cart, ${cartCount} items` : "Cart, empty"}
          >
            <CartIcon />
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] text-ivory">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {searchOpen ? (
        <div id="header-search" className="border-t border-gold/20 bg-ivory">
          <form
            onSubmit={onSearch}
            className="mx-auto flex max-w-6xl items-center gap-2 px-4 py-3 sm:px-6 lg:px-8"
            role="search"
          >
            <label htmlFor="header-q" className="sr-only">
              Search products
            </label>
            <input
              id="header-q"
              name="q"
              type="search"
              placeholder="Search essentials, kits, brass…"
              autoFocus
              className="h-11 w-full rounded-sm border border-gold/40 bg-white/60 px-3 text-sm text-charcoal placeholder:text-charcoal/45 focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20"
            />
            <button
              type="submit"
              className="h-11 shrink-0 rounded-sm bg-burgundy px-4 text-sm text-ivory hover:bg-burgundy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40"
            >
              Search
            </button>
          </form>
        </div>
      ) : null}

      <div id="mobile-nav">
        <MobileNav
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
          collections={collections}
        />
      </div>
    </header>
  );
}

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16.5 16.5L20 20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.5 8h11l-.8 9.2a1.5 1.5 0 0 1-1.5 1.3H8.8a1.5 1.5 0 0 1-1.5-1.3L6.5 8Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9 8V6.8A3 3 0 0 1 12 3.8v0a3 3 0 0 1 3 3V8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
