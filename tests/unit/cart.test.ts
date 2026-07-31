import { beforeEach, describe, expect, it } from "vitest";
import {
  cartItemCount,
  cartTotal,
  migrateCart,
  resolveCartLines,
  useCartStore,
} from "../../src/store/cart";
import { getAllProducts } from "../../src/lib/products";

describe("cart helpers", () => {
  beforeEach(() => {
    useCartStore.setState({ lines: [] });
  });

  it("migrates legacy product snapshots to references", () => {
    expect(
      migrateCart(
        {
          items: [
            { product: { id: "p01" }, quantity: 2 },
            { product: {}, quantity: 3 },
          ],
        },
        0
      )
    ).toEqual({ lines: [{ productId: "p01", quantity: 2 }] });
  });

  it("sanitizes malformed persisted cart data", () => {
    expect(
      migrateCart(
        {
          lines: [
            { productId: "p01", quantity: -4 },
            { productId: 12, quantity: 2 },
            null,
          ],
        },
        1
      )
    ).toEqual({ lines: [{ productId: "p01", quantity: 1 }] });
    expect(migrateCart(null, 1)).toEqual({ lines: [] });
  });

  it("drops missing products and resolves current catalog prices", () => {
    const items = resolveCartLines(
      [
        { productId: "p01", quantity: 2 },
        { productId: "removed", quantity: 1 },
      ],
      getAllProducts()
    );

    expect(items).toHaveLength(1);
    expect(items[0].product.slug).toBe("aerobook-pro-14");
    expect(cartTotal(items)).toBe(2598);
  });

  it("adds quantities and removes a line at zero", () => {
    const store = useCartStore.getState();
    store.addItem("p01", 2);
    useCartStore.getState().addItem("p01", 1);

    expect(useCartStore.getState().lines).toEqual([
      { productId: "p01", quantity: 3 },
    ]);
    expect(cartItemCount(useCartStore.getState().lines)).toBe(3);

    useCartStore.getState().updateQuantity("p01", 0);
    expect(useCartStore.getState().lines).toEqual([]);
  });
});
