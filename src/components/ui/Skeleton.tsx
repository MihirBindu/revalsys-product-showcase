import type { HTMLAttributes } from "react";

/**
 * A low-contrast shimmering placeholder block.
 *
 * `aria-hidden` because the surrounding loading view carries the single
 * `role="status"` announcement. Callers pass explicit dimensions so the
 * placeholder reserves the same space as the content it stands in for.
 */
export default function Skeleton({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      aria-hidden
      data-skeleton="true"
      className={`skeleton-shimmer rounded-md bg-slate-200 ${className}`}
    />
  );
}
