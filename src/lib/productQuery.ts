import { CATEGORIES, type Category } from "@/types/product";
import type { SortOption } from "@/lib/products";

export const PRODUCT_QUERY = {
  search: "q",
  category: "category",
  brand: "brand",
  inStock: "inStock",
  sort: "sort",
} as const;

export const FILTER_QUERY_KEYS = [
  PRODUCT_QUERY.search,
  PRODUCT_QUERY.category,
  PRODUCT_QUERY.brand,
  PRODUCT_QUERY.inStock,
] as const;

type ProductQueryKey = (typeof PRODUCT_QUERY)[keyof typeof PRODUCT_QUERY];

export type ProductSearchParams = Partial<Record<ProductQueryKey, string>>;

const SORT_OPTIONS: readonly SortOption[] = [
  "featured",
  "price-asc",
  "price-desc",
  "rating-desc",
  "name-asc",
];

export function parseCategory(value: string | null | undefined): Category | "All" {
  return CATEGORIES.find((category) => category === value) ?? "All";
}

export function parseSort(value: string | null | undefined): SortOption {
  return SORT_OPTIONS.find((option) => option === value) ?? "featured";
}
