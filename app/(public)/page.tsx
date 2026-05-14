import type { Metadata } from "next";
import { getSetting } from "@/lib/services/settings";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import FeaturedServices from "@/components/home/FeaturedServices";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Testimonials from "@/components/home/Testimonials";
import HomeCTA from "@/components/home/HomeCTA";
import SchemaMarkup, { LOCAL_BUSINESS_SCHEMA } from "@/components/seo/SchemaMarkup";
import InstagramFeed from "@/components/home/InstagramFeed";

export async function generateMetadata(): Promise<Metadata> {
  const [title, desc] = await Promise.all([getSetting("seo_home_title"), getSetting("seo_home_desc")]);
  return {
    title: title || "Luxury Spa & Esthetics in Couva, Trinidad",
    description: desc || "Book luxury facials, waxing, brow lamination & nail services in Couva, Trinidad. Open Tuesday–Saturday, 9am–6pm. Easy online booking.",
    openGraph: { title: title || "Ethereal Skin Haven — Luxury Spa & Esthetics", description: desc || "Book luxury facials, waxing, brow lamination & nail services in Couva, Trinidad. Open Tue–Sat, 9am–6pm." },
  };
}

export default function HomePage() {
  return (
    <>
      <SchemaMarkup schema={LOCAL_BUSINESS_SCHEMA} />
      <Hero />
      <StatsBar />
      <FeaturedServices />
      <FeaturedProducts />
      <Testimonials />
      <InstagramFeed />
      <HomeCTA />
    </>
  );
}
