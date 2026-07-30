import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review items in your NexusGadgets shopping cart.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Your Cart</h1>
      {/* The catalog is resolved on the server and passed down, so cart lines
          always render current prices without shipping the data layer to the
          client. */}
      <CartView catalog={getAllProducts()} />
    </div>
  );
}
