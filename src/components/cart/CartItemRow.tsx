"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "@/store/cart";
import { useCartStore } from "@/store/cart";
import PriceTag from "@/components/product/PriceTag";
import QuantitySelector from "@/components/ui/QuantitySelector";

export default function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const { product, quantity } = item;

  return (
    <li className="flex gap-4 py-4">
      <Link href={`/products/${product.slug}`} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="80px"
          className="object-cover"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${product.slug}`} className="text-sm font-semibold text-slate-900 hover:text-indigo-600">
            {product.name}
          </Link>
          <PriceTag price={product.price * quantity} className="text-sm font-semibold text-slate-900" />
        </div>
        <p className="text-xs text-slate-500">{product.brand}</p>

        <div className="mt-2 flex items-center gap-3">
          {/* min=0: stepping below one hands off to the store, which removes
              the line rather than keeping a zero-quantity row. */}
          <QuantitySelector
            value={quantity}
            min={0}
            itemLabel={product.name}
            onChange={(next) => updateQuantity(product.id, next)}
          />
          <button
            type="button"
            className="rounded text-xs font-medium text-rose-600 hover:text-rose-700 motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:ring-offset-2"
            onClick={() => removeItem(product.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
