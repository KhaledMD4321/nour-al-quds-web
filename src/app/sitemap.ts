import type { MetadataRoute } from "next";
import { getProducts, getCategories, getBrands } from "@/lib/erp";
import { productHref, categoryHref, brandHref } from "@/lib/urls";
import { site } from "@/lib/site";

// يُعاد توليده يومياً (per CLAUDE.md)
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const [{ data: products }, categories, brands] = await Promise.all([
    getProducts({ per_page: 1000 }),
    getCategories(),
    getBrands(),
  ]);
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...categories.map((c) => ({
      url: `${base}${categoryHref(c)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...brands.map((b) => ({
      url: `${base}${brandHref(b)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...products.map((p) => ({
      url: `${base}${productHref(p)}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
