import Link from "next/link";

export default function EmptyCartState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-300 py-20 text-center">
      <p className="text-lg font-semibold text-slate-900">Your cart is empty</p>
      <p className="text-sm text-slate-500">Browse products and add something you like.</p>
      <Link
        href="/products"
        className="mt-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Browse products
      </Link>
    </div>
  );
}
