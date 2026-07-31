"use client";

import { useEffect } from "react";
import "./globals.css";

/**
 * Last-resort boundary for failures in the root layout itself.
 *
 * At this level the layout has not rendered, so this component supplies its own
 * <html> and <body> and cannot rely on the site's header or footer. Styling is
 * intentionally minimal for the same reason.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-white px-4 text-slate-900 antialiased">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <h1 className="text-2xl font-bold">Something went wrong</h1>
          <p className="text-slate-600">
            The application failed to load. Please try again.
          </p>
          {error.digest && (
            <p className="text-xs text-slate-400">Reference: {error.digest}</p>
          )}
          <button
            type="button"
            onClick={reset}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
