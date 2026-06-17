# Admin Dashboard — Next.js + MUI + Zustand

A small, responsive admin dashboard built for a frontend technical assessment.
It authenticates against **DummyJSON** and lets you browse **Users** and
**Products** with search, filtering and pagination.

**Tech stack**

- [Next.js 16](https://nextjs.org/) (App Router, JavaScript)
- [Material-UI (MUI)](https://mui.com/) for all UI components
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [NextAuth](https://next-auth.js.org/) for authentication
- [DummyJSON](https://dummyjson.com/) as the public REST API

---

## Features

- **Authentication** — admin login via DummyJSON's `/auth/login`, handled by
  NextAuth. The token is also stored in Zustand (and mirrored to `localStorage`).
- **Protected routes** — `/dashboard/*` is guarded; unauthenticated users are
  redirected to `/login`.
- **Users** — responsive table with search and pagination, plus a detailed
  single-user page.
- **Products** — responsive card grid with search, category filter and
  pagination, plus a single-product page with an image carousel.
- **Caching** — list results are cached so revisiting a page/search doesn't
  re-hit the API.
- **Responsive** — every page works on mobile, tablet and desktop.

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy the example file and fill in a secret:

```bash
cp .env.example .env.local
```

`.env.local` needs:

```bash
# Used by NextAuth to sign/encrypt the session token. Generate one with:
#   openssl rand -base64 32
NEXTAUTH_SECRET=your-random-secret

# The URL the app runs on (used for auth callbacks)
NEXTAUTH_URL=http://localhost:3000
```

> The backend is the public DummyJSON API, so no API keys are required —
> only the NextAuth secret above.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Other commands

```bash
npm run build   # production build
npm run start   # run the production build
```

---

## Demo login

DummyJSON provides ready-made test accounts. The login form is pre-filled with:

- **Username:** `emilys`
- **Password:** `emilyspass`

---

## Project structure

```
app/
  api/auth/[...nextauth]/route.js  # NextAuth config (Credentials -> DummyJSON)
  login/page.js                    # login page
  dashboard/
    layout.js                      # nav bar + logout (shared by dashboard pages)
    page.js                        # dashboard home
    users/page.js                  # users list (search + pagination)
    users/[id]/page.js             # single user
    products/page.js               # products list (search + category + pagination)
    products/[id]/page.js          # single product (image carousel)
  layout.js                        # root layout + MUI App Router cache provider
  page.js                          # redirects to /dashboard
  providers.js                     # SessionProvider + MUI ThemeProvider
  theme.js                         # MUI theme
components/
  AuthSync.js                      # copies NextAuth token into the Zustand store
  SearchBar.js                     # debounced, memoized search input
  PaginationControls.js            # memoized pagination
  Loading.js                       # spinner
store/
  authStore.js                     # auth state (persisted to localStorage)
  usersStore.js                    # users state + cache + async actions
  productsStore.js                 # products state + cache + async actions
lib/
  api.js                           # tiny fetch wrapper for DummyJSON
proxy.js                           # route protection (Next 16's middleware)
```

---

## Why Zustand?

Zustand was chosen for state management because:

- **Simplicity & small footprint** — no providers, reducers, actions or
  `dispatch`. You create a store and use it as a hook. Far less boilerplate
  than Redux.
- **Built-in async actions** — API calls live directly inside store actions
  (see `fetchUsers` / `fetchProducts`), so data fetching and state updates
  stay together.
- **Better fit for small–medium apps** — Redux's structure shines on large,
  complex apps; for an app this size Zustand gives the same benefits with a
  fraction of the code.
- **Middleware** — the `persist` middleware mirrors the auth state to
  `localStorage` with one line.

State is split into three stores: **auth**, **users** and **products**.

---

## Caching strategy

Both the users and products stores keep an in-memory `cache` object keyed by the
exact query (search term + category + page). Before making a network request,
the store checks the cache and reuses the stored result if that exact query was
already fetched.

**Why it's useful:** users frequently page back and forth or repeat a search.
Caching avoids redundant API calls, making navigation feel instant and reducing
network traffic. The auth token is additionally cached in `localStorage` (via
Zustand's `persist`) so a refresh keeps you logged in.

---

## Performance optimizations

- **API-side pagination** — only one page (`limit`/`skip`) is fetched at a time
  instead of loading the entire list.
- **`React.memo`** — `SearchBar` and `PaginationControls` are memoized so they
  don't re-render when unrelated parent state (e.g. fetched data) changes.
- **`useCallback`** — event handlers passed to those memoized components are
  stabilized so the memoization actually holds.
- **Debounced search** — the search input waits 400ms after typing stops before
  firing a request, avoiding a call on every keystroke.
- **Client-side caching** — see above.

---

## Notes / status

- All required parts are implemented: auth, protected routes, users list +
  detail, products list + detail, search, category filter, pagination, Zustand
  state management, caching, and responsive MUI UI.
- **Search vs. category filter (products):** DummyJSON cannot combine a text
  search and a category filter in a single request, so a selected category takes
  priority over the search term. Clearing the category falls back to search.
