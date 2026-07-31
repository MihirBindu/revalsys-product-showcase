"use client";

import { useState } from "react";
import type { Product } from "@/types/product";
import QuantitySelector from "@/components/ui/QuantitySelector";
import AddToCartButton from "@/components/product/AddToCartButton";

/**
 * Owns the quantity the detail page will add.
 *
 * `AddToCartButton` already accepted a `quantity` prop but nothing exposed it,
 * so the only way to buy three of something was to press the button three
 * times. The selector is hidden when the product is out of stock, where
 * choosing an amount would be meaningless.
 */
export default function AddToCartPanel({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);

  if (!product.inStock) {
    return <AddToCartButton product={product} size="lg" />;
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <QuantitySelector
        value={quantity}
        onChange={setQuantity}
        itemLabel={product.name}
      />
      <AddToCartButton product={product} quantity={quantity} size="lg" />
    </div>
  );
}
