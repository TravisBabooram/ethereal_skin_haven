import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_products_title"), getSetting("seo_products_desc")]);
  return {
    title: title || "Professional Skincare Products — Shop Online",
    description: desc || "Shop esthetician-recommended skincare: Esthemax, Starpil, Bushbalm & more. Professional-grade products for every skin type, available in Couva, Trinidad.",
  };
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
