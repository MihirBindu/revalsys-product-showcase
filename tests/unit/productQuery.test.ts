import { describe, expect, it } from "vitest";
import {
  parseCategory,
  parseProductFilters,
  parseSort,
} from "../../src/lib/productQuery";

describe("product query parsing", () => {
  it("accepts known values", () => {
    expect(parseCategory("Cameras")).toBe("Cameras");
    expect(parseSort("price-desc")).toBe("price-desc");
  });

  it("falls back safely for missing or malformed values", () => {
    expect(parseCategory("NotReal")).toBe("All");
    expect(parseCategory(undefined)).toBe("All");
    expect(parseSort("also-bad")).toBe("featured");
    expect(parseSort(null)).toBe("featured");
  });

  it("maps URL parameters into the complete catalog filter contract", () => {
    expect(
      parseProductFilters({
        q: "camera",
        category: "Cameras",
        brand: "FocusLab",
        inStock: "1",
        sort: "rating-desc",
      })
    ).toEqual({
      query: "camera",
      category: "Cameras",
      brand: "FocusLab",
      inStockOnly: true,
      sort: "rating-desc",
    });
  });
});
