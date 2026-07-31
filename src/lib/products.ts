import productsData from "@/data/products.json";
import type { ProductFilters } from "@/lib/productQuery";
import { CATEGORIES, type Category, type Product } from "@/types/product";

export { CATEGORIES };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(
  record: Record<string, unknown>,
  field: string,
  context: string
): string {
  const value = record[field];
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${context}: "${field}" must be a non-empty string.`);
  }
  return value;
}

function readNumber(
  record: Record<string, unknown>,
  field: string,
  context: string,
  isValid: (value: number) => boolean,
  expectation: string
): number {
  const value = record[field];
  if (typeof value !== "number" || !Number.isFinite(value) || !isValid(value)) {
    throw new Error(`${context}: "${field}" must be ${expectation}.`);
  }
  return value;
}

function readBoolean(
  record: Record<string, unknown>,
  field: string,
  context: string
): boolean {
  const value = record[field];
  if (typeof value !== "boolean") {
    throw new Error(`${context}: "${field}" must be a boolean.`);
  }
  return value;
}

function toCategory(value: string, slug: string): Category {
  const category = CATEGORIES.find((name) => name === value);
  if (!category) {
    throw new Error(
      `products.json: "${slug}" has unknown category "${value}". Expected one of: ${CATEGORIES.join(", ")}.`
    );
  }
  return category;
}

function toSpecs(raw: unknown, context: string): Record<string, string> {
  if (!isRecord(raw)) {
    throw new Error(`${context}: "specs" must be an object.`);
  }

  const specs: Record<string, string> = {};
  for (const [name, value] of Object.entries(raw)) {
    if (name.trim() === "" || typeof value !== "string" || value.trim() === "") {
      throw new Error(
        `${context}: every specification needs a non-empty name and value.`
      );
    }
    specs[name] = value;
  }

  if (Object.keys(specs).length === 0) {
    throw new Error(`${context}: "specs" must contain at least one entry.`);
  }

  return specs;
}

function normalizeProduct(raw: unknown, index: number): Product {
  const rowContext = `products.json row ${index + 1}`;
  if (!isRecord(raw)) {
    throw new Error(`${rowContext}: product must be an object.`);
  }

  const id = readString(raw, "id", rowContext);
  const slug = readString(raw, "slug", rowContext);
  const context = `products.json product "${slug}"`;
  const image = readString(raw, "image", context);

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`${context}: "slug" must use lowercase kebab-case.`);
  }
  if (!image.startsWith("/images/products/")) {
    throw new Error(
      `${context}: "image" must reference the local /images/products/ directory.`
    );
  }

  return {
    id,
    slug,
    name: readString(raw, "name", context),
    category: toCategory(readString(raw, "category", context), slug),
    brand: readString(raw, "brand", context),
    price: readNumber(raw, "price", context, (value) => value > 0, "greater than zero"),
    rating: readNumber(
      raw,
      "rating",
      context,
      (value) => value >= 0 && value <= 5,
      "between zero and five"
    ),
    image,
    shortDescription: readString(raw, "shortDescription", context),
    description: readString(raw, "description", context),
    specs: toSpecs(raw.specs, context),
    inStock: readBoolean(raw, "inStock", context),
    featured: readBoolean(raw, "featured", context),
  };
}

/**
 * Validates the JSON boundary before any catalog value reaches page rendering.
 * Invalid rows fail during the build instead of producing partial UI.
 */
export function normalizeProducts(raw: unknown): Product[] {
  if (!Array.isArray(raw)) {
    throw new Error("products.json: catalog must be an array.");
  }

  const products = raw.map(normalizeProduct);
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const product of products) {
    if (ids.has(product.id)) {
      throw new Error(`products.json: duplicate id "${product.id}".`);
    }
    if (slugs.has(product.slug)) {
      throw new Error(`products.json: duplicate slug "${product.slug}".`);
    }
    ids.add(product.id);
    slugs.add(product.slug);
  }

  return products;
}

const products = normalizeProducts(productsData);

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
