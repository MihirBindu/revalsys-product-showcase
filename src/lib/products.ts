import productsData from "@/data/products.json";
import { CATEGORIES, type Category, type Product } from "@/types/product";

export { CATEGORIES };

/**
 * Narrows a raw category string to the `Category` union.
 *
 * The catalog is JSON, so nothing stops a typo reaching the app; without this
 * the product would simply vanish from its filter with no error anywhere.
 * Throwing here surfaces it at build time instead.
 */
function toCategory(value: string, slug: string): Category {
  const category = CATEGORIES.find((name) => name === value);
  if (!category) {
    throw new Error(
      `products.json: "${slug}" has unknown category "${value}". Expected one of: ${CATEGORIES.join(", ")}.`
    );
  }
  return category;
}

/**
 * Products declare different spec keys, so TypeScript widens the array into a
 * union whose members carry every other member's keys as `?: undefined`. That
 * no longer fits an index signature, so the absent keys are dropped rather than
 * asserted away with a cast.
 */
function toSpecs(raw: Record<string, string | undefined>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(raw).filter(
      (entry): entry is [string, string] => entry[1] !== undefined
    )
  );
}

const products: Product[] = productsData.map((entry) => ({
  ...entry,
  category: toCategory(entry.category, entry.slug),
  specs: toSpecs(entry.specs),
}));

export function getAllProducts(): Product[] {
  return products;
}

export function getFeaturedProducts(limit = 4): Product[] {
  return products.filter((p) => p.featured).slice(0, limit);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return products.map((p) => p.slug);
}

export function getBrands(): string[] {
  return Array.from(new Set(products.map((p) => p.brand))).sort();
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export type SortOption = "featured" | "price-asc" | "price-desc" | "rating-desc" | "name-asc";

export interface ProductFilters {
  query?: string;
  category?: Category | "All";
  brand?: string | "All";
  inStockOnly?: boolean;
  sort?: SortOption;
}

export function searchProducts(filters: ProductFilters): Product[] {
  const { query, category, brand, inStockOnly, sort = "featured" } = filters;

  let results = [...products];

  if (query && query.trim().length > 0) {
    const q = query.trim().toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.shortDescription.toLowerCase().includes(q)
    );
  }

  if (category && category !== "All") {
    results = results.filter((p) => p.category === category);
  }

  if (brand && brand !== "All") {
    results = results.filter((p) => p.brand === brand);
  }

  if (inStockOnly) {
    results = results.filter((p) => p.inStock);
  }

  switch (sort) {
    case "price-asc":
      results.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      results.sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      results.sort((a, b) => b.rating - a.rating);
      break;
    case "name-asc":
      results.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "featured":
    default:
      results.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
  }

  return results;
}
