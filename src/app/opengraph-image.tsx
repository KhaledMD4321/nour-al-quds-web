/* هذا الملف يُرسَم بمحرّك satori (ImageResponse) لإنتاج ملف PNG — مش DOM متصفح.
   فقواعد next/image و alt غير منطبقة هنا: satori بيدعم <img> فقط. */
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * صورة المشاركة (og:image) — اللي بتظهر لما حد يبعت لينك الموقع على واتساب
 * أو فيسبوك. اللوجو المعكوس على خلفية الهوية الكحلية.
 *
 * مبنية بالصورة فقط بدون نص: ImageResponse بيحتاج ملف خط مرفق عشان يرسم عربي،
 * واللوجو نفسه فيه اسم الشركة — فالنتيجة أوضح وأخف بلا تعقيد.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "نور القدس للأدوات الصحية وأنظمة المياه";

export default async function OpengraphImage() {
  const logo = await readFile(
    path.join(process.cwd(), "public", "brand", "lockup_horizontal_reversed.png"),
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  const pattern = await readFile(
    path.join(process.cwd(), "public", "brand", "pattern-arch.svg"),
  );
  const patternSrc = `data:image/svg+xml;base64,${pattern.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          background: "linear-gradient(150deg, #0D1B33 0%, #10314a 60%, #0f4e57 140%)",
        }}
      >
        {/* نقش الهوية — خافت */}
        <img
          src={patternSrc}
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, opacity: 0.07, objectFit: "cover" }}
        />
        {/* شريط ذهبي سفلي زي حدود الهيرو في الموقع */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 1200,
            height: 12,
            background: "#C49A3F",
          }}
        />
        <img src={logoSrc} width={760} height={253} style={{ position: "relative" }} />
      </div>
    ),
    size,
  );
}
