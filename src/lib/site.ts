/**
 * إعدادات الموقع المركزية — بيانات الشركة وقنوات التواصل.
 * أرقام الواتساب/الهاتف placeholder لحد ما تتأكد من الأرقام الحقيقية.
 */
export const site = {
  name: "نور القدس",
  fullName: "نور القدس للأدوات الصحية وأنظمة المياه",
  // عنوان الموقع للـ SEO (canonical/sitemap/OG) — بدّله بالدومين الحقيقي أو اضبط NEXT_PUBLIC_SITE_URL
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nour-al-quds.example",
  tagline: "المنتج المناسب، بقيمة مناسبة، وتوريد تعتمد عليه.",
  description:
    "شركة متخصصة في تجارة وتوزيع الأدوات الصحية وأنظمة المياه — مقرّها الواسطى ببني سويف، وتشحن لكل محافظات مصر منذ ٢٠١١. وكيل نصّار الحصري.",
  since: "٢٠١١",
  location: "الواسطى، بني سويف",
  shipping: "شحن لكل محافظات مصر",
  hours: "السبت–الخميس ٩ص–٨م",
  // رابط خرائط جوجل — استعلام عام بالمنطقة؛ بدّله برابط الـ pin الدقيق للفرع لما يتوفر
  mapsUrl: "https://maps.google.com/?q=" + encodeURIComponent("الواسطى بني سويف"),
  // أرقام placeholder — بدّلها بالأرقام الحقيقية
  phone: "+201000000000",
  phoneDisplay: "٠١٠٠ ٠٠٠ ٠٠٠٠",
  whatsapp: "201000000000",
  waDefaultMessage: "السلام عليكم، أريد الاستفسار عن سعر وتوافر منتج.",
} as const;

/**
 * دوال نقية تُبنى على إعدادات ديناميكية (من الـ CMS) — تستخدمها المكوّنات التي
 * تستقبل الإعدادات كـ props أو عبر getSiteConfig().
 */
export interface WaConfig {
  number: string;
  defaultMessage: string;
}

export function buildWaLink(whatsapp: string, message: string): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}

export function buildWaProductMessage(
  defaultMessage: string,
  name: string,
  code?: string | null,
): string {
  let msg = `${defaultMessage} ${name}`;
  if (code) msg += ` (كود: ${code})`;
  return msg;
}

/** يبني رابط واتساب بالإعدادات الثابتة — fallback للمواضع غير المتصلة بالـ CMS. */
export function waLink(message?: string): string {
  const text = message ?? site.waDefaultMessage;
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;
}

/** رسالة واتساب مخصّصة لمنتج (تُلحق الاسم + الكود + الرابط لو متاح). */
export function waProductMessage(
  name: string,
  code?: string | null,
  url?: string,
): string {
  let msg = `${site.waDefaultMessage} ${name}`;
  if (code) msg += ` (كود: ${code})`;
  if (url) msg += ` — ${url}`;
  return msg;
}
