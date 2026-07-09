import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = site.url.replace(/\/$/, "");
  return {
    // نتائج البحث و resolver الصور مش للفهرسة
    rules: { userAgent: "*", allow: "/", disallow: ["/search", "/img/"] },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
