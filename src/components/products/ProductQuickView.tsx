"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { Product } from "@/types/product";
import { INDIGO_FOCUS_RING } from "@/lib/styles";
import AddToCartButton from "@/components/product/AddToCartButton";
import PriceTag from "@/components/product/PriceTag";
import Badge from "@/components/ui/Badge";
import QuantitySelector from "@/components/ui/QuantitySelector";

const DESKTOP_QUERY = "(min-width: 1024px)";

export default function ProductQuickView({ product }: { product: Product }) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const dialogId = useId();
  const specifications = Object.entries(product.specs).slice(0, 3);

  const closeDialog = useCallback(() => setOpen(false), []);

  function openDialog() {
    if (!window.matchMedia(DESKTOP_QUERY).matches) return;
    setQuantity(1);
    setOpen(true);
  }

  function trapFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== "Tab") return;

    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    const first = focusable[0];
    const last = focusable.at(-1);
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
    if (!open) return;

    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
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

    const desktopViewport = window.matchMedia(DESKTOP_QUERY);
    function closeBelowDesktop(event: MediaQueryListEvent) {
      if (!event.matches) closeDialog();
    }
    desktopViewport.addEventListener("change", closeBelowDesktop);

    return () => {
      desktopViewport.removeEventListener("change", closeBelowDesktop);
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      if (trigger?.isConnected) trigger.focus();
    };
  }, [closeDialog, open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={`Quick view ${product.name}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={openDialog}
        className={`absolute bottom-3 left-1/2 z-10 hidden -translate-x-1/2 cursor-pointer items-center justify-center whitespace-nowrap rounded-lg bg-white/95 px-4 py-2 text-sm font-semibold text-slate-900 opacity-0 shadow-lg ring-1 ring-slate-200 hover:bg-white group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 motion-safe:transition-opacity lg:inline-flex ${INDIGO_FOCUS_RING}`}
      >
        Quick view
      </button>

      {open && (
        <dialog
          ref={dialogRef}
          id={dialogId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          onKeyDown={trapFocus}
          onCancel={(event) => {
            event.preventDefault();
            closeDialog();
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) closeDialog();
          }}
          className="m-auto max-h-[calc(100dvh_-_3rem)] w-[calc(100%_-_3rem)] max-w-4xl overflow-y-auto rounded-2xl border-0 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm"
        >
          <button
            ref={closeButtonRef}
            type="button"
            aria-label={`Close quick view for ${product.name}`}
            onClick={closeDialog}
            className={`absolute right-4 top-4 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/95 text-xl text-slate-600 shadow ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900 ${INDIGO_FOCUS_RING}`}
          >
            <span aria-hidden>×</span>
          </button>

          <div className="grid grid-cols-2">
            <div className="relative min-h-[30rem] bg-slate-100">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 45vw, 0px"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col p-8">
              <div className="pr-10">
                <p className="text-sm font-medium text-indigo-600">
                  {product.brand}
                </p>
                <h2 id={titleId} className="mt-1 text-2xl font-bold">
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
              <p id={descriptionId} className="mt-3 text-sm text-slate-600">
                {product.shortDescription}
              </p>

              <section className="mt-5" aria-labelledby={`${titleId}-specs`}>
                <h3
                  id={`${titleId}-specs`}
                  className="mb-2 text-sm font-semibold"
                >
                  Key specifications
                </h3>
                <dl className="divide-y divide-slate-200 rounded-xl border border-slate-200">
                  {specifications.map(([name, value]) => (
                    <div
                      key={name}
                      className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-3 px-3 py-2.5 text-sm"
                    >
                      <dt className="text-slate-500">{name}</dt>
                      <dd className="font-medium text-slate-800">{value}</dd>
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
                  />
                )}
                <AddToCartButton
                  product={product}
                  quantity={quantity}
                  onAdded={closeDialog}
                />
              </div>

              <Link
                href={`/products/${product.slug}`}
                onClick={closeDialog}
                className={`mt-5 w-fit rounded text-sm font-semibold text-indigo-600 hover:text-indigo-700 ${INDIGO_FOCUS_RING}`}
              >
                View full details
                <span aria-hidden className="ml-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
