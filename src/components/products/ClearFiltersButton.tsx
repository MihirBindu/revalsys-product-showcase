"use client";

import { useFilterNavigation } from "@/components/products/FilterNavigationContext";
import { FILTER_QUERY_KEYS } from "@/lib/productQuery";
import { INDIGO_FOCUS_RING } from "@/lib/styles";

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
    updateParams((params) =>
      FILTER_QUERY_KEYS.forEach((key) => params.delete(key))
    );
  }

  return (
    <button
      type="button"
      onClick={clearAll}
      className={`rounded-lg text-sm font-medium text-indigo-600 hover:text-indigo-700 motion-safe:transition-colors ${INDIGO_FOCUS_RING} ${className}`}
    >
      {children}
    </button>
  );
}
