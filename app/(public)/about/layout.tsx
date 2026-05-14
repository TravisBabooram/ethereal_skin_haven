import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_about_title"), getSetting("seo_about_desc")]);
  return {
    title: title || "About Us — Our Story & Licensed Esthetician",
    description: desc || "Meet the qualified esthetician behind Ethereal Skin Haven — trained, passionate about skin care, and dedicated to luxury results in Couva, Trinidad.",
    alternates: { canonical: "https://etherealskinhaven.com/about" },
    openGraph: { title: title || "About Ethereal Skin Haven", description: desc || "Meet the qualified esthetician behind Ethereal Skin Haven — dedicated to luxury skin care results in Couva, Trinidad.", url: "https://etherealskinhaven.com/about" },
    twitter: { card: "summary", title: title || "About Ethereal Skin Haven", description: desc || "Meet the esthetician behind Ethereal Skin Haven — luxury spa in Couva, Trinidad." },
  };
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
