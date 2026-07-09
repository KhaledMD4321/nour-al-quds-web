import Link from "next/link";
import { WaIcon } from "@/components/WaIcon";
import { waLink } from "@/lib/site";

export default function NotFound() {
  return (
    <main className="flex-1 wrap">
      <div className="empty" style={{ padding: "100px 20px" }}>
        <h3>الصفحة غير موجودة</h3>
        <p>ربما تغيّر الرابط أو أن الصفحة لم تعد متاحة.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="btn btn--navy" href="/">
            العودة للرئيسية
          </Link>
          <a className="btn btn--wa" href={waLink()} target="_blank" rel="noopener noreferrer">
            <WaIcon /> تواصل عبر واتساب
          </a>
        </div>
      </div>
    </main>
  );
}
