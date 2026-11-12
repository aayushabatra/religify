"use client";

import Image from "next/image";
import { useState } from "react";
import { SampleBadge } from "@/components/ui/SampleBadge";
import type { ProductImage } from "@/lib/catalog";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const safeImages =
    images.length > 0
      ? images
      : [
          {
            src: "/images/hero/atmosphere.svg",
            alt: `${productName} placeholder`,
            isSamplePlaceholder: true,
          },
        ];

  const [active, setActive] = useState(0);
  const current = safeImages[Math.min(active, safeImages.length - 1)];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe4d8]">
        <Image
          src={current.src}
          alt={current.alt}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
          unoptimized={current.src.endsWith(".svg")}
        />
        {current.isSamplePlaceholder ? (
          <SampleBadge className="absolute left-3 top-3" />
        ) : null}
      </div>

      {safeImages.length > 1 ? (
        <ul className="mt-3 flex gap-2" aria-label="Product images">
          {safeImages.map((image, index) => (
            <li key={`${image.src}-${index}`}>
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show image ${index + 1}`}
                aria-current={index === active ? "true" : undefined}
                className={`relative h-16 w-14 overflow-hidden rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40 ${
                  index === active
                    ? "border-burgundy"
                    : "border-gold/30 hover:border-burgundy/50"
                }`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                  unoptimized={image.src.endsWith(".svg")}
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
