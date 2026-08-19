import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // حزمة تشغيل ذاتية الاكتفاء (server.js + الحد الأدنى من node_modules) —
  // مناسبة للنشر على VPS عادي بدل الاعتماد على منصّة مُدارة (Vercel).
  // راجع deploy/deploy.sh لخطوة نسخ public/ و.next/static جنبها بعد البناء.
  output: "standalone",
};

export default nextConfig;
