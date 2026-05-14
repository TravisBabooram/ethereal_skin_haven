import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_gallery_title"), getSetting("seo_gallery_desc")]);
  return {
    title: title || "Treatment Results Gallery — Before & After",
    description: desc || "See real results from our luxury spa services — facials, waxing, brow lamination & more at Ethereal Skin Haven in Couva, Trinidad.",
  };
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
