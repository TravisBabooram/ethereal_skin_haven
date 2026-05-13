import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_about_title"), getSetting("seo_about_desc")]);
  return {
    title: title || "About Us",
    description: desc || "Meet the esthetician behind Ethereal Skin Haven — our story, qualifications, and commitment to luxury skin care in Trinidad.",
  };
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
