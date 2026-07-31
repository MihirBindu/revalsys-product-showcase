"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";
import type { Product } from "@/types/product";
import { INDIGO_FOCUS_RING } from "@/lib/styles";
import AddToCartButton from "@/components/product/AddToCartButton";
import PriceTag from "@/components/product/PriceTag";
import Badge from "@/components/ui/Badge";
import QuantitySelector from "@/components/ui/QuantitySelector";
import {
  QUICK_VIEW_DESKTOP_QUERY,
  QUICK_VIEW_DIALOG_ID,
} from "@/components/products/quickViewConfig";

interface ProductQuickViewDialogProps {
  onClose: () => void;
  product: Product;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}

const TITLE_ID = `${QUICK_VIEW_DIALOG_ID}-title`;
const DESCRIPTION_ID = `${QUICK_VIEW_DIALOG_ID}-description`;
const SPECIFICATIONS_ID = `${QUICK_VIEW_DIALOG_ID}-specifications`;

export default function ProductQuickViewDialog({
  onClose,
  product,
  returnFocusRef,
}: ProductQuickViewDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const specifications = Object.entries(product.specs).slice(0, 3);

  const closeDialog = useCallback(() => onClose(), [onClose]);

  function trapFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;

    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    const returnFocus = returnFocusRef.current;
    if (!dialog) return;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      const currentPadding =
        Number.parseFloat(getComputedStyle(document.body).paddingRight) || 0;
      document.body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";

    if (!dialog.open) dialog.showModal();
    closeButtonRef.current?.focus();

    const desktopViewport = window.matchMedia(QUICK_VIEW_DESKTOP_QUERY);
    function closeBelowDesktop(event: MediaQueryListEvent) {
      if (!event.matches) closeDialog();
    }
    desktopViewport.addEventListener("change", closeBelowDesktop);

    return () => {
      desktopViewport.removeEventListener("change", closeBelowDesktop);
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      if (returnFocus?.isConnected) returnFocus.focus();
    };
  }, [closeDialog, returnFocusRef]);

  return (
    <dialog
      ref={dialogRef}
      id={QUICK_VIEW_DIALOG_ID}
      role="dialog"
      aria-modal="true"
      aria-labelledby={TITLE_ID}
      aria-describedby={DESCRIPTION_ID}
      data-quick-view-dialog
      onKeyDown={trapFocus}
      onCancel={(event) => {
        event.preventDefault();
        closeDialog();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) closeDialog();
      }}
      className="m-auto h-[min(36rem,calc(100dvh_-_3rem))] w-[calc(100%_-_3rem)] max-w-4xl overflow-hidden rounded-2xl border-0 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm"
    >
      <button
        ref={closeButtonRef}
        type="button"
        aria-label={`Close quick view for ${product.name}`}
        onClick={closeDialog}
        className={`absolute right-4 top-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/95 text-xl text-slate-600 shadow ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900 ${INDIGO_FOCUS_RING}`}
      >
        <span aria-hidden>×</span>
      </button>

      <div className="grid h-full grid-cols-[minmax(0,45fr)_minmax(0,55fr)]">
        <div
          data-quick-view-image
          className="relative min-h-0 overflow-hidden bg-slate-100"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 40vw, 0px"
            className="object-cover"
          />
        </div>

        <div
          data-quick-view-details
          className="min-h-0 min-w-0 overflow-y-auto overscroll-contain p-8"
        >
          <div className="flex min-h-full flex-col">
            <div className="min-w-0 pr-12">
              <p className="text-sm font-medium text-indigo-600">
                {product.brand}
              </p>
              <h2
                id={TITLE_ID}
                className="mt-1 break-words text-2xl font-bold"
              >
                {product.name}
              </h2>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge tone={product.inStock ? "success" : "danger"}>
                {product.inStock ? "In stock" : "Out of stock"}
              </Badge>
              <Badge tone="info">★ {product.rating.toFixed(1)}</Badge>
            </div>

            <PriceTag
              price={product.price}
              className="mt-4 text-2xl font-extrabold"
            />
            <p id={DESCRIPTION_ID} className="mt-3 text-sm text-slate-600">
              {product.shortDescription}
            </p>

            <section className="mt-5" aria-labelledby={SPECIFICATIONS_ID}>
              <h3 id={SPECIFICATIONS_ID} className="mb-2 text-sm font-semibold">
                Key specifications
              </h3>
              <dl className="divide-y divide-slate-200 rounded-xl border border-slate-200">
                {specifications.map(([name, value]) => (
                  <div
                    key={name}
                    className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-3 px-3 py-2.5 text-sm"
                  >
                    <dt className="break-words text-slate-500">{name}</dt>
                    <dd className="break-words font-medium text-slate-800">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {product.inStock && (
                <QuantitySelector
                  value={quantity}
                  onChange={setQuantity}
                  itemLabel={product.name}
                  size="md"
                />
              )}
              <AddToCartButton
                product={product}
                quantity={quantity}
                onAdded={closeDialog}
                preventRapidRepeat
              />
            </div>

            <Link
              href={`/products/${product.slug}`}
              onClick={closeDialog}
              className={`-ml-2 mt-3 inline-flex min-h-10 w-fit items-center rounded-lg px-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 ${INDIGO_FOCUS_RING}`}
            >
              View full details
              <span aria-hidden className="ml-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </dialog>
  );
}
