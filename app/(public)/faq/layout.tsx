import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_faq_title"), getSetting("seo_faq_desc")]);
  return {
    title: title || "FAQ",
    description: desc || "Frequently asked questions about booking, cancellations, preparation, payments, aftercare, and skincare products at Ethereal Skin Haven.",
  };
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
