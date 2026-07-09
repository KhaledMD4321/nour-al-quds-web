import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * Resolver الصور المحلي: /img/{brandSlug}/{sku}.webp
 * يقرأ من مجلد `product-images/` في جذر المشروع. لو الملف مش موجود → 404،
 * والـ <ProductImage> بيرجع لـ placeholder الهوية. إضافة ملف = ظهور تلقائي.
 */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ brand: string; file: string }> },
) {
  const { brand, file } = await ctx.params;

  // حماية من path traversal
  if (brand.includes("..") || file.includes("..") || file.includes("/")) {
    return new NextResponse("Bad request", { status: 400 });
  }

  const fullPath = path.join(process.cwd(), "product-images", brand, file);
  try {
    const buf = await readFile(fullPath);
    return new NextResponse(new Uint8Array(buf), {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
