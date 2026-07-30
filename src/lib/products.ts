import productsData from "@/data/products.json";
import type { Category, Product } from "@/types/product";

const products = productsData as unknown as Product[];

export const CATEGORIES: Category[] = [
  "Laptops",
  "Audio",
  "Wearables",
  "Smartphones",
  "Cameras",
  "Accessories",
];

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
