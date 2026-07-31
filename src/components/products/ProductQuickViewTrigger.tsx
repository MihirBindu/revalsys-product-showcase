"use client";

import type { Product } from "@/types/product";
import { INDIGO_FOCUS_RING } from "@/lib/styles";
import { useProductQuickView } from "@/components/products/ProductQuickViewProvider";
import { QUICK_VIEW_DIALOG_ID } from "@/components/products/quickViewConfig";

export default function ProductQuickViewTrigger({
  product,
}: {
  product: Product;
}) {
  const { activeProductId, openQuickView } = useProductQuickView();

  return (
    <>
      <span
        aria-hidden
        data-quick-view-gradient
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] hidden h-24 bg-gradient-to-t from-slate-950/55 via-slate-950/15 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 motion-safe:transition-opacity motion-safe:duration-200 lg:block"
      />
      <button
        type="button"
        aria-label={`Quick view ${product.name}`}
        aria-haspopup="dialog"
        aria-expanded={activeProductId === product.id}
        aria-controls={QUICK_VIEW_DIALOG_ID}
        onClick={(event) => openQuickView(product, event.currentTarget)}
        className={`pointer-events-none absolute bottom-3 left-1/2 z-10 hidden h-10 -translate-x-1/2 translate-y-2 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-white/95 px-4 text-sm font-semibold text-slate-900 opacity-0 shadow-lg ring-1 ring-slate-200 hover:bg-white group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 focus-visible:pointer-events-auto focus-visible:translate-y-0 focus-visible:opacity-100 motion-safe:transition-[opacity,transform] motion-safe:duration-200 lg:inline-flex ${INDIGO_FOCUS_RING}`}
      >
        Quick view
      </button>
    </>
  );
}
