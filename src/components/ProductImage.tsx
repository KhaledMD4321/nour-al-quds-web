"use client";

import { useState } from "react";
import { ProductTypeArt } from "./ProductTypeArt";

/**
 * سلسلة صور المنتج (per API_CONTRACT / website-CLAUDE):
 *   1) image_url من الـ API
 *   2) resolver محلي: /img/{brandSlug}/{code}.webp
 *   3) رسمة توضيحية حسب نوع المنتج (كوع/ماسورة/تي…) على الهوية
 * إضافة ملف صورة لاحقاً "تشتغل" أوتوماتيكياً بدون تغيير بيانات.
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
  const candidate =
    imageUrl ?? (brandSlug && code ? `/img/${brandSlug}/${code}.webp` : null);
  const [failed, setFailed] = useState(false);
  const showReal = Boolean(candidate) && !failed;

  return (
    <>
      {showReal && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="real"
          src={candidate as string}
          alt={name}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
      <span className="ph">
        <ProductTypeArt name={name} />
      </span>
    </>
  );
}
