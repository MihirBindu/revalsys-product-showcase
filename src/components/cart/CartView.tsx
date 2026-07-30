"use client";

import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { resolveCartLines, useCartStore } from "@/store/cart";
import { useHydrated } from "@/lib/useHydrated";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCartState from "@/components/cart/EmptyCartState";
import OrderPlaced from "@/components/cart/OrderPlaced";
import CartViewSkeleton from "@/components/cart/CartViewSkeleton";

export default function CartView({ catalog }: { catalog: Product[] }) {
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);
  const keepOnly = useCartStore((s) => s.keepOnly);
  const hydrated = useHydrated();

  // Held here rather than in CartSummary: checking out empties the cart, which
  // would unmount CartSummary and discard the flag before it could render.
  const [placed, setPlaced] = useState(false);

  const items = resolveCartLines(lines, catalog);
  const hasUnresolvedLines = items.length !== lines.length;

  // Discard saved lines whose product has left the catalog, so the header
  // badge can't report a count the cart itself won't show.
  useEffect(() => {
    if (!hydrated || !hasUnresolvedLines) return;
    keepOnly(catalog.map((p) => p.id));
  }, [hydrated, hasUnresolvedLines, catalog, keepOnly]);

  function handleCheckout() {
    clear();
    setPlaced(true);
  }

  if (placed) {
    return <OrderPlaced />;
  }

  // Until the persisted cart has rehydrated, render a placeholder instead of
  // the empty state, so a populated cart never flashes "empty" on load.
  if (!hydrated) {
    return <CartViewSkeleton />;
  }

  if (items.length === 0) {
    return <EmptyCartState />;
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
      <ul className="divide-y divide-slate-200 rounded-xl border border-slate-200 px-4">
        {items.map((item) => (
          <CartItemRow key={item.product.id} item={item} />
        ))}
      </ul>
      <CartSummary items={items} onCheckout={handleCheckout} />
    </div>
  );
}
