import Link from "next/link";

export default function Hero() {
  return (
    <section className="border-b border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-16 sm:px-6 lg:py-24">
        <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-700">
          New arrivals every week
        </span>
        <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Electronics that keep up with your day.
        </h1>
        <p className="max-w-xl text-lg text-slate-600">
          Laptops, audio, wearables, smartphones, cameras and accessories &mdash; curated,
          compared, and ready to ship.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/products"
            className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Shop all products
          </Link>
          <Link
            href="/about"
            className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Learn more
          </Link>
        </div>
      </div>
    </section>
  );
}
