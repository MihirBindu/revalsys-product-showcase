import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about NexusGadgets, a mini electronics showcase built to demonstrate Next.js and TypeScript best practices.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">About NexusGadgets</h1>
      <p className="mt-4 text-slate-600">
        NexusGadgets is a mini product showcase built to demonstrate a clean, modular
        Next.js and TypeScript architecture &mdash; from routing and data fetching to
        state management and SEO.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">What we showcase</h2>
        <p className="mt-2 text-slate-600">
          A curated catalog spanning laptops, audio, wearables, smartphones, cameras,
          and accessories &mdash; with search, filtering, a persistent cart, and product
          detail pages backed by static structured data.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-slate-900">How it&apos;s built</h2>
        <p className="mt-2 text-slate-600">
          The app uses the Next.js App Router with Server Components for data-heavy
          pages and small Client Components for interactivity, TypeScript throughout,
          Tailwind CSS for styling, and Zustand for cart and session state.
        </p>
        <h3 className="mt-6 text-lg font-semibold text-slate-900">Data</h3>
        <p className="mt-2 text-slate-600">
          Product data is static JSON, accessed through a small data-layer module that
          mirrors what a real API client would look like.
        </p>
      </section>
    </div>
  );
}
