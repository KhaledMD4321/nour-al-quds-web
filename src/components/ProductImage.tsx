"use client";

import { useState } from "react";
import { ProductTypeArt } from "./ProductTypeArt";
import { detectProductType } from "@/lib/productType";

/**
 * سلسلة صور المنتج (تجرَّب بالترتيب، وأي فشل ينتقل للتالي):
 *   1) image_url من الـ API
 *   2) صورة المنتج بالكود:  /img/{brandSlug}/{code}.webp
 *   3) صورة حقيقية بالنوع:  /img/types/{type}.webp   ← ارفع ~15 صورة تغطّي الكل
 *   4) رسمة توضيحية حسب النوع (دايماً كخلفية)
 * إضافة أي ملف صورة لاحقاً «تشتغل» أوتوماتيكياً بدون تغيير كود أو بيانات.
 */
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
  const type = detectProductType(name);
  const candidates = [
    imageUrl,
    brandSlug && code ? `/img/${brandSlug}/${code}.webp` : null,
    `/img/types/${type}.webp`,
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
