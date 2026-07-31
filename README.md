# NexusGadgets — Mini Product Showcase

A small electronics product showcase built with Next.js (App Router) and TypeScript, submitted as a technical assignment for the Angular & Next.js Developer role at Revalsys Technologies.

**Live demo:** https://revalsys-product-showcase.vercel.app
**Repository:** https://github.com/MihirBindu/revalsys-product-showcase

**Theme:** Electronics (laptops, audio, wearables, smartphones, cameras, accessories).

## Tech stack

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) | Server Components, file-based routing, first-class metadata API |
| Language | TypeScript (`strict`) | No `any`, unsafe assertions, or suppressed type errors |
| Styling | Tailwind CSS v4 | Utility-first, no separate stylesheet to keep in sync with markup |
| State | Zustand + `persist` | Cart-sized state surface; no provider tree or reducer boilerplate |
| Data | Static JSON behind an accessor module | Swappable for a real API by changing one file |
| Testing | Vitest + Playwright + Axe | Unit, browser-flow, responsive, SEO, and WCAG regression coverage |
| Hosting | Vercel | Auto-deploys from `main`; site origin derived from build env |

## Project structure

```
src/
├─ app/                      # Routes (App Router)
│  ├─ layout.tsx             # Shared chrome + site-wide metadata
│  ├─ page.tsx               # Home
│  ├─ products/              # Listing (+ loading.tsx)
│  │  └─ [slug]/             # Detail, SSG (+ loading.tsx)
│  ├─ cart/  login/  about/  contact/
│  ├─ error.tsx              # Route-level error boundary
│  ├─ global-error.tsx       # Root-layout error boundary
│  ├─ not-found.tsx
│  ├─ sitemap.ts  robots.ts
├─ components/
│  ├─ ui/                    # Primitives: Button, Input, Textarea, Badge, Skeleton
│  ├─ layout/                # Header, Footer, NavLinkStatus
│  ├─ home/  products/  product/  cart/  auth/  contact/
├─ lib/                      # products.ts (data layer), site.ts, useHydrated.ts
├─ store/                    # cart.ts, auth.ts (Zustand + persist)
├─ data/products.json        # Catalog
└─ types/product.ts
tests/
├─ unit/                     # Data, query, cart, and currency contracts
└─ e2e/                      # User journeys, WCAG, SEO, and responsive checks
```

## Project setup

