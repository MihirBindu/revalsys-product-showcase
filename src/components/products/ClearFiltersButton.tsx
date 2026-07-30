"use client";

import { useFilterNavigation } from "@/components/products/FilterNavigationContext";
import { FILTER_KEYS } from "@/components/products/useActiveFilters";

/**
 * Clears every filter while preserving unrelated params such as `sort`.
 */
export default function ClearFiltersButton({
  className = "",
  children = "Clear all",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  const { updateParams } = useFilterNavigation();

  function clearAll() {
    updateParams((params) => FILTER_KEYS.forEach((key) => params.delete(key)));
  }

  return (
    <button
      type="button"
      onClick={clearAll}
      className={`rounded-lg text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </button>
  );
}
