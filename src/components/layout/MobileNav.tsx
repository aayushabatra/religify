"use client";

import Link from "next/link";
import { useEffect, useId, useRef } from "react";
import type { Collection } from "@/lib/catalog";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  collections: Collection[];
};

const secondaryLinks = [
  { href: "/shop", label: "Shop all" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
  { href: "/search", label: "Search" },
];

export function MobileNav({ open, onClose, collections }: MobileNavProps) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previous = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <button
        type="button"
        className="absolute inset-0 bg-charcoal/45"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-ivory shadow-xl animate-drawer-in">
        <div className="flex items-center justify-between border-b border-gold/30 px-4 py-4">
          <p id={titleId} className="font-display text-xl tracking-[0.16em] text-burgundy">
            Collections
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-sm p-2 text-charcoal hover:bg-charcoal/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40"
            aria-label="Close navigation"
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-4" aria-label="Mobile">
          <ul className="space-y-1">
            {collections.map((collection) => (
              <li key={collection.slug}>
                <Link
                  href={`/collections/${collection.slug}`}
                  onClick={onClose}
                  className="block rounded-sm px-3 py-3 text-sm tracking-wide text-charcoal hover:bg-burgundy/5 hover:text-burgundy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30"
                >
                  {collection.navLabel}
                </Link>
              </li>
            ))}
          </ul>

          <div className="my-4 border-t border-gold/25" />

          <ul className="space-y-1">
            {secondaryLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onClose}
                  className="block rounded-sm px-3 py-3 text-sm text-charcoal/80 hover:bg-charcoal/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
