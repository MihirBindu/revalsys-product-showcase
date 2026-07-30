"use client";

import { useState } from "react";
import { cartTotal, useCartStore } from "@/store/cart";
import Button from "@/components/ui/Button";
import PriceTag from "@/components/product/PriceTag";

export default function CartSummary() {
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const [placed, setPlaced] = useState(false);
  const subtotal = cartTotal(items);

  if (placed) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="font-semibold text-emerald-800">Order placed (demo)</p>
        <p className="mt-1 text-sm text-emerald-700">
          This is a static demo &mdash; no real order or payment was processed.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-900">Order summary</h2>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Subtotal</span>
        <PriceTag price={subtotal} className="font-medium text-slate-900" />
      </div>
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>Shipping</span>
        <span>Free</span>
      </div>
      <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-900">
        <span>Total</span>
        <PriceTag price={subtotal} />
      </div>
      <Button
        type="button"
        disabled={items.length === 0}
        onClick={() => {
          setPlaced(true);
          clear();
        }}
      >
        Checkout (Demo)
      </Button>
    </div>
  );
}
