import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";
import SchemaMarkup, { getLocalBusinessSchema } from "@/components/seo/SchemaMarkup";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_contact_title"), getSetting("seo_contact_desc")]);
  return {
    title: title || "Contact Us — Ethereal Skin Haven, Couva Trinidad",
    description: desc || "Reach Ethereal Skin Haven in Couva, Trinidad. Call, WhatsApp, or message us online. Open every day, 8am–6pm. Book your treatment today.",
    alternates: { canonical: "https://etherealskinhaven.com/contact" },
    openGraph: { title: title || "Contact Ethereal Skin Haven", description: desc || "Reach us in Couva, Trinidad — call, WhatsApp, or message us. Open every day, 8am–6pm.", url: "https://etherealskinhaven.com/contact" },
    twitter: { card: "summary", title: title || "Contact Ethereal Skin Haven", description: desc || "Reach Ethereal Skin Haven in Couva, Trinidad. Open every day, 8am–6pm." },
  };
}

export default async function ContactLayout({ children }: { children: React.ReactNode }) {
  const schema = await getLocalBusinessSchema();
  return (
    <>
      <SchemaMarkup schema={schema} />
      {children}
    </>
  );
}
