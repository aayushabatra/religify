import { storeConfig } from "@/config/store";
import type { Product } from "@/lib/catalog";

type ProductDetailsProps = {
  product: Product;
};

export function ProductDetails({ product }: ProductDetailsProps) {
  return (
    <div className="mt-10 space-y-8 border-t border-gold/25 pt-8">
      <section>
        <h2 className="font-display text-2xl text-charcoal">About this product</h2>
        <p className="mt-3 text-sm leading-relaxed text-charcoal/75">
          {product.description}
        </p>
        <p className="mt-3 text-xs text-charcoal/50">{storeConfig.sampleDataNotice}</p>
      </section>

      {product.packContents && product.packContents.length > 0 ? (
        <section>
          <h2 className="font-display text-2xl text-charcoal">What&apos;s included</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-charcoal/75">
            {product.packContents.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-relaxed text-charcoal/55">
            Ritual requirements vary by family, region, and tradition. This kit is
            not labelled complete — confirm local customs or consult your pandit.
          </p>
        </section>
      ) : null}

      {product.materialsOrIngredients ? (
        <section>
          <h2 className="font-display text-xl text-charcoal">Materials / ingredients</h2>
          <p className="mt-2 text-sm text-charcoal/75">{product.materialsOrIngredients}</p>
        </section>
      ) : null}

      {product.usageNotes ? (
        <section>
          <h2 className="font-display text-xl text-charcoal">Usage notes</h2>
          <p className="mt-2 text-sm text-charcoal/75">{product.usageNotes}</p>
        </section>
      ) : null}

      {product.careAndSafety ? (
        <section>
          <h2 className="font-display text-xl text-charcoal">Care & safety</h2>
          <p className="mt-2 text-sm text-charcoal/75">{product.careAndSafety}</p>
        </section>
      ) : null}

      <section>
        <h2 className="font-display text-xl text-charcoal">Shipping & returns</h2>
        <p className="mt-2 text-sm text-charcoal/75">{storeConfig.shipping.summary}</p>
      </section>
    </div>
  );
}
