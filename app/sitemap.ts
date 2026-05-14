import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://etherealskinhaven.com";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                          lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/services`,            lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/products`,            lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${base}/about`,               lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`,             lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/gallery`,             lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${base}/faq`,                 lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/policies`,            lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/privacy-policy`,      lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  try {
    const services = await prisma.service.findMany({ select: { id: true, updatedAt: true } });
    const products = await prisma.product.findMany({ select: { id: true, updatedAt: true } });
    const serviceRoutes: MetadataRoute.Sitemap = services.map(s => ({
      url: `${base}/services#${s.id}`,
      lastModified: s.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
    const productRoutes: MetadataRoute.Sitemap = products.map(p => ({
      url: `${base}/products#${p.id}`,
      lastModified: p.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));
    return [...staticRoutes, ...serviceRoutes, ...productRoutes];
  } catch {
    return staticRoutes;
  }
}
