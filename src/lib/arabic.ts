/**
 * تطبيع النص العربي للبحث — مطابق لـ API_CONTRACT.md §5.5.
 * (يُطبَّق على الاستعلام وعلى النص المفهرس معاً)
 */
export function normalizeArabic(input: string): string {
  return input
    .replace(/[ً-ْٰ]/g, "") // تشكيل (tashkeel)
    .replace(/ـ/g, "") // تطويل (tatweel)
    .replace(/[أإآ]/g, "ا") // توحيد الألف
    .replace(/ة/g, "ه") // ة → ه
    .replace(/ى/g, "ي") // ى → ي
    .replace(/\s+/g, " ") // ضغط المسافات
    .trim()
    .toLowerCase();
}
