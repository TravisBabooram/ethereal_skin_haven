import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_gallery_title"), getSetting("seo_gallery_desc")]);
  return {
    title: title || "Treatment Results Gallery — Before & After",
    description: desc || "See real results from our luxury spa services — facials, waxing, brow lamination & more at Ethereal Skin Haven in Couva, Trinidad.",
    alternates: { canonical: "https://etherealskinhaven.com/gallery" },
    openGraph: { title: title || "Results Gallery | Ethereal Skin Haven", description: desc || "See real results from our luxury spa services — facials, waxing, brow lamination & more in Couva, Trinidad.", url: "https://etherealskinhaven.com/gallery" },
    twitter: { card: "summary_large_image", title: title || "Results Gallery | Ethereal Skin Haven", description: desc || "See real before & after results from Ethereal Skin Haven in Couva, Trinidad." },
  };
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
