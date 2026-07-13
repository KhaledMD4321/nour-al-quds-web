import type { MetadataRoute } from "next";
import { getAllProducts, getCategories, getBrands } from "@/lib/erp";
import { productHref, categoryHref, brandHref } from "@/lib/urls";
import { BLOG_POSTS } from "@/lib/blog";
import { site } from "@/lib/site";

// يُعاد توليده يومياً (per CLAUDE.md)
export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, "");
  const [products, categories, brands] = await Promise.all([
    getAllProducts(),
    getCategories(),
    getBrands(),
  ]);
  const now = new Date();

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    // الصفحات الثابتة
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/brands`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/distribution`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/showroom`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/best-sellers`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...BLOG_POSTS.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
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
