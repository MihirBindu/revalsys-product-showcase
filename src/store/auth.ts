import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthUser {
  name: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  isGuest: boolean;
  login: (email: string, name?: string) => void;
  continueAsGuest: () => void;
  logout: () => void;
}

/**
 * Mock auth for assignment scope: no backend, any email/password combination
 * "logs in" locally. See README for the reasoning behind this decision.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isGuest: false,
      login: (email, name) =>
        set({
          user: { email, name: name?.trim() || email.split("@")[0] },
          isGuest: false,
        }),
      continueAsGuest: () => set({ user: null, isGuest: true }),
      logout: () => set({ user: null, isGuest: false }),
    }),
    { name: "auth-storage" }
  )
);
