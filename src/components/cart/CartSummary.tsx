"use client";

import { cartTotal, useCartStore } from "@/store/cart";
import Button from "@/components/ui/Button";
import PriceTag from "@/components/product/PriceTag";

export default function CartSummary({ onCheckout }: { onCheckout: () => void }) {
  const items = useCartStore((s) => s.items);
  const subtotal = cartTotal(items);

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
      <Button type="button" disabled={items.length === 0} onClick={onCheckout}>
        Checkout (Demo)
      </Button>
    </div>
  );
}
