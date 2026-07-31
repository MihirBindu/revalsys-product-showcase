import { describe, expect, it } from "vitest";
import {
  getAllProducts,
  normalizeProducts,
  searchProducts,
} from "../../src/lib/products";

const validProduct = {
  id: "test-1",
  slug: "test-product",
  name: "Test Product",
  category: "Accessories",
  brand: "Test Brand",
  price: 10,
  rating: 4.5,
  image: "/images/products/test-product.svg",
  shortDescription: "Short description.",
  description: "Full description.",
  specs: { Material: "Aluminum" },
  inStock: true,
  featured: false,
};

describe("catalog validation", () => {
  it("accepts a complete product", () => {
    expect(normalizeProducts([validProduct])).toEqual([validProduct]);
  });

  it("rejects invalid values and duplicate identifiers", () => {
    expect(() =>
      normalizeProducts([{ ...validProduct, rating: 6 }])
    ).toThrow(/rating/);
    expect(() =>
      normalizeProducts([validProduct, { ...validProduct, slug: "other-slug" }])
    ).toThrow(/duplicate id/);
    expect(() =>
      normalizeProducts([{ ...validProduct, specs: {} }])
    ).toThrow(/at least one entry/);
  });
});

describe("searchProducts", () => {
  it("returns the full catalog for empty filters", () => {
    expect(searchProducts({})).toHaveLength(getAllProducts().length);
  });

  it("searches names, brands, and descriptions case-insensitively", () => {
    expect(searchProducts({ query: "AEROBOOK" }).map((p) => p.slug)).toEqual([
      "aerobook-pro-14",
    ]);
    expect(searchProducts({ query: "sonicraft" })).toHaveLength(3);
    expect(searchProducts({ query: "noise cancellation" }).map((p) => p.slug))
      .toContain("wavepod-anc-earbuds");
  });

  it("combines category, brand, and stock filters", () => {
    const results = searchProducts({
      query: "watch",
      category: "Wearables",
      brand: "Pulseline",
      inStockOnly: true,
    });

    expect(results.map((p) => p.slug)).toEqual(["pulse-fit-watch-2"]);
  });

  it("sorts by price, rating, and name", () => {
    const byPrice = searchProducts({ sort: "price-asc" });
    const byRating = searchProducts({ sort: "rating-desc" });
    const byName = searchProducts({ sort: "name-asc" });

    expect(byPrice.map((p) => p.price)).toEqual(
      [...byPrice.map((p) => p.price)].sort((a, b) => a - b)
    );
    expect(byRating.map((p) => p.rating)).toEqual(
      [...byRating.map((p) => p.rating)].sort((a, b) => b - a)
    );
    expect(byName.map((p) => p.name)).toEqual(
      [...byName.map((p) => p.name)].sort((a, b) => a.localeCompare(b))
    );
  });
});
