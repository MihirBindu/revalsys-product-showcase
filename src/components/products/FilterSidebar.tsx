"use client";

import { useSearchParams } from "next/navigation";
import { CATEGORIES } from "@/lib/products";
import { useFilterNavigation } from "@/components/products/FilterNavigationContext";
import { PRODUCT_QUERY, parseCategory } from "@/lib/productQuery";
import { SELECT_FOCUS_RING } from "@/lib/styles";

export default function FilterSidebar({ brands }: { brands: string[] }) {
  const searchParams = useSearchParams();
  const { updateParams } = useFilterNavigation();

  const activeCategory = parseCategory(
    searchParams.get(PRODUCT_QUERY.category)
  );
  const activeBrand = searchParams.get(PRODUCT_QUERY.brand) ?? "All";
  const inStockOnly = searchParams.get(PRODUCT_QUERY.inStock) === "1";

  function updateParam(
    key: typeof PRODUCT_QUERY.category | typeof PRODUCT_QUERY.brand,
    value: string | null
  ) {
    updateParams((params) => {
      if (value && value !== "All") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
  }

  function toggleInStock() {
    updateParams((params) => {
      if (inStockOnly) {
        params.delete(PRODUCT_QUERY.inStock);
      } else {
        params.set(PRODUCT_QUERY.inStock, "1");
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-2 text-sm font-semibold text-slate-900">Category</h2>
        <ul className="flex flex-col gap-1">
          {["All", ...CATEGORIES].map((category) => (
            <li key={category}>
              <button
                type="button"
                aria-pressed={activeCategory === category}
                onClick={() => updateParam(PRODUCT_QUERY.category, category)}
                className={`w-full rounded-lg px-2 py-1.5 text-left text-sm motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${
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
          onChange={(e) => updateParam(PRODUCT_QUERY.brand, e.target.value)}
          className={`w-full rounded-lg border border-slate-300 px-3 py-2 text-sm ${SELECT_FOCUS_RING}`}
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
    </div>
  );
}
