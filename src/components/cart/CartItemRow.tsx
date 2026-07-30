"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartItem } from "@/store/cart";
import { useCartStore } from "@/store/cart";
import PriceTag from "@/components/product/PriceTag";

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
          <div className="flex items-center rounded-lg border border-slate-300">
            <button
              type="button"
              aria-label={`Decrease quantity of ${product.name}`}
              className="px-2.5 py-1 text-slate-600 hover:bg-slate-50"
              onClick={() => updateQuantity(product.id, quantity - 1)}
            >
              −
            </button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <button
              type="button"
              aria-label={`Increase quantity of ${product.name}`}
              className="px-2.5 py-1 text-slate-600 hover:bg-slate-50"
              onClick={() => updateQuantity(product.id, quantity + 1)}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="text-xs font-medium text-rose-600 hover:text-rose-700"
            onClick={() => removeItem(product.id)}
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
