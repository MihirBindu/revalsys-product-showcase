"use client";

import { useSearchParams } from "next/navigation";
import { useFilterNavigation } from "@/components/products/FilterNavigationContext";
import { PRODUCT_QUERY } from "@/lib/productQuery";
import { SELECT_FOCUS_RING } from "@/lib/styles";

const options: { value: string; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating" },
  { value: "name-asc", label: "Name: A to Z" },
];

export default function SortDropdown({
  stacked = false,
}: {
  stacked?: boolean;
}) {
  const searchParams = useSearchParams();
  const { updateParams } = useFilterNavigation();
  const activeSort = searchParams.get(PRODUCT_QUERY.sort) ?? "featured";

  function handleChange(value: string) {
    updateParams((params) => {
      if (value === "featured") {
        params.delete(PRODUCT_QUERY.sort);
      } else {
        params.set(PRODUCT_QUERY.sort, value);
      }
    });
  }

  return (
    <label
      className={`flex shrink-0 text-sm text-slate-600 ${
        stacked ? "flex-col items-stretch gap-1.5" : "items-center gap-2"
      }`}
    >
      <span>Sort by</span>
      <select
        value={activeSort}
        onChange={(e) => handleChange(e.target.value)}
        className={`rounded-lg border border-slate-300 px-3 py-2 text-sm ${
          stacked ? "w-full" : ""
        } ${SELECT_FOCUS_RING}`}
        aria-label="Sort products"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
