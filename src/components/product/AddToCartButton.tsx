"use client";

import { useRef } from "react";
import { PENDING_ADD_DELAY_MS, useCartStore } from "@/store/cart";
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
  const schedulePendingAdd = useCartStore((s) => s.schedulePendingAdd);
  // Read from the store, not local state: the countdown outlives this button,
  // so remounting on a different page must still show "Adding…".
  const isPending = useCartStore((s) =>
    s.pending.some((p) => p.productId === product.id)
  );
  const { showToast } = useToast();
  const addLocked = useRef(false);

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

        schedulePendingAdd(product.id, quantity);
        // Read the deadline back from the store so the toast counts down to the
        // exact instant the timer will fire, not an approximation of it.
        const dueAt =
          useCartStore
            .getState()
            .pending.find((p) => p.productId === product.id)?.dueAt ??
          Date.now() + PENDING_ADD_DELAY_MS;

        const label = `${quantity > 1 ? `${quantity} × ` : ""}${product.name}`;
        showToast({
          message: `${label} will be added to your cart in 30 seconds.`,
          countdownTo: dueAt,
          // Outlive the countdown slightly, so the toast never disappears
          // before the product it is counting down actually lands.
          duration: PENDING_ADD_DELAY_MS + 500,
          actions: [
            {
              label: "Add now",
              onSelect: () =>
                useCartStore.getState().commitPendingAdd(product.id),
            },
            {
              label: "Cancel",
              onSelect: () =>
                useCartStore.getState().cancelPendingAdd(product.id),
            },
          ],
        });
        onAdded?.();
      }}
    >
      {!product.inStock ? "Out of stock" : isPending ? "Adding…" : "Add to cart"}
    </Button>
  );
}