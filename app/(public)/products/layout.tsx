import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_products_title"), getSetting("seo_products_desc")]);
  return {
    title: title || "Professional Skincare Products — Shop Online",
    description: desc || "Shop esthetician-recommended skincare: Esthemax, Starpil, Bushbalm & more. Professional-grade products for every skin type, available in Couva, Trinidad.",
    alternates: { canonical: "https://etherealskinhaven.com/products" },
    openGraph: { title: title || "Skincare Products | Ethereal Skin Haven", description: desc || "Shop esthetician-recommended skincare: Esthemax, Starpil, Bushbalm & more. Available in Couva, Trinidad.", url: "https://etherealskinhaven.com/products" },
    twitter: { card: "summary", title: title || "Skincare Products | Ethereal Skin Haven", description: desc || "Shop professional-grade skincare recommended by our estheticians in Trinidad." },
  };
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
