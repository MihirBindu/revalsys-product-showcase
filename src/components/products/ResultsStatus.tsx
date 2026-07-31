"use client";

import { useFilterNavigation } from "@/components/products/FilterNavigationContext";

/**
 * Result count, doubling as the page's live region. Filtering swaps the grid
 * silently, so without this a screen-reader user gets no signal that anything
 * changed.
 */
export default function ResultsStatus({ count }: { count: number }) {
  const { isPending } = useFilterNavigation();

  return (
    <p
      role="status"
      aria-live="polite"
      className="mt-1 flex items-center gap-2 text-slate-600"
    >
      <span>
        {count} product{count === 1 ? "" : "s"} available
      </span>
      {isPending && (
        <span
          aria-hidden
          className="h-3.5 w-3.5 rounded-full border-2 border-slate-300 border-t-indigo-600 motion-safe:animate-spin"
        />
      )}
      <span className="sr-only">{isPending ? "Updating results" : ""}</span>
    </p>
  );
}
