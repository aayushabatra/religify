import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { storeConfig } from "@/config/store";

/**
 * Brand-first, full-bleed hero — one composition.
 * No cards, badges, or secondary marketing chrome in the first viewport.
 */
export function Hero() {
  return (
    <section className="relative isolate min-h-[calc(100dvh-7.5rem)] overflow-hidden bg-[#2c1f22]">
      <Image
        src="/images/hero/atmosphere.svg"
        alt=""
        fill
        priority
        unoptimized
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#2c1f22]/82 via-[#2c1f22]/45 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex min-h-[calc(100dvh-7.5rem)] max-w-6xl flex-col justify-end px-4 pb-16 pt-24 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
        <div className="max-w-xl animate-rise">
          <p className="font-display text-5xl tracking-[0.18em] text-ivory sm:text-6xl md:text-7xl">
            {storeConfig.brand.name}
          </p>
          <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.28em] text-ivory/75 sm:text-xs">
            {storeConfig.brand.descriptor}
          </p>
          <h1 className="mt-8 font-display text-3xl leading-tight text-ivory sm:text-4xl md:text-[2.75rem]">
            {storeConfig.brand.tagline}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/80 sm:text-base">
            Thoughtfully curated essentials for everyday devotion.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="/collections/everyday-essentials" size="lg">
              Shop essentials
            </Button>
            <Button
              href="/collections/ritual-kits"
              variant="outline"
              size="lg"
              className="border-ivory/40 text-ivory hover:border-ivory hover:bg-ivory/10 hover:text-ivory focus-visible:ring-ivory/40 focus-visible:ring-offset-[#2c1f22]"
            >
              Explore ritual kits
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
