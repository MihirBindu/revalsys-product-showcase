"use client";

import { useState, type ReactNode } from "react";
import { useActiveFilters } from "@/components/products/useActiveFilters";
import { PRODUCT_QUERY } from "@/lib/productQuery";

/**
 * Keeps the filter controls collapsed on small screens.
 *
 * Stacked full-height, the sidebar pushes every product below roughly a
 * screen's worth of controls on a phone. Above `lg` the sidebar has its own
 * column, so it stays permanently visible and the toggle is hidden.
 */
export default function FilterPanel({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  // The search box lives outside this panel, so it shouldn't count here.
  const appliedCount = useActiveFilters().filter(
    (filter) => filter.key !== PRODUCT_QUERY.search
  ).length;

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-controls="filter-panel"
        className="flex items-center justify-between rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 lg:hidden"
      >
        <span>
          Filters
          {appliedCount > 0 && (
            <span className="ml-1.5 rounded-full bg-indigo-600 px-1.5 py-0.5 text-xs font-semibold text-white">
              {appliedCount}
            </span>
          )}
        </span>
        <span aria-hidden className="text-slate-400">
          {open ? "▲" : "▼"}
        </span>
      </button>

      <div id="filter-panel" className={`${open ? "block" : "hidden"} lg:block`}>
        {children}
      </div>
    </div>
  );
}
