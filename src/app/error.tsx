"use client";

import { useEffect } from "react";
import { WaIcon } from "@/components/WaIcon";
import { site, waLink } from "@/lib/site";

/**
 * حدّ الخطأ للجذر — بيظهر لو فشل تحميل البيانات على بداية باردة (الـ ERP مش متاح
 * ومفيش نسخة ISR مخزّنة). على الصفحات المخزّنة، Next بيخدم النسخة القديمة تلقائياً
 * فمش بيوصل هنا. الهدف: صفحة مهذّبة على الهوية بدل صفحة مكسورة.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Catalog render error:", error);
  }, [error]);

  return (
    <main className="flex-1 wrap">
      <div className="empty" style={{ padding: "100px 20px" }}>
        <h3>حصلت مشكلة مؤقتة في تحميل البيانات</h3>
        <p>ممكن تعيد المحاولة، أو تتواصل معنا مباشرة على واتساب وهنساعدك فوراً.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn btn--navy" onClick={() => reset()}>
            إعادة المحاولة
          </button>
          <a className="btn btn--wa" href={waLink()} target="_blank" rel="noopener noreferrer">
            <WaIcon /> تواصل مع {site.name}
          </a>
        </div>
      </div>
    </main>
  );
}
