type PlpHeaderProps = {
  title: string;
  description?: string;
  total: number;
  eyebrow?: string;
};

export function PlpHeader({
  title,
  description,
  total,
  eyebrow = "Collection",
}: PlpHeaderProps) {
  return (
    <header className="border-b border-gold/25 pb-8">
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-burgundy/80">
        {eyebrow}
      </p>
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-4xl text-charcoal sm:text-5xl">{title}</h1>
          {description ? (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal/70">
              {description}
            </p>
          ) : null}
        </div>
        <p className="shrink-0 text-sm text-charcoal/55">
          {total} {total === 1 ? "product" : "products"}
        </p>
      </div>
    </header>
  );
}
