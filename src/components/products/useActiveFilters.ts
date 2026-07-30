"use client";

import { useSearchParams } from "next/navigation";

export interface ActiveFilter {
  /** The query-string key this filter is stored under. */
  key: string;
  /** Human-readable description shown on the chip. */
  label: string;
}

/** Query-string keys that represent a user-applied filter. */
export const FILTER_KEYS = ["q", "category", "brand", "inStock"] as const;

/** Reads the currently applied filters from the URL, in display order. */
export function useActiveFilters(): ActiveFilter[] {
  const searchParams = useSearchParams();
  const filters: ActiveFilter[] = [];

  const query = searchParams.get("q");
  if (query) filters.push({ key: "q", label: `“${query}”` });

  const category = searchParams.get("category");
  if (category) filters.push({ key: "category", label: category });

  const brand = searchParams.get("brand");
  if (brand) filters.push({ key: "brand", label: brand });

  if (searchParams.get("inStock") === "1") {
    filters.push({ key: "inStock", label: "In stock only" });
  }

  return filters;
}
