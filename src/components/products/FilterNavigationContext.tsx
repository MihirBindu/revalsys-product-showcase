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
   * Applies a mutation to the current filter state and navigates.
   *
   * Controls pass a mutator rather than a finished `URLSearchParams` so that
   * the base is resolved here, against the freshest state — see the note on
   * `latestParamsRef` below.
   */
  updateParams: (mutate: (params: URLSearchParams) => void) => void;
}

const FilterNavigationContext = createContext<FilterNavigation | null>(null);

/**
 * Owns navigation for every listing control.
 *
 * The products route renders on the server, so each filter change is a network
 * round-trip. Routing all of them through a single `useTransition` lets the
 * grid show one shared pending state instead of appearing frozen.
 */
export function FilterNavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  /**
   * The most recent query string we asked for, which may not be on the URL yet.
   *
   * `startTransition` deliberately keeps the old UI interactive while the new
   * route loads, so `useSearchParams()` still reports the *previous* query for
   * the duration. Composing the next update from it would silently discard
   * whatever the user just did — picking a category mid-search, for instance,
   * would be reverted when the search debounce landed a moment later. Reading
   * from this ref keeps rapid successive changes additive.
   */
  const latestParamsRef = useRef<string | null>(null);

  // Once the URL catches up (or the user navigates via history), the ref has
  // served its purpose and the real URL becomes the source of truth again.
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
