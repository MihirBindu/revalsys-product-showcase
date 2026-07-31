import { describe, expect, it } from "vitest";
import { formatPrice } from "../../src/components/product/PriceTag";

describe("formatPrice", () => {
  it("formats prices in INR without decimals", () => {
    expect(formatPrice(119999)).toBe("₹1,19,999");
  });
});
