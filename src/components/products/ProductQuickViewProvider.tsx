"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/types/product";
import ProductQuickViewDialog from "@/components/products/ProductQuickViewDialog";
import { QUICK_VIEW_DESKTOP_QUERY } from "@/components/products/quickViewConfig";

interface QuickViewContextValue {
  activeProductId: string | null;
  openQuickView: (product: Product, trigger: HTMLButtonElement) => void;
}

const QuickViewContext = createContext<QuickViewContextValue | null>(null);

export default function ProductQuickViewProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [product, setProduct] = useState<Product | null>(null);
  const returnFocusRef = useRef<HTMLButtonElement | null>(null);

  const closeQuickView = useCallback(() => setProduct(null), []);
  const openQuickView = useCallback(
    (nextProduct: Product, trigger: HTMLButtonElement) => {
      if (!window.matchMedia(QUICK_VIEW_DESKTOP_QUERY).matches) return;
      returnFocusRef.current = trigger;
      setProduct(nextProduct);
    },
    []
  );

  const contextValue = useMemo(
    () => ({ activeProductId: product?.id ?? null, openQuickView }),
    [openQuickView, product?.id]
  );

  return (
    <QuickViewContext.Provider value={contextValue}>
      {children}
      {product && (
        <ProductQuickViewDialog
          product={product}
          returnFocusRef={returnFocusRef}
          onClose={closeQuickView}
        />
      )}
    </QuickViewContext.Provider>
  );
}

export function useProductQuickView() {
  const context = useContext(QuickViewContext);
  if (!context) {
    throw new Error(
      "useProductQuickView must be used within ProductQuickViewProvider."
    );
  }
  return context;
}
