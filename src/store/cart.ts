import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";

/**
 * What actually gets persisted: a product reference and a quantity, never a
 * copy of the product itself. Prices, names and images are re-resolved from
 * the catalog on read, so a cart saved before a catalog change can't display
 * stale details.
 */
export interface CartLine {
  productId: string;
  quantity: number;
}

/** A cart line joined against the catalog, ready to render. */
export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  keepOnly: (validProductIds: string[]) => void;
}

/** The only slice written to storage — actions are re-supplied on merge. */
interface PersistedCart {
  lines: CartLine[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readQuantity(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) && value > 0
    ? value
    : 1;
}

function readCurrentLines(persisted: unknown): CartLine[] {
  if (!isRecord(persisted) || !Array.isArray(persisted.lines)) {
    return [];
  }

  return persisted.lines.flatMap((entry) => {
    if (
      !isRecord(entry) ||
      typeof entry.productId !== "string" ||
      entry.productId.trim() === ""
    ) {
      return [];
    }
    return [{
      productId: entry.productId,
      quantity: readQuantity(entry.quantity),
    }];
  });
}

function readLegacyLines(persisted: unknown): CartLine[] {
  if (!isRecord(persisted) || !Array.isArray(persisted.items)) {
    return [];
  }

  return persisted.items.flatMap((entry) => {
    if (!isRecord(entry) || !isRecord(entry.product)) {
      return [];
    }
    const productId = entry.product.id;
    if (typeof productId !== "string" || productId.trim() === "") {
      return [];
    }
    return [{ productId, quantity: readQuantity(entry.quantity) }];
  });
}

export function migrateCart(persisted: unknown, version: number): PersistedCart {
  if (version === 0) {
    return { lines: readLegacyLines(persisted) };
  }

  return { lines: readCurrentLines(persisted) };
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      addItem: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === productId);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === productId
                  ? { ...l, quantity: l.quantity + quantity }
                  : l
              ),
            };
          }
          return { lines: [...state.lines, { productId, quantity }] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          lines: state.lines.filter((l) => l.productId !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          lines:
            quantity <= 0
              ? state.lines.filter((l) => l.productId !== productId)
              : state.lines.map((l) =>
                  l.productId === productId ? { ...l, quantity } : l
                ),
        })),
      clear: () => set({ lines: [] }),
      keepOnly: (validProductIds) =>
        set((state) => ({
          lines: state.lines.filter((l) => validProductIds.includes(l.productId)),
        })),
    }),
    {
      name: "cart-storage",
      version: 1,
      migrate: migrateCart,
      partialize: (state): PersistedCart => ({ lines: state.lines }),
    }
  )
);

/**
 * Joins persisted lines against the catalog. Lines whose product no longer
 * exists are dropped rather than rendered as a broken row.
 */
export function resolveCartLines(lines: CartLine[], catalog: Product[]): CartItem[] {
  const byId = new Map(catalog.map((p) => [p.id, p]));
  return lines.flatMap((line) => {
    const product = byId.get(line.productId);
    return product ? [{ product, quantity: line.quantity }] : [];
  });
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
}

export function cartItemCount(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.quantity, 0);
}
