import Skeleton from "@/components/ui/Skeleton";
import ProductCardSkeleton from "@/components/products/ProductCardSkeleton";

/**
 * Shown while a product page loads. These routes are prerendered, so on a warm
 * connection this barely appears — it matters on a cold or throttled one, where
 * the alternative is the previous page sitting there with no sign of progress.
 */
export default function ProductDetailLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <p role="status" aria-live="polite" className="sr-only">
        Loading product…
      </p>

      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <span aria-hidden className="text-slate-300">
          /
        </span>
        <Skeleton className="h-4 w-20" />
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full rounded-2xl" />

        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-3/4" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-14 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-9 w-32" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <Skeleton className="h-12 w-36 rounded-lg" />

          <div className="mt-2 flex flex-col gap-3">
            <Skeleton className="h-6 w-36" />
            <div className="overflow-hidden rounded-xl border border-slate-200">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border-b border-slate-200 px-4 py-3 last:border-b-0"
                >
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-16">
        <Skeleton className="mb-6 h-8 w-52" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
