"use client";

import { useLinkStatus } from "next/link";

/**
 * Spinner for the nav link currently being navigated to.
 *
 * Must be rendered inside the `<Link>` it reports on — `useLinkStatus` reads
 * the nearest link's pending state. Positioned absolutely so appearing and
 * disappearing never reflows the nav, which would be worse than no indicator
 * at all.
 */
export default function NavLinkStatus() {
  const { pending } = useLinkStatus();

  if (!pending) return null;

  return (
    <span
      aria-hidden
      className="absolute -right-3.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70"
    />
  );
}
