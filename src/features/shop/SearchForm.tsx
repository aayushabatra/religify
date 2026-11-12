"use client";

import type { FormEvent } from "react";
import { useRouter } from "next/navigation";

type SearchFormProps = {
  initialQuery?: string;
};

export function SearchForm({ initialQuery = "" }: SearchFormProps) {
  const router = useRouter();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const q = String(form.get("q") ?? "").trim();
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2" role="search">
      <label htmlFor="search-q" className="sr-only">
        Search products
      </label>
      <input
        id="search-q"
        name="q"
        type="search"
        defaultValue={initialQuery}
        placeholder="Search products…"
        className="h-11 w-full max-w-md rounded-sm border border-gold/40 bg-white/70 px-3 text-sm text-charcoal placeholder:text-charcoal/45 focus:border-burgundy focus:outline-none focus:ring-2 focus:ring-burgundy/20"
      />
      <button
        type="submit"
        className="h-11 rounded-sm bg-burgundy px-4 text-sm text-ivory hover:bg-burgundy/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40"
      >
        Search
      </button>
    </form>
  );
}
