export type Category =
  | "Laptops"
  | "Audio"
  | "Wearables"
  | "Smartphones"
  | "Cameras"
  | "Accessories";

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
