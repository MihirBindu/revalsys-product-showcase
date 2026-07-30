"use client";

import { useSyncExternalStore } from "react";

/** Never emits; the snapshot is constant per environment. */
const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Returns false while rendering on the server and during the first client
 * render, then true once hydration has completed.
 *
 * Zustand's `persist` middleware reads localStorage synchronously as the store
 * module is evaluated, so a persisted cart or session is already populated
 * before React hydrates — while the server rendered the store's empty initial
 * state. Reading persisted state directly during the first render therefore
 * produces a hydration mismatch.
 *
 * Gating on this hook makes the first client render match the server HTML, and
 * defers the persisted values to a normal post-hydration update.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);
}
