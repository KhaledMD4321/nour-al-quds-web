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
    "شركة متخصصة في تجارة وتوزيع الأدوات الصحية وأنظمة المياه، تخدم بني سويف منذ ٢٠١١. وكيل نصّار الحصري.",
  since: "٢٠١١",
  location: "الواسطى، بني سويف",
  hours: "السبت–الخميس ٩ص–٨م",
  // أرقام placeholder — بدّلها بالأرقام الحقيقية
  phone: "+201000000000",
  phoneDisplay: "٠١٠٠ ٠٠٠ ٠٠٠٠",
  whatsapp: "201000000000",
  waDefaultMessage: "السلام عليكم، أريد الاستفسار عن سعر وتوافر منتج.",
} as const;

/** يبني رابط واتساب مع رسالة مبدئية (اختياري إلحاق اسم/كود المنتج). */
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