Requirements: Node.js 20+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build   # production build (also runs the TypeScript check)
npm run start   # serve the production build
npm run lint    # ESLint
npm run typecheck # strict TypeScript check without building
npm test        # Vitest unit suite
npm run test:e2e # Playwright browser suite (starts the app automatically)
npm run check   # lint + types + unit tests + production build
npm run check:all # check + browser suite
```

## Features implemented

- **Home page** — hero section + featured products grid.
- **Product listing page** — grid of all products with debounced search, category and brand filters, in-stock filter, and sort (featured / price / rating / name). Filter state is synced to the URL query string, so filtered views are shareable and back/forward-button friendly. Applied filters appear as dismissible chips with a one-click reset, results dim behind a shared pending indicator while the server responds, and the filter controls collapse behind a `Filters (n)` toggle on small screens so products stay above the fold. At desktop widths, search, filters, sorting, and active-filter controls remain in a viewport-bounded sticky sidebar, and each product offers a keyboard-accessible quick view with key specifications and cart controls. Each card collection owns one shared native dialog; mobile cards retain their original behavior and layout.
- **Product detail page** — image, description, full specifications table, price, add-to-cart, and a "you may also like" related-products row. Statically generated per product via `generateStaticParams`.
- **Cart page** — quantity controls, remove item, order summary, and a demo checkout (clears the cart and shows a confirmation; no real payment is processed).
- **Login / guest handling** — a mock sign-in form (name + email, no password) plus an explicit "Continue as guest" path. Session state persists across reloads via `localStorage`.
- **About Us / Contact Us pages** — static content pages. The contact form performs real client-side validation (required fields, email format, minimum message length) with inline messages wired via `aria-invalid`/`aria-describedby`, moves focus to the first invalid field on a failed submit, and confirms on success; there is no backend, so the confirmation says plainly that nothing was sent.
- **Error handling** — `error.tsx` catches route-level failures while keeping the header, nav and footer intact so the site stays navigable, `global-error.tsx` covers failures in the root layout itself, and `not-found.tsx` handles unknown routes.
- **SEO** — per-route metadata (static `metadata` exports and `generateMetadata` for product pages), canonical URLs on every indexable route, `noindex` on the cart and login pages, Open Graph tags, JSON-LD `Product` structured data with absolute URLs, `sitemap.ts`, `robots.ts`, semantic HTML landmarks (`header`/`nav`/`main`/`section`/`article`/`footer`), descriptive image `alt` text, and a single `<h1>` per page with correctly nested headings.
- **Accessibility and responsive safeguards** — keyboard-visible focus styles, skip navigation, live result announcements, labelled form errors, reduced-motion support, automated WCAG 2.1 A/AA scans on every mandatory route, and browser checks for 375 px horizontal overflow.

## Architectural decisions

- **App Router + Server/Client split.** Pages that only read data (home, listing, detail, about, contact) are Server Components; interactivity (search box, filters, cart buttons, login form) is isolated into small `"use client"` leaf components. This keeps most of the tree server-rendered while still shipping the interactive pieces.
- **One Quick View dialog per card collection.** Cards render lightweight desktop-only triggers through `ProductQuickViewProvider`; the provider owns the selected product, originating trigger and single native `<dialog>`. This avoids duplicating modal state and lifecycle refs across every card while preserving exact focus restoration, body-scroll locking, responsive closure, three-specification rendering and existing cart/toast behavior.
- **Static data is validated at the boundary.** `products.json` is parsed into the `Product` model once in `lib/products.ts`. Required text, positive prices, ratings, booleans, local image paths, categories, specifications, and unique IDs/slugs are checked before rendering. Invalid data fails the build instead of producing a partial catalog. The parser uses runtime narrowing without `any` or unsafe assertions.
- **State management: Zustand.** Cart and auth/session state live in two small Zustand stores (`src/store/cart.ts`, `src/store/auth.ts`) with the `persist` middleware backing them onto `localStorage`. Zustand was chosen over Context/Redux for a cart-sized state surface — no providers to wire up, no boilerplate reducers, and selectors avoid unnecessary re-renders.
- **The cart persists references, not snapshots.** Only `productId` and `quantity` are written to `localStorage`; product details are re-joined against the catalog on read (`resolveCartLines`). A cart saved before a price or copy change therefore renders current data instead of stale data, and lines whose product has left the catalog are dropped. A versioned `migrate` upgrades carts saved in the older snapshot format. The catalog is resolved on the server in `app/cart/page.tsx` and passed down as a prop, which keeps the data-access module out of the client JS bundle; the trade-off is that the catalog is serialized into the cart page's payload (roughly 10 KB), because the server cannot know which products a client-side cart holds.
- **Loading feedback is layered to match the kind of wait.** Cross-page navigation renders a route-level `loading.tsx` skeleton; in-page filter changes keep the current results on screen and dim them instead, since replacing results the user is already reading would be a regression; the cart shows a structured skeleton until its persisted state rehydrates; and nav links carry a `useLinkStatus` spinner. Skeleton blocks are sized against measured values (a product card is 343px, the sort control 38px) so the swap to real content produces no layout shift.
- **Persisted state is gated behind a hydration check.** `persist` populates the store before React hydrates, which would otherwise make the first client render disagree with the server HTML. `useHydrated` (built on `useSyncExternalStore`) defers persisted reads in the header, cart, and login form to a post-hydration update.
- **Mock authentication, not a real auth provider.** The assignment asks for "login and guest user handling," not a production auth system. Wiring up NextAuth or a real backend would be scope creep for a static-data assignment, so `src/store/auth.ts` implements a local, unverified "login" (any email works) alongside an explicit guest mode. This is called out clearly in the UI copy on the login page.
- **Data layer shaped like an API client.** Product data is static JSON (`src/data/products.json`), but it's accessed exclusively through functions in `src/lib/products.ts` (`getAllProducts`, `getProductBySlug`, `searchProducts`, etc.) rather than importing the JSON directly in pages. Swapping this for a real API later means changing one file, not every page that touches product data.
- **One owner for listing navigation.** Every listing control (search, category, brand, stock, sort, chips) routes through `FilterNavigationProvider`, which wraps navigation in a single `useTransition`. That gives the grid one shared pending state instead of each control tracking its own. Because `startTransition` intentionally keeps the previous UI live while the next route loads, `useSearchParams()` reports stale values mid-transition — so the provider composes each change onto the last *requested* params rather than onto the URL, keeping rapid successive changes (typing a search, then picking a category) additive instead of overwriting each other.
- **URL as the source of truth for listing state.** Search/filter/sort on the products page are read from and written to the URL query string (via `useSearchParams`/`router.push`) instead of local-only React state. This makes filtered views linkable and shareable, and keeps the page itself an `async` Server Component that renders directly from `searchParams`.
- **One contract owns listing query parameters.** Search, category, brand, stock, and sort keys are declared in `lib/productQuery.ts` and shared by the server page and every client control. The same module validates category and sort values, so malformed URLs fall back consistently instead of relying on unsafe casts.
- **Regression checks are part of the repository.** Vitest covers catalog validation, search/sort behavior, URL parsing, currency formatting, cart migration, and totals. Playwright covers rapid filter changes, browser history, quantity removal, form focus, page metadata, heading and landmark contracts, mobile overflow, reduced motion, and WCAG rules through Axe. Quick View coverage additionally checks hover/focus discovery, its single-dialog contract, both focus-loop directions, every dismissal path, focus restoration, responsive closure, short-screen layout, unavailable products, duplicate-click protection and exact cart undo. `npm run check:all` runs the complete gate locally.
- **Local, self-authored SVG artwork — one per product.** The catalog is fictional, so there is no real photography to license. Each of the 18 products has its own hand-written SVG (`public/images/products/<slug>.svg`) rather than a shared per-category placeholder: three laptops previously rendered the identical image, which made the grid read as unfinished. Each illustration draws the actual product form (clamshell vs. earbuds vs. ring vs. foldable) in a shared design language, with colour families grouped by category so the grid looks deliberate rather than random. The whole set is 72 KB of vector, scales to any viewport, and is served through `next/image`. `next.config.ts` sets `dangerouslyAllowSVG` with a strict `contentSecurityPolicy` (`script-src 'none'; sandbox;`), which is safe here precisely because these files are authored in-repo rather than user-uploaded.

## AI tools used during development

This project was built with **Claude Code** (Anthropic) and refined with
**OpenAI Codex**. AI assisted with scaffolding, implementation, review, and test
generation. Every proposed change was checked with TypeScript, ESLint, unit
tests, production builds, and browser-level verification before it was kept.

**Bugs found and fixed through AI-assisted verification**

| Bug | How it surfaced |
| --- | --- |
| Checkout confirmation was unreachable — `placed` lived in `CartSummary`, which unmounts the moment the cart is cleared, so the success panel could never render | Clicking through the real checkout flow, not just loading the page |
| Hydration mismatch — `persist` populates the Zustand store before React hydrates, so the header disagreed with the server HTML | Diffing the server-rendered HTML (`curl`) against the live client DOM: server sent `Login`, client rendered `Hi, Mihir` |
| Filter race — the debounced search captured a stale `searchParams`, so picking a category mid-search silently reverted it | Scripted interaction: type, then click a filter 100 ms later, then assert on the resulting URL |
| Tailwind v4 cascade-layer bug — an unlayered `body` rule from `create-next-app` overrode Tailwind's layered utilities on dark-mode systems | Rendering the page and inspecting computed styles |
| Skeleton placeholders were 32 px shorter than real cards, so every row jumped on load — the exact jank a skeleton exists to prevent | Injecting a temporary server delay to hold the loading state, then measuring both states and diffing the rects |
| Rating badges rendered two lines tall next to single-line ones, because the badge had no `shrink-0` and was compressed by long titles | Measuring every badge's box and comparing dimensions |

**Two lessons that shaped the process**

- *Re-run old tests after refactors.* Routing filter navigation through `useTransition`
  silently reopened the filter race that had already been fixed — `startTransition`
  deliberately keeps the previous UI live, so `useSearchParams()` is stale mid-transition.
  Re-running the earlier regression test caught it; testing only the new feature would not have.
- *Verify the claim, not the code.* Several findings were false positives — an image
  reported zero height (an artifact of a headless viewport), links appeared to have no
  accessible name (an `alt` supplies it), and a filter's dimming looked broken (a sampling
  artifact). Each was checked before being acted on, which avoided "fixing" non-problems.

**Assisted with, but reviewed line by line:** component and store implementation,
the Zustand persistence migration, catalog validation, SEO metadata wiring,
automated regression tests, and this README.

## Assumptions and limitations

- No real backend, database, or payment processing — product data is static JSON and checkout is a UI-only demo.
- Login is a mock: any name/email combination "signs in" locally; there is no password, verification, or persistence beyond the browser's `localStorage`.
- Product images are self-authored SVG illustrations rather than photography. The products are fictional, so there is nothing real to photograph and no stock imagery is licensed into the repo.
- The contact form validates input for real but has no delivery mechanism; a passing submission is acknowledged and discarded rather than sent.
- Product data is a fixed 18-item catalog with no pagination. The listing renders dynamically (rather than statically) because filter state lives in the URL — a deliberate trade-off for shareable filtered views over prerendering.
- The site origin is resolved at build time in `src/lib/site.ts`: `NEXT_PUBLIC_SITE_URL` (explicit override, e.g. a custom domain) → `VERCEL_PROJECT_PRODUCTION_URL` (injected automatically by Vercel) → a local placeholder. A Vercel deployment therefore emits correct canonical, Open Graph, sitemap, and robots URLs with no configuration; set `NEXT_PUBLIC_SITE_URL` only when serving from a custom domain.
