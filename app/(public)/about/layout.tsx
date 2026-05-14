import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_about_title"), getSetting("seo_about_desc")]);
  return {
    title: title || "About Us — Our Story & Licensed Esthetician",
    description: desc || "Meet the qualified esthetician behind Ethereal Skin Haven — trained, passionate about skin care, and dedicated to luxury results in Couva, Trinidad.",
  };
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
