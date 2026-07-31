/**
 * The catalog's categories, in the order they appear in the filter sidebar.
 *
 * Declared as a const tuple so the `Category` union is derived from it rather
 * than written twice — adding a category here updates the type and the filter
 * list together, and catalog validation picks it up automatically.
 */
export const CATEGORIES = [
  "Laptops",
  "Audio",
  "Wearables",
  "Smartphones",
  "Cameras",
  "Accessories",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  brand: string;
  price: number;
  rating: number;
  image: string;
  shortDescription: string;
  description: string;
  specs: Record<string, string>;
  inStock: boolean;
  featured: boolean;
}
