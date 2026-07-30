import Link from "next/link";

export default function OrderPlaced() {
  return (
    <div
      role="status"
      className="flex flex-col items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 py-16 text-center"
    >
      <p className="text-lg font-semibold text-emerald-800">Order placed (demo)</p>
      <p className="max-w-md text-sm text-emerald-700">
        This is a static demo &mdash; no real order or payment was processed.
      </p>
      <Link
        href="/products"
        className="mt-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Continue shopping
      </Link>
    </div>
  );
}
