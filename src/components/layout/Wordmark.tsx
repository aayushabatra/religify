import Link from "next/link";

type WordmarkProps = {
  href?: string;
  className?: string;
  /** Larger treatment for brand-forward moments */
  size?: "nav" | "hero";
  tone?: "default" | "on-dark";
};

export function Wordmark({
  href = "/",
  className = "",
  size = "nav",
  tone = "default",
}: WordmarkProps) {
  const titleClass =
    size === "hero"
      ? "font-display text-5xl tracking-[0.18em] sm:text-6xl md:text-7xl"
      : "font-display text-2xl tracking-[0.2em] sm:text-[1.65rem]";

  const titleColor = tone === "on-dark" ? "text-ivory" : "text-burgundy";
  const descriptorColor =
    tone === "on-dark" ? "text-ivory/70" : "text-charcoal/65";

  const content = (
    <span className={`inline-flex flex-col items-start ${className}`}>
      <span className={`${titleClass} ${titleColor}`}>NARAYAN</span>
      <span
        className={
          size === "hero"
            ? `mt-2 text-[11px] font-medium uppercase tracking-[0.28em] sm:text-xs ${descriptorColor}`
            : `mt-0.5 text-[9px] font-medium uppercase tracking-[0.28em] ${descriptorColor}`
        }
      >
        Rituals & Living
      </span>
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ivory"
      aria-label="NARAYAN Rituals & Living — home"
    >
      {content}
    </Link>
  );
}
