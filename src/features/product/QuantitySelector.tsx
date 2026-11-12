"use client";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  id?: string;
};

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 20,
  disabled = false,
  id = "quantity",
}: QuantitySelectorProps) {
  function clamp(next: number) {
    return Math.max(min, Math.min(max, next));
  }

  return (
    <div className="flex items-center gap-3">
      <label htmlFor={id} className="text-xs uppercase tracking-[0.14em] text-charcoal/55">
        Qty
      </label>
      <div className="inline-flex items-center rounded-sm border border-gold/40 bg-white/70">
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={disabled || value <= min}
          onClick={() => onChange(clamp(value - 1))}
          className="h-10 w-10 text-lg text-charcoal hover:bg-charcoal/5 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30"
        >
          −
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(clamp(Number(e.target.value) || min))}
          className="h-10 w-12 border-x border-gold/30 bg-transparent text-center text-sm text-charcoal focus:outline-none"
        />
        <button
          type="button"
          aria-label="Increase quantity"
          disabled={disabled || value >= max}
          onClick={() => onChange(clamp(value + 1))}
          className="h-10 w-10 text-lg text-charcoal hover:bg-charcoal/5 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/30"
        >
          +
        </button>
      </div>
    </div>
  );
}
