import { cache } from "react";
import { erpFetch } from "@/lib/erp";
import { site } from "@/lib/site";
import { BLOG_POSTS, type BlogPost } from "@/lib/blog";
import { FAQS, type Faq } from "@/lib/faqs";
import { getBrandInfo, type BrandInfo, type BrandLink } from "@/lib/brandInfo";

/**
 * طبقة محتوى الـ CMS — المالك يدير المحتوى من لوحة الـ ERP، والموقع يقرأه من
 * /content/* بالـ ISR فتظهر التعديلات خلال دقائق بدون إعادة نشر.
 *
 * قاعدة الأمان: أي endpoint فاضي أو واقع ⇒ نرجع للمحتوى المشحون في الكود
 * (fallback) — فالـ CMS الفاضي أو العطل المؤقت لا يفرّغ الموقع أبداً.
 * server-only (تُستدعى من Server Components فقط).
 */

const useErp = () => process.env.DATA_SOURCE === "erp";

// ── إعدادات الموقع (بيانات التواصل والنصوص العامة) ─────────────────────────────

export type SiteConfig = typeof site;

/** مفاتيح الـ CMS → حقول site (خريطة صريحة عشان أي مفتاح غريب يتجاهَل بأمان). */
const SETTING_KEYS: Record<string, keyof SiteConfig> = {
  tagline: "tagline",
  description: "description",
  location: "location",
  hours: "hours",
  shipping: "shipping",
  phone: "phone",
  phone_display: "phoneDisplay",
  whatsapp: "whatsapp",
  wa_default_message: "waDefaultMessage",
  maps_url: "mapsUrl",
};

/** الإعدادات المدمجة (ثوابت الهوية من الكود + قيم الـ CMS فوقها). cache() يمنع التكرار في نفس الرندر. */
export const getSiteConfig = cache(async (): Promise<SiteConfig> => {
  if (!useErp()) return site;
  try {
    const res = await erpFetch<{ data: Record<string, string | null> }>("/content/settings");
    const merged: Record<string, unknown> = { ...site };
    for (const [key, field] of Object.entries(SETTING_KEYS)) {
      const value = res.data[key];
      if (typeof value === "string" && value.trim() !== "") merged[field] = value;
    }
    return merged as SiteConfig;
  } catch {
    return site; // الـ ERP واقع مؤقتاً — الثوابت المشحونة تكفي
  }
});

// ── المقالات ────────────────────────────────────────────────────────────────

interface CmsPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  read_minutes: number;
  sections: { heading: string | null; paragraphs: string[] }[];
}

const arabicDate = (iso: string): string =>
  new Intl.DateTimeFormat("ar-EG", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(iso),
  );

export const getBlogPosts = cache(async (): Promise<BlogPost[]> => {
  if (!useErp()) return BLOG_POSTS;
  try {
    const res = await erpFetch<{ data: CmsPost[] }>("/content/posts");
    if (res.data.length === 0) return BLOG_POSTS;
    return res.data.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      date: p.date,
      dateDisplay: arabicDate(p.date),
      readMinutes: p.read_minutes,
      sections: p.sections.map((s) => ({
        heading: s.heading ?? undefined,
        paragraphs: s.paragraphs,
      })),
    }));
  } catch {
    return BLOG_POSTS;
  }
});

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

// ── الأسئلة الشائعة ─────────────────────────────────────────────────────────

interface CmsFaq {
  question: string;
  answer: string;
  show_on_home: boolean;
}

export const getFaqs = cache(async (): Promise<(Faq & { showOnHome: boolean })[]> => {
  const withFlag = (faqs: Faq[]) => faqs.map((f, i) => ({ ...f, showOnHome: i < 4 }));
  if (!useErp()) return withFlag(FAQS);
  try {
    const res = await erpFetch<{ data: CmsFaq[] }>("/content/faqs");
    if (res.data.length === 0) return withFlag(FAQS);
    return res.data.map((f) => ({ q: f.question, a: f.answer, showOnHome: f.show_on_home }));
  } catch {
    return withFlag(FAQS);
  }
});

export async function getHomeFaqs(): Promise<Faq[]> {
  const faqs = await getFaqs();
  const home = faqs.filter((f) => f.showOnHome);
  return (home.length > 0 ? home : faqs).slice(0, 4);
}

// ── نبذات المصنّعين ─────────────────────────────────────────────────────────

interface CmsBrandInfo {
  brand: { id: number; name: string; slug: string };
  tagline: string;
  paragraphs: string[];
  lines: string[];
  quality: string[];
  links: BrandLink[];
}

const getBrandInfos = cache(async (): Promise<CmsBrandInfo[] | null> => {
  if (!useErp()) return null;
  try {
    const res = await erpFetch<{ data: CmsBrandInfo[] }>("/content/brand-info");
    return res.data.length > 0 ? res.data : null;
  } catch {
    return null;
  }
});

export async function getCmsBrandInfo(slug: string): Promise<BrandInfo | null> {
  const infos = await getBrandInfos();
  const hit = infos?.find((i) => i.brand.slug === slug);
  if (!hit) return getBrandInfo(slug); // fallback للملف المشحون
  return {
    slug: hit.brand.slug,
    tagline: hit.tagline,
    paragraphs: hit.paragraphs,
    lines: hit.lines,
    quality: hit.quality,
    links: hit.links,
  };
}
