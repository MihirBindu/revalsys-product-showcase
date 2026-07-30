import Link from "next/link";
import type { Product } from "@/types/product";
import ProductCard from "@/components/products/ProductCard";

export default function FeaturedGrid({ products }: { products: Product[] }) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Featured products</h2>
          <p className="mt-1 text-slate-600">Hand-picked picks across every category.</p>
        </div>
        <Link href="/products" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">
          View all &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
