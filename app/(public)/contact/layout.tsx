import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";
import SchemaMarkup, { LOCAL_BUSINESS_SCHEMA } from "@/components/seo/SchemaMarkup";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_contact_title"), getSetting("seo_contact_desc")]);
  return {
    title: title || "Contact Us",
    description: desc || "Get in touch with Ethereal Skin Haven. Find our location, hours, phone number, and social media — or send us a message.",
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
