import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review items in your NexusGadgets shopping cart.",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold text-slate-900">Your Cart</h1>
      <CartView />
    </div>
  );
}
