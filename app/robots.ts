import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://etherealskinhaven.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/services", "/products", "/about", "/contact", "/gallery", "/faq", "/policies"],
        disallow: ["/admin", "/dashboard", "/api", "/booking"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
