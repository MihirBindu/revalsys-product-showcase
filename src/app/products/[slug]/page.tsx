import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllSlugs,
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/products";
import { absoluteUrl } from "@/lib/site";
import Badge from "@/components/ui/Badge";
import PriceTag from "@/components/product/PriceTag";
import SpecTable from "@/components/product/SpecTable";
import AddToCartButton from "@/components/product/AddToCartButton";
import ProductCard from "@/components/products/ProductCard";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.name,
    description: product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getRelatedProducts(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: product.brand },
    image: absoluteUrl(product.image),
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/products/${product.slug}`),
      priceCurrency: "INR",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: 1,
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
        <Link href="/products" className="hover:text-slate-700">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-slate-700">{product.category}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-indigo-600">{product.brand}</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">{product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Badge tone="info">★ {product.rating.toFixed(1)}</Badge>
            <Badge tone={product.inStock ? "success" : "danger"}>
              {product.inStock ? "In stock" : "Out of stock"}
            </Badge>
          </div>

          <PriceTag price={product.price} className="text-3xl font-extrabold text-slate-900" />

          <p className="text-slate-600">{product.description}</p>

          <div>
            <AddToCartButton product={product} size="lg" />
          </div>

          <div>
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Specifications</h2>
            <SpecTable specs={product.specs} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
