import Skeleton from "@/components/ui/Skeleton";
import ProductCardSkeleton from "@/components/products/ProductCardSkeleton";

/**
 * Shown while the listing route loads on a cross-page navigation. Filter
 * changes do not land here — those run in a transition that keeps the current
 * results on screen and dims them instead.
 *
 * The static heading renders for real so it doesn't flicker on arrival; only
 * request-dependent parts are stood in for.
 */
export default function ProductsLoading() {
  return (
    <div
      aria-busy="true"
      data-loading-view="products"
      className="mx-auto max-w-6xl px-4 py-10 sm:px-6"
    >
      <p role="status" aria-live="polite" className="sr-only">
        Loading products…
      </p>

      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">All Products</h1>
        {/* Matches ResultsStatus: mt-1 and a 24px line box. */}
        <Skeleton className="mt-1 h-6 w-36" />
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
        <aside
          aria-label="Loading catalog controls"
          data-loading-sidebar="true"
          className="flex flex-col gap-4 lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto lg:overscroll-contain lg:pr-1"
        >
          <Skeleton
            data-loading-search="true"
            className="h-[38px] w-full rounded-lg"
          />
          {/* Below lg the real page collapses filters to a single toggle. */}
          <Skeleton
            data-loading-filter-toggle="true"
            className="h-[38px] w-full rounded-lg lg:hidden"
          />
          <div className="hidden flex-col gap-6 lg:flex">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-20" />
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton
                  key={i}
                  data-loading-category="true"
                  className="h-8 w-full"
                />
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-14" />
              <Skeleton
                data-loading-brand="true"
                className="h-[38px] w-full rounded-lg"
              />
            </div>
            <Skeleton data-loading-stock="true" className="h-5 w-28" />
          </div>

          <div
            data-loading-desktop-controls="true"
            className="hidden flex-col gap-4 border-t border-slate-200 pt-4 lg:flex"
          >
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-5 w-14" />
              <Skeleton
                data-loading-desktop-sort="true"
                className="h-[38px] w-full rounded-lg"
              />
            </div>
            <div
              data-loading-active-filters="true"
              className="flex items-center gap-2"
            >
              <Skeleton className="h-6 w-28 rounded-full" />
            </div>
          </div>
        </aside>

        <div className="flex flex-col gap-4">
          <div
            data-loading-mobile-controls="true"
            className="flex flex-wrap items-center justify-between gap-3 lg:hidden"
          >
            {/* 38px is the rendered height of the sort <select>, not a round
                number — h-10 would leave the grid 2px low. */}
            <Skeleton
              data-loading-mobile-sort="true"
              className="ml-auto h-[38px] w-44 rounded-lg"
            />
          </div>
          <div
            data-loading-product-grid="true"
            className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4"
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
