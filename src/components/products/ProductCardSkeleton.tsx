import Skeleton from "@/components/ui/Skeleton";

/**
 * Mirrors ProductCard's structure and its height.
 *
 * The block sizes are measured, not decorative: names wrap to two lines at grid
 * width and descriptions are clamped to two, so single-line placeholders leave
 * the card ~32px short and every row below jumps when content lands.
 */
export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Title runs to two lines, beside the rating badge. */}
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-5 w-10 shrink-0 rounded-full" />
        </div>
        <Skeleton className="h-4 w-1/3" />
        {/* Description is clamped to two lines in the real card. */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
