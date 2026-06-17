import { create } from "zustand";
import { persist } from "zustand/middleware";

// Why Zustand? It's a tiny, simple state manager with almost no boilerplate
// (no providers, actions, reducers or dispatch like Redux). For a small/medium
// app this is plenty, and it has first-class support for async actions and
// middleware like `persist` (used here to mirror state into localStorage).

// Auth store: holds the logged-in user's token + basic profile.
// The token originally comes from NextAuth (DummyJSON's /auth/login) and is
// copied here by the <AuthSync /> component. We `persist` it to localStorage
// so a page refresh keeps the user logged in.
export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,

      setAuth: ({ token, user }) => set({ token, user }),
      clearAuth: () => set({ token: null, user: null }),
    }),
    { name: "auth-storage" } // localStorage key
  )
);
