"use client";

import { useLinkStatus } from "next/link";

/**
 * Spinner for the nav link currently being navigated to.
 *
 * Must render inside the `<Link>` it reports on — `useLinkStatus` reads the
 * nearest link's pending state. Positioned absolutely so it never reflows the
 * nav.
 */
export default function NavLinkStatus() {
  const { pending } = useLinkStatus();

  if (!pending) return null;

  return (
    <span
      aria-hidden
      className="absolute -right-3.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-current border-t-transparent opacity-70 motion-safe:animate-spin"
    />
  );
}
