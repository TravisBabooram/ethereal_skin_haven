import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";
import SchemaMarkup, { LOCAL_BUSINESS_SCHEMA } from "@/components/seo/SchemaMarkup";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_contact_title"), getSetting("seo_contact_desc")]);
  return {
    title: title || "Contact Us — Ethereal Skin Haven, Couva Trinidad",
    description: desc || "Reach Ethereal Skin Haven in Couva, Trinidad. Call, WhatsApp, or message us online. Open every day, 8am–6pm. Book your treatment today.",
  };
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaMarkup schema={LOCAL_BUSINESS_SCHEMA} />
      {children}
    </>
  );
}
