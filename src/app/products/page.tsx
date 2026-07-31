import type { Metadata } from "next";
import { Suspense } from "react";
import SearchBar from "@/components/products/SearchBar";
import FilterSidebar from "@/components/products/FilterSidebar";
import FilterPanel from "@/components/products/FilterPanel";
import SortDropdown from "@/components/products/SortDropdown";
import ProductGrid from "@/components/products/ProductGrid";
import ActiveFilters from "@/components/products/ActiveFilters";
import ResultsStatus from "@/components/products/ResultsStatus";
import PendingOverlay from "@/components/products/PendingOverlay";
import { FilterNavigationProvider } from "@/components/products/FilterNavigationContext";
import { getBrands, searchProducts } from "@/lib/products";
import {
  parseCategory,
  parseSort,
  type ProductSearchParams,
} from "@/lib/productQuery";

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Search and filter laptops, audio, wearables, smartphones, cameras and accessories at NexusGadgets.",
  alternates: { canonical: "/products" },
};

interface ProductsPageProps {
  searchParams: Promise<ProductSearchParams>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const brands = getBrands();

  const products = searchProducts({
    query: params.q,
    category: parseCategory(params.category),
    brand: params.brand ?? "All",
    inStockOnly: params.inStock === "1",
    sort: parseSort(params.sort),
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Suspense fallback={null}>
        <FilterNavigationProvider>
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">All Products</h1>
            <ResultsStatus count={products.length} />
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
            <div className="flex flex-col gap-4">
              <SearchBar />
              <FilterPanel>
                <FilterSidebar brands={brands} />
              </FilterPanel>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <ActiveFilters />
                <div className="ml-auto">
                  <SortDropdown />
                </div>
              </div>
              <PendingOverlay>
                <ProductGrid products={products} />
              </PendingOverlay>
            </div>
          </div>
        </FilterNavigationProvider>
      </Suspense>
    </div>
  );
}
