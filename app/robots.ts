import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://etherealskinhaven.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/services", "/products", "/about", "/contact", "/booking", "/gallery", "/faq", "/policies", "/privacy-policy"],
        disallow: ["/admin", "/dashboard", "/api"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
