import type { Metadata } from "next";
import Hero from "@/components/home/Hero";
import FeaturedGrid from "@/components/home/FeaturedGrid";
import { getFeaturedProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "NexusGadgets | Electronics Showcase",
  description:
    "Discover featured laptops, audio, wearables, smartphones, cameras and accessories at NexusGadgets.",
};

export default function HomePage() {
  const featured = getFeaturedProducts(8);

  return (
    <>
      <Hero />
      <FeaturedGrid products={featured} />
    </>
  );
}
