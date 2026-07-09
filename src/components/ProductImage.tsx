"use client";

import { useState } from "react";

/**
 * سلسلة صور المنتج (per API_CONTRACT / website-CLAUDE):
 *   1) image_url من الـ API
 *   2) resolver محلي: /img/{brandSlug}/{sku}.webp
 *   3) placeholder على الهوية (رمز نور القدس على خلفية navy)
 * إضافة ملف صورة لاحقاً "تشتغل" أوتوماتيكياً بدون تغيير بيانات.
 */
export function ProductImage({
  imageUrl,
  brandSlug,
  sku,
  name,
}: {
  imageUrl: string | null;
  brandSlug: string | null;
  sku: string | null;
  name: string;
}) {
  const candidate =
    imageUrl ?? (brandSlug && sku ? `/img/${brandSlug}/${sku}.webp` : null);
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="ph"
        src="/brand/symbol_white.png"
        alt=""
        aria-hidden="true"
      />
    </>
  );
}
