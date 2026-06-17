import { create } from "zustand";
import { apiGet } from "@/lib/api";

export const PAGE_SIZE = 12;

// Products store: current page of products, the list of categories, and an
// in-memory cache (same strategy as the users store – see usersStore.js).
//
// Note: DummyJSON can't combine a text search AND a category filter in one
// request, so we treat them as mutually exclusive: a category filter takes
// priority, otherwise we use the search term, otherwise the plain list.
export const useProductsStore = create((set, get) => ({
  products: [],
  total: 0,
  categories: [],
  loading: false,
  error: null,
  cache: {},

  // Fetch the category list once (used by the filter dropdown).
  fetchCategories: async () => {
    if (get().categories.length > 0) return; // already loaded – skip
    try {
      const data = await apiGet("/products/categories");
      // DummyJSON returns objects like { slug, name, url }.
      set({ categories: data });
    } catch (err) {
      set({ error: err.message });
    }
  },

  // Async action: fetch a page of products with optional search + category.
  fetchProducts: async (page = 0, search = "", category = "") => {
    const skip = page * PAGE_SIZE;
    const key = `cat=${category}&search=${search}&skip=${skip}`;

    const cached = get().cache[key];
    if (cached) {
      set({ products: cached.products, total: cached.total, loading: false, error: null });
      return;
    }

    set({ loading: true, error: null });
    try {
      const trimmed = search.trim();
      let path;
      if (category) {
        path = `/products/category/${category}?limit=${PAGE_SIZE}&skip=${skip}`;
      } else if (trimmed) {
        path = `/products/search?q=${encodeURIComponent(trimmed)}&limit=${PAGE_SIZE}&skip=${skip}`;
      } else {
        path = `/products?limit=${PAGE_SIZE}&skip=${skip}`;
      }
      const data = await apiGet(path);

      set((state) => ({
        products: data.products,
        total: data.total,
        loading: false,
        cache: { ...state.cache, [key]: { products: data.products, total: data.total } },
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));
