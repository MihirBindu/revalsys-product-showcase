"use client";

import { useFilterNavigation } from "@/components/products/FilterNavigationContext";
import { useActiveFilters } from "@/components/products/useActiveFilters";
import ClearFiltersButton from "@/components/products/ClearFiltersButton";

/**
 * Shows what's currently applied and lets each filter be removed individually.
 * Without this the only way to tell which filters are active is to scan the
 * sidebar, and there's no way to undo them in one step.
 */
export default function ActiveFilters() {
  const { updateParams } = useFilterNavigation();
  const filters = useActiveFilters();

  if (filters.length === 0) return null;

  function removeFilter(key: string) {
    updateParams((params) => params.delete(key));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-slate-500">Filters:</span>
      <ul className="flex flex-wrap items-center gap-2">
        {filters.map((filter) => (
          <li key={filter.key}>
            <button
              type="button"
              onClick={() => removeFilter(filter.key)}
              aria-label={`Remove filter ${filter.label}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 py-1 pl-3 pr-2 text-xs font-medium text-slate-700 hover:bg-slate-200 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
            >
              {filter.label}
              <span aria-hidden className="select-none text-slate-500">
                ×
              </span>
            </button>
          </li>
        ))}
      </ul>
      {filters.length > 1 && <ClearFiltersButton className="text-xs" />}
    </div>
  );
}
