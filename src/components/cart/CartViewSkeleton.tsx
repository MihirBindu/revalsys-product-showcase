import Skeleton from "@/components/ui/Skeleton";

/**
 * Stands in for the cart until the persisted store has rehydrated.
 *
 * A saved cart isn't readable during the first client render. Showing the empty
 * state instead would briefly assert the cart is empty, which for a returning
 * customer is wrong, so this mirrors the real two-column layout.
 */
export default function CartViewSkeleton() {
  return (
    <div
      aria-busy="true"
      data-loading-view="cart"
      className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]"
    >
      <span role="status" aria-live="polite" className="sr-only">
        Loading your cart…
      </span>

      <div className="flex flex-col gap-4">
        <div
          data-loading-cart-list="true"
          className="divide-y divide-slate-200 rounded-xl border border-slate-200 px-4"
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              data-loading-cart-row="true"
              className="flex gap-4 py-4"
            >
              <Skeleton className="h-20 w-20 shrink-0 rounded-lg" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-start justify-between gap-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-20" />
                <div className="mt-2 flex items-center gap-3">
                  <Skeleton className="h-[34px] w-28 rounded-lg" />
                  <Skeleton className="h-4 w-14" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Skeleton
          className="h-5 w-32"
          data-loading-continue-shopping="true"
        />
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-6">
        <Skeleton className="h-7 w-36" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-12" />
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <Skeleton className="h-6 w-14" />
          <Skeleton className="h-6 w-20" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}
