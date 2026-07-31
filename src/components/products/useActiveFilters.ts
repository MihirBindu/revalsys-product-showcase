"use client";

import { useSearchParams } from "next/navigation";
import {
  FILTER_QUERY_KEYS,
  PRODUCT_QUERY,
  parseCategory,
} from "@/lib/productQuery";

export interface ActiveFilter {
  key: (typeof FILTER_QUERY_KEYS)[number];
  label: string;
}

export function useActiveFilters(): ActiveFilter[] {
  const searchParams = useSearchParams();
  const filters: ActiveFilter[] = [];

  const query = searchParams.get(PRODUCT_QUERY.search);
  if (query) {
    filters.push({ key: PRODUCT_QUERY.search, label: `“${query}”` });
  }

  const category = searchParams.get(PRODUCT_QUERY.category);
  if (category && parseCategory(category) !== "All") {
    filters.push({ key: PRODUCT_QUERY.category, label: category });
  }

  const brand = searchParams.get(PRODUCT_QUERY.brand);
  if (brand) filters.push({ key: PRODUCT_QUERY.brand, label: brand });

  if (searchParams.get(PRODUCT_QUERY.inStock) === "1") {
    filters.push({
      key: PRODUCT_QUERY.inStock,
      label: "In stock only",
    });
  }

  return filters;
}
