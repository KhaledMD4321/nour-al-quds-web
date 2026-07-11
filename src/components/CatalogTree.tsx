import Link from "next/link";
import type { StageGroup } from "@/lib/stages";
import { brandHref, categoryHref } from "@/lib/urls";

/**
 * شجرة الكتالوج: مرحلة (تأسيس/تشطيب) ← مصنّع ← فئاته.
 * تُستخدم في قائمة الهيدر (mega-menu) وفي شريط صفحة المنتجات الجانبي.
 */
export function CatalogTree({ catalog }: { catalog: StageGroup[] }) {
  return (
    <div className="ctree">
      {catalog.map(({ stage, groups }) =>
        groups.length > 0 ? (
          <div key={stage} className="ctree__stage">
            <div className="ctree__stagename">{stage}</div>
            <div className="ctree__brands">
              {groups.map(({ brand, categories }) => (
                <div key={brand.id} className="ctree__brand">
                  <Link href={brandHref(brand)} className="ctree__brandname">
                    {brand.name}
                  </Link>
                  <ul>
                    {categories.map((c) => (
                      <li key={c.id}>
                        <Link href={categoryHref(c)}>{c.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ) : null,
      )}
    </div>
  );
}
