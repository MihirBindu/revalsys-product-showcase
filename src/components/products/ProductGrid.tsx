import type { Product } from "@/types/product";
import ProductCard from "@/components/products/ProductCard";
import ClearFiltersButton from "@/components/products/ClearFiltersButton";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-300 py-16 text-center">
        <p className="text-lg font-semibold text-slate-900">No products found</p>
        <p className="text-sm text-slate-500">Try adjusting your search or filters.</p>
        {/* Without this the empty state is a dead end — the only way back was
            to hunt through the sidebar and undo each filter by hand. */}
        <ClearFiltersButton className="mt-2 border border-indigo-200 bg-indigo-50 px-4 py-2 hover:bg-indigo-100">
          Clear all filters
        </ClearFiltersButton>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
