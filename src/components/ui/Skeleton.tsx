/**
 * A shimmering placeholder block.
 *
 * `aria-hidden` because the surrounding loading view carries the single
 * `role="status"` announcement. Callers pass explicit dimensions so the
 * placeholder reserves the same space as the content it stands in for.
 */
export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`rounded-md bg-slate-200 motion-safe:animate-pulse ${className}`}
    />
  );
}
