"use client";

import { useEffect, useRef, useState } from "react";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types/product";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastProvider";

interface AddToCartButtonProps {
  onAdded?: () => void;
  preventRapidRepeat?: boolean;
  product: Product;
  quantity?: number;
  size?: "sm" | "md" | "lg";
}

export default function AddToCartButton({
  onAdded,
  preventRapidRepeat = false,
  product,
  quantity = 1,
  size = "md",
}: AddToCartButtonProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { showToast } = useToast();
  const [justAdded, setJustAdded] = useState(false);
  const addLocked = useRef(false);
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
      data-add-to-cart-button
      className={`${size === "md" ? "h-10" : ""} enabled:cursor-pointer`}
      disabled={!product.inStock}
      onClick={() => {
        if (preventRapidRepeat && addLocked.current) return;
        if (preventRapidRepeat) addLocked.current = true;

        const existingLine = useCartStore
          .getState()
          .lines.find((line) => line.productId === product.id);
        const previousQuantity = existingLine?.quantity ?? 0;

        addItem(product.id, quantity);
        showToast({
          message: `${quantity > 1 ? `${quantity} × ` : ""}${product.name} added to your cart.`,
          duration: 6000,
          actions: [
            { label: "View cart", href: "/cart" },
            {
              label: "Undo",
              onSelect: () => {
                const store = useCartStore.getState();
                if (previousQuantity === 0) {
                  store.removeItem(product.id);
                } else {
                  store.updateQuantity(product.id, previousQuantity);
                }
              },
            },
          ],
        });
        setJustAdded(true);
        if (resetTimer.current) clearTimeout(resetTimer.current);
        resetTimer.current = setTimeout(() => setJustAdded(false), 1500);
        onAdded?.();
      }}
    >
      {!product.inStock ? "Out of stock" : justAdded ? "Added ✓" : "Add to cart"}
    </Button>
  );
}
