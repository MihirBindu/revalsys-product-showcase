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
  size?: "sm" | "md";
}

const controlClasses =
  "text-slate-600 hover:bg-slate-50 motion-safe:transition-colors disabled:cursor-not-allowed disabled:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500";

const sizeClasses = {
  sm: { button: "px-2.5 py-1", value: "w-8" },
  md: { button: "h-10 w-10", value: "w-10" },
} as const;

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  itemLabel,
  size = "sm",
}: QuantitySelectorProps) {
  const suffix = itemLabel ? ` of ${itemLabel}` : "";

  return (
    <div className="inline-flex items-center overflow-hidden rounded-lg border border-slate-300">
      <button
        type="button"
        aria-label={`Decrease quantity${suffix}`}
        disabled={value <= min}
        className={`${controlClasses} ${sizeClasses[size].button}`}
        onClick={() => onChange(value - 1)}
      >
        <span aria-hidden className="select-none">
          −
        </span>
      </button>
      {/* aria-live so the new value is announced after a button press, which
          would otherwise be a silent change for screen-reader users. */}
      <span
        aria-live="polite"
        className={`${sizeClasses[size].value} text-center text-sm tabular-nums`}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label={`Increase quantity${suffix}`}
        disabled={value >= max}
        className={`${controlClasses} ${sizeClasses[size].button}`}
        onClick={() => onChange(value + 1)}
      >
        <span aria-hidden className="select-none">
          +
        </span>
      </button>
    </div>
  );
}
