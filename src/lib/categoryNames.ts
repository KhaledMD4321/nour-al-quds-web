/**
 * أسماء عرض مفهومة لفئات EGIC ذات الرموز (BR/SM/KS) — تعيين عرضي فقط.
 * الـ id والـ slug القادمين من الـ API لا يتغيّران (الروابط تبقى ثابتة).
 * القيم مؤكّدة من المالك + موقع EGIC الرسمي (بانينجر تغذية / كيسيل + سمارت هوم صرف).
 */
const OVERRIDES: Record<string, string> = {
  "EGIC - BR": "بانينجر — تغذية مياه",
  "EGIC - SM": "سمارت هوم — صرف PVC",
  "EGIC - KS": "كيسيل — صرف PP",
};

export function categoryDisplayName(name: string): string {
  return OVERRIDES[name.trim()] ?? name;
}
