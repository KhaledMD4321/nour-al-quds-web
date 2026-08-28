"use client";

import { useState } from "react";
import { ProductTypeArt } from "./ProductTypeArt";

/**
 * صورة المنتج.
 *
 * الواقع الحالي: مفيش صور منتجات مرفوعة، والرسمة حسب النوع (كوع/ماسورة/تي…)
 * هي العرض الأساسي مش بديل مؤقت. عشان كده مابنجرّبش مسارات صور تخمينية —
 * كانت بتعمل طلبين فاشلين لكل كارت (48 طلب في صفحة بـ24 منتج) على راوت سيرفر
 * بيقرأ من القرص، مقابل صفر فائدة.
 *
 * الترتيب دلوقتي:
 *   1) image_url القادم من الـ ERP (جدول product_web_images) — لو اتضافت صورة
 *      من لوحة التحكم بتظهر فوراً من غير أي تعديل كود.
 *   2) resolver الملفات المحلية `/img/{brand}/{code}.webp` — اختياري، يتفعّل بـ
 *      NEXT_PUBLIC_PRODUCT_IMAGE_RESOLVER=1 لما يبقى فيه ملفات في product-images/.
 *   3) الرسمة حسب النوع (دايماً موجودة كخلفية).
 */
const RESOLVER_ENABLED = process.env.NEXT_PUBLIC_PRODUCT_IMAGE_RESOLVER === "1";

export function ProductImage({
  imageUrl,
  brandSlug,
  code,
  name,
}: {
  imageUrl: string | null;
  brandSlug: string | null;
  code: string | null;
  name: string;
}) {
  const candidates = [
    imageUrl,
    RESOLVER_ENABLED && brandSlug && code ? `/img/${brandSlug}/${code}.webp` : null,
  ].filter((x): x is string => Boolean(x));

  const [idx, setIdx] = useState(0);
  const current = candidates[idx] ?? null;

  return (
    <>
      {current && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="real"
          src={current}
          alt={name}
          loading="lazy"
          onError={() => setIdx((i) => i + 1)}
        />
      )}
      <span className="ph">
        <ProductTypeArt name={name} />
      </span>
    </>
  );
}
