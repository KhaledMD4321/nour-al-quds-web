import type { Product } from "@/types/erp";
import { site } from "@/lib/site";

const AVAILABILITY_PHRASE: Record<Product["availability"], string> = {
  in_stock: "متوفّر في المخزون",
  on_request: "يتوفّر حسب الطلب",
  out_of_stock: "غير متوفّر حالياً",
};

/**
 * وصف عربي مُولَّد من حقول المنتج الموجودة أصلاً (الاسم/المصنّع/الفئة/الكود/التوفّر)
 * — بدون أي مجهود يدوي. يُستخدم في صفحة المنتج + meta description + JSON-LD.
 * الـ ERP يرجّع description = null، فالموقع هو اللي يبني نصاً مفيداً للـ SEO.
 */
export function productDescription(p: Product): string {
  const brand = p.brand ? ` من ${p.brand.name}` : "";
  const category = p.category ? `، ضمن فئة ${p.category.name}` : "";
  const availability = AVAILABILITY_PHRASE[p.availability] ?? "";

  return (
    `${p.name}${brand}${category}. ` +
    `كود المنتج ${p.code}. ` +
    `${availability} لدى ${site.fullName} — نوفّره بأسعار الجملة مع ${site.shipping}. ` +
    `للسعر الحالي والتوافر تواصل عبر واتساب.`
  );
}
