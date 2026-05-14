import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_faq_title"), getSetting("seo_faq_desc")]);
  return {
    title: title || "Frequently Asked Questions — Ethereal Skin Haven",
    description: desc || "Find answers about booking, cancellations, preparation, payments, aftercare & skincare products at Ethereal Skin Haven in Couva, Trinidad.",
  };
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
