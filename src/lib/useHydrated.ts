"use client";

import { useSyncExternalStore } from "react";

/** Never emits; the snapshot is constant per environment. */
const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * False on the server and during the first client render, true after hydration.
 *
 * Zustand's `persist` fills the store from localStorage before React hydrates,
 * while the server rendered the empty initial state. Gating persisted reads on
 * this keeps the first client render identical to the server HTML.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
}
