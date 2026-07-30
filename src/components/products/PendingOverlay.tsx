"use client";

import type { ReactNode } from "react";
import { useFilterNavigation } from "@/components/products/FilterNavigationContext";

/**
 * Dims the results while a filter navigation is in flight, so the page reads as
 * "working" rather than unresponsive. Interaction is suspended during the fetch
 * to stop clicks landing on rows that are about to be replaced.
 */
export default function PendingOverlay({ children }: { children: ReactNode }) {
  const { isPending } = useFilterNavigation();

  return (
    <div
      aria-busy={isPending}
      className={`transition-opacity duration-200 ${
        isPending ? "pointer-events-none opacity-50" : "opacity-100"
      }`}
    >
      {children}
    </div>
  );
}
