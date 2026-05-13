import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_products_title"), getSetting("seo_products_desc")]);
  return {
    title: title || "Professional Skincare Products",
    description: desc || "Shop professional-grade skincare products recommended by our estheticians — Esthemax, Starpil, Bushbalm, and more.",
  };
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
