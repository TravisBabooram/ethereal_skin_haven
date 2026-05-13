import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";
import SchemaMarkup from "@/components/seo/SchemaMarkup";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_services_title"), getSetting("seo_services_desc")]);
  return {
    title: title || "Our Services",
    description: desc || "Explore our luxury spa treatments: facials, waxing, intimate care, brow lamination, and nail services — all professionally performed in Trinidad.",
  };
}

const SERVICES_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Ethereal Skin Haven Services",
  "description": "Luxury esthetics services in Couva, Trinidad",
  "provider": {
    "@type": "BeautySalon",
    "name": "Ethereal Skin Haven",
    "telephone": "+18687057023",
    "address": { "@type": "PostalAddress", "addressLocality": "Couva", "addressCountry": "TT" },
  },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SchemaMarkup schema={SERVICES_SCHEMA} />
      {children}
    </>
  );
}
