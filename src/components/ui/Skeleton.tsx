/**
 * A single shimmering placeholder block.
 *
 * Always `aria-hidden`: the surrounding loading view carries one `role="status"`
 * announcement, so individual blocks would only add noise for screen readers.
 * Callers pass explicit dimensions so the placeholder occupies the same space as
 * the content it stands in for, which keeps the swap free of layout shift.
 */
export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`animate-pulse rounded-md bg-slate-200 ${className}`}
    />
  );
}
