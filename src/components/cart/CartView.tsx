"use client";

import { useCartStore } from "@/store/cart";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import EmptyCartState from "@/components/cart/EmptyCartState";

export default function CartView() {
  const items = useCartStore((s) => s.items);

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
      <CartSummary />
    </div>
  );
}
