"use client";

import { useEffect } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";

/**
 * Route-level error boundary.
 *
 * Catches render errors within the app segment and keeps the shared layout —
 * header, nav and footer — intact, so a failure in one route leaves the rest of
 * the site navigable instead of dropping the user on a blank page.
 */
export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Stands in for a real reporter (Sentry and similar) — without this the
    // boundary would swallow the cause entirely.
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 px-4 py-24 text-center">
      <h1 className="text-3xl font-bold text-slate-900">Something went wrong</h1>
      <p className="text-slate-600">
        This page didn&apos;t load correctly. Trying again often clears it.
      </p>

      {error.digest && (
        <p className="text-xs text-slate-400">Reference: {error.digest}</p>
      )}

      <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Link
          href="/"
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
