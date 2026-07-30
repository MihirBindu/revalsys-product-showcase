# NexusGadgets — Mini Product Showcase

A small electronics product showcase built with Next.js (App Router) and TypeScript, submitted as a technical assignment for the Angular & Next.js Developer role at Revalsys Technologies.

**Theme:** Electronics (laptops, audio, wearables, smartphones, cameras, accessories).

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
```

## Features implemented

- **Home page** — hero section + featured products grid.
- **Product listing page** — grid of all products with debounced search, category and brand filters, in-stock filter, and sort (featured / price / rating / name). Filter state is synced to the URL query string, so filtered views are shareable and back/forward-button friendly.
- **Product detail page** — image, description, full specifications table, price, add-to-cart, and a "you may also like" related-products row. Statically generated per product via `generateStaticParams`.
- **Cart page** — quantity controls, remove item, order summary, and a demo checkout (clears the cart and shows a confirmation; no real payment is processed).
- **Login / guest handling** — a mock sign-in form (name + email, no password) plus an explicit "Continue as guest" path. Session state persists across reloads via `localStorage`.
- **About Us / Contact Us pages** — static content pages; the contact form is a UI-only demo and does not send messages.
- **SEO** — per-route metadata (static `metadata` exports and `generateMetadata` for product pages), canonical URLs on every indexable route, `noindex` on the cart and login pages, Open Graph tags, JSON-LD `Product` structured data with absolute URLs, `sitemap.ts`, `robots.ts`, semantic HTML landmarks (`header`/`nav`/`main`/`section`/`article`/`footer`), descriptive image `alt` text, and a single `<h1>` per page with correctly nested headings.

## Architectural decisions

- **App Router + Server/Client split.** Pages that only read data (home, listing, detail, about, contact) are Server Components; interactivity (search box, filters, cart buttons, login form) is isolated into small `"use client"` leaf components. This keeps most of the tree server-rendered while still shipping the interactive pieces.
- **State management: Zustand.** Cart and auth/session state live in two small Zustand stores (`src/store/cart.ts`, `src/store/auth.ts`) with the `persist` middleware backing them onto `localStorage`. Zustand was chosen over Context/Redux for a cart-sized state surface — no providers to wire up, no boilerplate reducers, and selectors avoid unnecessary re-renders.
- **Mock authentication, not a real auth provider.** The assignment asks for "login and guest user handling," not a production auth system. Wiring up NextAuth or a real backend would be scope creep for a static-data assignment, so `src/store/auth.ts` implements a local, unverified "login" (any email works) alongside an explicit guest mode. This is called out clearly in the UI copy on the login page.
- **Data layer shaped like an API client.** Product data is static JSON (`src/data/products.json`), but it's accessed exclusively through functions in `src/lib/products.ts` (`getAllProducts`, `getProductBySlug`, `searchProducts`, etc.) rather than importing the JSON directly in pages. Swapping this for a real API later means changing one file, not every page that touches product data.
- **URL as the source of truth for listing state.** Search/filter/sort on the products page are read from and written to the URL query string (via `useSearchParams`/`router.push`) instead of local-only React state. This makes filtered views linkable and shareable, and keeps the page itself an `async` Server Component that renders directly from `searchParams`.
- **Local, self-authored SVG placeholders.** There's no live product-image API, so each category has one generated SVG placeholder (`public/images/categories/`) served through `next/image`. `next.config.ts` sets `dangerouslyAllowSVG` with a strict `contentSecurityPolicy` (`script-src 'none'; sandbox;`), which is safe here because the SVGs are authored by this project, not user-uploaded.

## AI tools used during development

This project was built with **Claude Code** (Anthropic), used for:
- Scaffolding the project structure and component breakdown from the assignment brief.
- Writing component, page, and store code across the app.
- Diagnosing a Tailwind CSS v4 cascade-layer bug (an unlayered `body` rule in the default `globals.css` from `create-next-app` was overriding Tailwind's layered utility classes on dark-mode systems) and fixing it.
- Running `next build`/`eslint` and live browser verification (desktop + mobile viewports, full add-to-cart → cart → checkout and login → guest flows) to confirm the app works end to end, not just that it compiles.

## Assumptions and limitations

- No real backend, database, or payment processing — product data is static JSON and checkout is a UI-only demo.
- Login is a mock: any name/email combination "signs in" locally; there is no password, verification, or persistence beyond the browser's `localStorage`.
- Product images are generated SVG placeholders per category rather than real photography, since no live product-image API was available.
- The contact form does not send messages; it exists to demonstrate a validated, accessible form pattern.
- The site origin is resolved at build time in `src/lib/site.ts`: `NEXT_PUBLIC_SITE_URL` (explicit override, e.g. a custom domain) → `VERCEL_PROJECT_PRODUCTION_URL` (injected automatically by Vercel) → a local placeholder. A Vercel deployment therefore emits correct canonical, Open Graph, sitemap, and robots URLs with no configuration; set `NEXT_PUBLIC_SITE_URL` only when serving from a custom domain.
