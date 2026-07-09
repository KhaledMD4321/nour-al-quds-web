import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCategory, getCategories, getProducts, getBrands } from "@/lib/erp";
import { parseIdFromParam, categoryHref } from "@/lib/urls";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { WaIcon } from "@/components/WaIcon";
import { site, waLink } from "@/lib/site";

export const revalidate = 300;

type Params = { slug: string };

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ slug: `${c.id}-${c.slug}` }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = parseIdFromParam(slug);
  const category = id ? await getCategory(id) : null;
  if (!category) return { title: "الفئة غير موجودة" };
  return {
    title: category.name,
    description: `تصفّح منتجات ${category.name} من نور القدس — اسأل عن السعر والتوافر عبر واتساب.`,
    alternates: { canonical: categoryHref(category) },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const id = parseIdFromParam(slug);
  if (!id) notFound();

  const category = await getCategory(id);
  if (!category) notFound();

  // canonical redirect لو الـ slug اتغيّر
  const canonical = `${category.id}-${category.slug}`;
  if (slug !== canonical) redirect(categoryHref(category));

  const [{ data: products, meta }, brands] = await Promise.all([
    getProducts({ category_id: id, per_page: 24 }),
    getBrands(),
  ]);

  return (
    <main className="flex-1">
      <div className="wrap">
        <Breadcrumb
          items={[
            { label: "الرئيسية", href: "/" },
            { label: "المنتجات", href: "/search" },
            { label: category.name },
          ]}
        />

        <div className="catintro">
          <span className="eyebrow">{category.slug}</span>
          <h1>{category.name}</h1>
          <p>
            تشكيلة {category.name} من نصّار وديما وعلامات موثوقة. اسأل عن السعر والتوافر لأي
            صنف عبر واتساب.
          </p>
        </div>

        <div className="catlayout">
          <aside className="filters">
            <h5>تصفية النتائج</h5>
            <div className="fgrp">
              <div className="fgrp__t">العلامة التجارية</div>
              {brands.slice(0, 4).map((b) => (
                <label key={b.id} className="fopt">
                  <input type="checkbox" /> {b.name}
                  <span className="ct num">{b.products_count}</span>
                </label>
              ))}
            </div>
            <div className="fgrp">
              <div className="fgrp__t">التوافر</div>
              <label className="fopt">
                <input type="checkbox" /> متوفر <span className="ct num">72</span>
              </label>
              <label className="fopt">
                <input type="checkbox" /> حسب الطلب <span className="ct num">18</span>
              </label>
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
                عرض <b style={{ color: "var(--ink)" }} className="num">{products.length}</b> من{" "}
                <span className="num">{meta.total}</span> صنف
              </span>
              <select aria-label="ترتيب" defaultValue="newest">
                <option value="newest">الأحدث</option>
                <option value="name">حسب الاسم</option>
              </select>
            </div>

            {products.length > 0 ? (
              <div className="prods prods--3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="empty">
                <h3>لا توجد منتجات في هذه الفئة حالياً</h3>
                <p>تواصل معنا عبر واتساب وسنساعدك في الوصول لما تبحث عنه.</p>
                <a className="btn btn--wa" href={waLink()} target="_blank" rel="noopener noreferrer">
                  <WaIcon /> تواصل مع {site.name}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
