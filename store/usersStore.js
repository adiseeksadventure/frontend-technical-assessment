import { create } from "zustand";
import { apiGet } from "@/lib/api";

export const PAGE_SIZE = 10;

// Users store: holds the current page of users plus an in-memory cache.
//
// Caching strategy:
//   We keep a `cache` object keyed by the exact query ("search + page").
//   Before making a network request we check the cache; if we've already
//   fetched that page/search we reuse the stored result instead of calling
//   the API again. This is useful because users often page back and forth
//   or re-run the same search, and re-fetching identical data wastes time
//   and bandwidth. The cache lives for the session (until a full reload).
export const useUsersStore = create((set, get) => ({
  users: [],
  total: 0,
  loading: false,
  error: null,
  cache: {},

  // Async action: fetch a page of users (with optional search term).
  fetchUsers: async (page = 0, search = "") => {
    const skip = page * PAGE_SIZE;
    const key = `search=${search}&skip=${skip}`;

    // 1) Serve from cache if we already have this exact query.
    const cached = get().cache[key];
    if (cached) {
      set({ users: cached.users, total: cached.total, loading: false, error: null });
      return;
    }

    // 2) Otherwise hit the API.
    set({ loading: true, error: null });
    try {
      const trimmed = search.trim();
      const path = trimmed
        ? `/users/search?q=${encodeURIComponent(trimmed)}&limit=${PAGE_SIZE}&skip=${skip}`
        : `/users?limit=${PAGE_SIZE}&skip=${skip}`;
      const data = await apiGet(path);

      set((state) => ({
        users: data.users,
        total: data.total,
        loading: false,
        cache: { ...state.cache, [key]: { users: data.users, total: data.total } },
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));
