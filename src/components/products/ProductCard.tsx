import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import Badge from "@/components/ui/Badge";
import PriceTag from "@/components/product/PriceTag";
import AddToCartButton from "@/components/product/AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-md">
      {/* A convenience click target for pointer users. Hidden from assistive
          tech and skipped in the tab order because the title link below points
          at the same product — otherwise every card announces twice. */}
      <Link
        href={`/products/${product.slug}`}
        className="block"
        aria-hidden="true"
        tabIndex={-1}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {!product.inStock && (
            <span className="absolute left-2 top-2">
              <Badge tone="danger">Out of stock</Badge>
            </span>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/products/${product.slug}`}>
            <h3 className="text-sm font-semibold text-slate-900 hover:text-indigo-600">
              {product.name}
            </h3>
          </Link>
          <Badge tone="info">★ {product.rating.toFixed(1)}</Badge>
        </div>
        <p className="text-xs text-slate-500">{product.brand}</p>
        <p className="line-clamp-2 text-sm text-slate-600">{product.shortDescription}</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <PriceTag price={product.price} className="text-base font-bold text-slate-900" />
          <AddToCartButton product={product} size="sm" />
        </div>
      </div>
    </article>
  );
}
