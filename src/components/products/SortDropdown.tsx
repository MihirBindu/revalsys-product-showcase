"use client";

import { useSearchParams } from "next/navigation";
import { useFilterNavigation } from "@/components/products/FilterNavigationContext";

const options: { value: string; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating" },
  { value: "name-asc", label: "Name: A to Z" },
];

export default function SortDropdown() {
  const searchParams = useSearchParams();
  const { updateParams } = useFilterNavigation();
  const activeSort = searchParams.get("sort") ?? "featured";

  function handleChange(value: string) {
    updateParams((params) => {
      if (value === "featured") {
        params.delete("sort");
      } else {
        params.set("sort", value);
      }
    });
  }

  return (
    <label className="flex shrink-0 items-center gap-2 text-sm text-slate-600">
      Sort by
      <select
        value={activeSort}
        onChange={(e) => handleChange(e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
