import type { Brand, Category } from "@/types/erp";

/**
 * المرحلة فوق المصنّع (زي sebakashop): تأسيس / تشطيب.
 * لا يوجد حقل «مرحلة» في الـ ERP، فنشتقّها من المصنّع عبر خريطة بسيطة.
 * كل المصنّعين الحاليين تأسيس؛ عند إضافة موردي تشطيب (خلاطات/أطقم) نضيف slug-هم.
 */
export type Stage = "تأسيس" | "تشطيب";

export const STAGES: Stage[] = ["تأسيس", "تشطيب"];

const BRAND_STAGE: Record<string, Stage> = {
  nsar: "تأسيس", // نصار
  "aygyk-egic": "تأسيس", // إيجيك EGIC
  "dyma-thyrm": "تأسيس", // ديما ثيرم
};

export function brandStage(brandSlug: string): Stage {
  return BRAND_STAGE[brandSlug] ?? "تأسيس";
}

/** وصف قصير لكل مرحلة (للعرض في العنوان). */
export const STAGE_INTRO: Record<Stage, string> = {
  تأسيس: "مواسير التغذية والصرف والوصلات — أساس الشبكة قبل التشطيب.",
  تشطيب: "أطقم حمامات وخلاطات وأدوات صحية — قريباً على الموقع.",
};

export type BrandGroup = { brand: Brand; categories: Category[] };
export type StageGroup = { stage: Stage; groups: BrandGroup[] };
