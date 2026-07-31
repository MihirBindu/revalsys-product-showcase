import { CATEGORIES, type Category } from "@/types/product";

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

export const SORT_OPTIONS = [
  "featured",
  "price-asc",
  "price-desc",
  "rating-desc",
  "name-asc",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

export interface ProductFilters {
  query?: string;
  category?: Category | "All";
  brand?: string | "All";
  inStockOnly?: boolean;
  sort?: SortOption;
}

export function parseCategory(value: string | null | undefined): Category | "All" {
  return CATEGORIES.find((category) => category === value) ?? "All";
}

export function parseSort(value: string | null | undefined): SortOption {
  return SORT_OPTIONS.find((option) => option === value) ?? "featured";
}

/** Converts URL state into the single filter shape consumed by the catalog. */
export function parseProductFilters(
  params: ProductSearchParams
): ProductFilters {
  return {
    query: params[PRODUCT_QUERY.search],
    category: parseCategory(params[PRODUCT_QUERY.category]),
    brand: params[PRODUCT_QUERY.brand] ?? "All",
    inStockOnly: params[PRODUCT_QUERY.inStock] === "1",
    sort: parseSort(params[PRODUCT_QUERY.sort]),
  };
}
