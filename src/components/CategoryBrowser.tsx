"use client";

import { useMemo, useState } from "react";
import type { Product, Availability } from "@/types/erp";
import { ProductCard } from "./ProductCard";
import { availabilityMeta } from "./Badge";
import { WaIcon } from "./WaIcon";
import { site, waLink } from "@/lib/site";

type SortKey = "newest" | "name";

const AVAIL_ORDER: Availability[] = ["in_stock", "on_request", "out_of_stock"];

export function CategoryBrowser({ products }: { products: Product[] }) {
  const [brands, setBrands] = useState<Set<number>>(new Set());
  const [avail, setAvail] = useState<Set<Availability>>(new Set());
  const [sort, setSort] = useState<SortKey>("newest");

  // عدّادات ثابتة من كامل الفئة (مش من المفلتر)
  const brandOptions = useMemo(() => {
    const m = new Map<number, { name: string; count: number }>();
    for (const p of products) {
      if (!p.brand) continue;
      const e = m.get(p.brand.id) ?? { name: p.brand.name, count: 0 };
      e.count++;
      m.set(p.brand.id, e);
    }
    return [...m.entries()].map(([id, v]) => ({ id, ...v }));
  }, [products]);

  const availOptions = useMemo(() => {
    const m = new Map<Availability, number>();
    for (const p of products) m.set(p.availability, (m.get(p.availability) ?? 0) + 1);
    return AVAIL_ORDER.filter((a) => m.has(a)).map((a) => ({
      key: a,
      label: availabilityMeta(a).label,
      count: m.get(a) ?? 0,
    }));
  }, [products]);

  const shown = useMemo(() => {
    let list = products.filter((p) => {
      if (brands.size > 0 && (!p.brand || !brands.has(p.brand.id))) return false;
      if (avail.size > 0 && !avail.has(p.availability)) return false;
      return true;
    });
    list = [...list].sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name, "ar")
        : b.updated_at.localeCompare(a.updated_at),
    );
    return list;
  }, [products, brands, avail, sort]);

  function toggle<T>(set: Set<T>, value: T, apply: (s: Set<T>) => void) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    apply(next);
  }

  return (
    <div className="catlayout">
      <aside className="filters">
        <h5>تصفية النتائج</h5>

        {brandOptions.length > 0 && (
          <div className="fgrp">
            <div className="fgrp__t">العلامة التجارية</div>
            {brandOptions.map((b) => (
              <label key={b.id} className="fopt">
                <input
                  type="checkbox"
                  checked={brands.has(b.id)}
                  onChange={() => toggle(brands, b.id, setBrands)}
                />
                {b.name}
                <span className="ct num">{b.count}</span>
              </label>
            ))}
          </div>
        )}

        <div className="fgrp">
          <div className="fgrp__t">التوافر</div>
          {availOptions.map((a) => (
            <label key={a.key} className="fopt">
              <input
                type="checkbox"
                checked={avail.has(a.key)}
                onChange={() => toggle(avail, a.key, setAvail)}
              />
              {a.label}
              <span className="ct num">{a.count}</span>
            </label>
          ))}
        </div>

        <a
          className="btn btn--wa btn--full btn--sm"
          style={{ marginTop: 18 }}
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WaIcon /> لم تجد ما تبحث عنه؟
        </a>
      </aside>

      <div>
        <div className="toolbar">
          <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
            عرض <b style={{ color: "var(--ink)" }} className="num">{shown.length}</b> من{" "}
            <span className="num">{products.length}</span> صنف
          </span>
          <select
            aria-label="ترتيب"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="newest">الأحدث</option>
            <option value="name">حسب الاسم</option>
          </select>
        </div>

        {shown.length > 0 ? (
          <div className="prods prods--3">
            {shown.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h3>لا توجد منتجات مطابقة للتصفية</h3>
            <p>جرّب توسيع التصفية أو تواصل معنا عبر واتساب.</p>
            <a className="btn btn--wa" href={waLink()} target="_blank" rel="noopener noreferrer">
              <WaIcon /> تواصل مع {site.name}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
