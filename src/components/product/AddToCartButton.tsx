"use client";

import { useEffect, useRef, useState } from "react";
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
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cancel a pending "Added ✓" reset if the button unmounts first — navigating
  // away from a product page mid-timeout would otherwise leave it running.
  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  return (
    <Button
      type="button"
      size={size}
      className="enabled:cursor-pointer"
      disabled={!product.inStock}
      onClick={() => {
        addItem(product.id, quantity);
        setJustAdded(true);
        if (resetTimer.current) clearTimeout(resetTimer.current);
        resetTimer.current = setTimeout(() => setJustAdded(false), 1500);
      }}
    >
      {!product.inStock ? "Out of stock" : justAdded ? "Added ✓" : "Add to cart"}
    </Button>
  );
}
