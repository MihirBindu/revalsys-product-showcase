"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/products";

export default function FilterSidebar({ brands }: { brands: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "All";
  const activeBrand = searchParams.get("brand") ?? "All";
  const inStockOnly = searchParams.get("inStock") === "1";

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function toggleInStock() {
    const params = new URLSearchParams(searchParams.toString());
    if (inStockOnly) {
      params.delete("inStock");
    } else {
      params.set("inStock", "1");
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <aside className="flex flex-col gap-6" aria-label="Product filters">
      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-900">Category</h2>
        <ul className="flex flex-col gap-1">
          {["All", ...CATEGORIES].map((category) => (
            <li key={category}>
              <button
                type="button"
                onClick={() => updateParam("category", category)}
                className={`w-full rounded-lg px-2 py-1.5 text-left text-sm ${
                  activeCategory === category
                    ? "bg-indigo-50 font-semibold text-indigo-700"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-900">Brand</h2>
        <select
          value={activeBrand}
          onChange={(e) => updateParam("brand", e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          aria-label="Filter by brand"
        >
          <option value="All">All brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={toggleInStock}
          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
        />
        In stock only
      </label>
    </aside>
  );
}
