"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useTransition,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface FilterNavigation {
  /** True while a filter-driven navigation is in flight. */
  isPending: boolean;
  /**
   * Applies a change to the current filters and navigates. Callers pass a
   * mutator rather than finished params so the base is resolved here, against
   * the freshest state — see `latestParamsRef`.
   */
  updateParams: (mutate: (params: URLSearchParams) => void) => void;
}

const FilterNavigationContext = createContext<FilterNavigation | null>(null);

/**
 * Owns navigation for every listing control. The products route renders on the
 * server, so each filter change is a round-trip; driving them all through one
 * `useTransition` gives the grid a single shared pending state.
 */
export function FilterNavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  /**
   * The most recently requested query string, which the URL may not reflect yet.
   *
   * `startTransition` keeps the old UI live while the next route loads, so
   * `useSearchParams()` reports the previous query meanwhile. Composing from it
   * would discard whatever the user just did — picking a category mid-search
   * would be reverted when the debounce landed. This keeps changes additive.
   */
  const latestParamsRef = useRef<string | null>(null);

  // Once the URL catches up (or history navigation occurs), it becomes the
  // source of truth again.
  useEffect(() => {
    latestParamsRef.current = null;
  }, [searchParams]);

  const updateParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(
        latestParamsRef.current ?? searchParams.toString()
      );
      mutate(params);

      const queryString = params.toString();
      latestParamsRef.current = queryString;

      startTransition(() => {
        router.push(queryString ? `${pathname}?${queryString}` : pathname, {
          scroll: false,
        });
      });
    },
    [router, pathname, searchParams]
  );

  return (
    <FilterNavigationContext.Provider value={{ isPending, updateParams }}>
      {children}
    </FilterNavigationContext.Provider>
  );
}

export function useFilterNavigation(): FilterNavigation {
  const context = useContext(FilterNavigationContext);
  if (!context) {
    throw new Error(
      "useFilterNavigation must be used inside a FilterNavigationProvider"
    );
  }
  return context;
}
