/**
 * كشف نوع المنتج من اسمه — لاختيار رسمة توضيحية مناسبة (كوع/ماسورة/تي…).
 * الأنواع عامة عبر كل المصنّعين: «كوع = كوع» بغضّ النظر عن المصنّع.
 * الكلمات المفتاحية مستخرجة من أسماء المنتجات الفعلية في الكتالوج.
 */
export type ProductType =
  | "pipe"
  | "elbow"
  | "tee"
  | "coupling"
  | "reducer"
  | "cap"
  | "valve"
  | "mixer"
  | "strainer"
  | "drain"
  | "fitting";

function normalize(s: string): string {
  return s
    .replace(/[إأآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, " ")
    .trim();
}

// الترتيب من الأخصّ للأعمّ. الكلمات مُطبَّعة مسبقاً (ا / ه / ي).
const RULES: { type: ProductType; keywords: string[] }[] = [
  { type: "mixer", keywords: ["بطاريه", "خلاط", "خلاطات", "مخلط"] },
  { type: "valve", keywords: ["محبس", "مانع", "صمام", "سكينه", "بلف"] },
  { type: "strainer", keywords: ["صفايه", "مصفاه", "شبك", "فلتر"] },
  { type: "drain", keywords: ["وش", "بلاعه", "شفاط", "بالوعه", "صفايه ارضيه"] },
  { type: "elbow", keywords: ["كوع", "كرنك", "زاويه"] },
  { type: "tee", keywords: ["تي", "تى", "تيه", "مشترك"] },
  { type: "reducer", keywords: ["مسلوب", "مخفض", "تحويله", "رديوس"] },
  { type: "cap", keywords: ["طبه", "غطاء", "سداده", "كوره"] },
  { type: "coupling", keywords: ["جلبه", "وصله", "لاكور", "بوش", "بسن", "كوبلن", "نبل", "سن", "علايه"] },
  { type: "pipe", keywords: ["ماسوره", "مواسير", "بيبه", "انبوب", "متر", "يارده"] },
];

export function detectProductType(name: string): ProductType {
  const norm = normalize(name);
  const first = norm.split(" ")[0] ?? "";
  const words = norm.split(" ");

  for (const { type, keywords } of RULES) {
    if (
      keywords.some(
        (k) => first === k || first.startsWith(k) || words.includes(k),
      )
    ) {
      return type;
    }
  }

  return "fitting";
}
