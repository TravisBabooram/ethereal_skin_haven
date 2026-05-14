import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";
import SchemaMarkup from "@/components/seo/SchemaMarkup";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_services_title"), getSetting("seo_services_desc")]);
  return {
    title: title || "Spa Services — Facials, Waxing & Brow Lamination",
    description: desc || "Explore luxury esthetics treatments in Couva, Trinidad — HydraFacials, Brazilian waxing, brow lamination, intimate care & nail services. Book online.",
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
