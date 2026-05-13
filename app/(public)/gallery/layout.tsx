import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_gallery_title"), getSetting("seo_gallery_desc")]);
  return {
    title: title || "Gallery",
    description: desc || "Browse our gallery of treatment results and spa atmosphere at Ethereal Skin Haven.",
  };
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
