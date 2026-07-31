"use client";

interface QuantitySelectorProps {
  value: number;
  onChange: (next: number) => void;
  /**
   * Lowest value the decrement button may produce. The cart passes 0 because
   * stepping below one removes the line; the product page passes 1 because
   * there is nothing to remove yet.
   */
  min?: number;
  max?: number;
  /** Appended to the button labels, e.g. "of AeroBook Pro 14". */
  itemLabel?: string;
}

const controlClasses =
  "px-2.5 py-1 text-slate-600 hover:bg-slate-50 motion-safe:transition-colors disabled:cursor-not-allowed disabled:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500";

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  itemLabel,
}: QuantitySelectorProps) {
  const suffix = itemLabel ? ` of ${itemLabel}` : "";

  return (
    <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-300">
      <button
        type="button"
        aria-label={`Decrease quantity${suffix}`}
        disabled={value <= min}
        className={controlClasses}
        onClick={() => onChange(value - 1)}
      >
        <span aria-hidden className="select-none">
          −
        </span>
      </button>
      {/* aria-live so the new value is announced after a button press, which
          would otherwise be a silent change for screen-reader users. */}
      <span aria-live="polite" className="w-8 text-center text-sm tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Increase quantity${suffix}`}
        disabled={value >= max}
        className={controlClasses}
        onClick={() => onChange(value + 1)}
      >
        <span aria-hidden className="select-none">
          +
        </span>
      </button>
    </div>
  );
}
