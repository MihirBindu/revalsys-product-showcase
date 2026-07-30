"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types/product";
import Button from "@/components/ui/Button";

export default function AddToCartButton({
  product,
  quantity = 1,
  size = "md",
}: {
  product: Product;
  quantity?: number;
  size?: "sm" | "md" | "lg";
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [justAdded, setJustAdded] = useState(false);

  return (
    <Button
      type="button"
      size={size}
      disabled={!product.inStock}
      onClick={() => {
        addItem(product, quantity);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1500);
      }}
    >
      {!product.inStock ? "Out of stock" : justAdded ? "Added ✓" : "Add to cart"}
    </Button>
  );
}
