"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { useHydrated } from "@/lib/useHydrated";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCartState from "@/components/cart/EmptyCartState";
import OrderPlaced from "@/components/cart/OrderPlaced";

export default function CartView() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const hydrated = useHydrated();

  // Held here rather than in CartSummary: checking out empties the cart, which
  // would unmount CartSummary and discard the flag before it could render.
  const [placed, setPlaced] = useState(false);

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
    return (
      <div
        aria-hidden
        className="h-64 animate-pulse rounded-xl border border-slate-200 bg-slate-50"
      />
    );
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
      <CartSummary onCheckout={handleCheckout} />
    </div>
  );
}
