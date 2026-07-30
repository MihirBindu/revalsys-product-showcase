import type { Metadata } from "next";
import { Suspense } from "react";
import SearchBar from "@/components/products/SearchBar";
import FilterSidebar from "@/components/products/FilterSidebar";
import SortDropdown from "@/components/products/SortDropdown";
import ProductGrid from "@/components/products/ProductGrid";
import { getBrands, searchProducts, type SortOption } from "@/lib/products";
import type { Category } from "@/types/product";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Search and filter laptops, audio, wearables, smartphones, cameras and accessories at NexusGadgets.",
};

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    inStock?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const brands = getBrands();

  const products = searchProducts({
    query: params.q,
    category: (params.category as Category | "All") ?? "All",
    brand: params.brand ?? "All",
    inStockOnly: params.inStock === "1",
    sort: (params.sort as SortOption) ?? "featured",
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">All Products</h1>
        <p className="mt-1 text-slate-600">
          {products.length} product{products.length === 1 ? "" : "s"} available
        </p>
      </header>

      <Suspense fallback={null}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
          <div className="flex flex-col gap-6">
            <SearchBar />
            <FilterSidebar brands={brands} />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex justify-end">
              <SortDropdown />
            </div>
            <ProductGrid products={products} />
          </div>
        </div>
      </Suspense>
    </div>
  );
}
