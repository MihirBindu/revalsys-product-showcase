import Skeleton from "@/components/ui/Skeleton";

/**
 * Stands in for the cart until the persisted store has rehydrated.
 *
 * A saved cart isn't readable during the first client render, so something has
 * to fill the gap. Showing the empty state would be worse than showing nothing:
 * it briefly asserts the cart *is* empty, which for a returning customer is
 * simply wrong. This mirrors the real two-column layout instead.
 */
export default function CartViewSkeleton() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]"
    >
      <span className="sr-only">Loading your cart…</span>

      <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 px-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-4">
            <Skeleton className="h-20 w-20 shrink-0 rounded-lg" />
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-3 w-20" />
              <div className="mt-2 flex items-center gap-3">
                <Skeleton className="h-8 w-28 rounded-lg" />
                <Skeleton className="h-3 w-14" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 p-6">
        <Skeleton className="h-6 w-36" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-12" />
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 pt-4">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}
