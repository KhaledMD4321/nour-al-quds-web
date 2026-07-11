import type { Metadata } from "next";
import { getProducts, searchProducts, getCatalogByStage } from "@/lib/erp";
import { normalizeArabic } from "@/lib/arabic";
import { ProductCard } from "@/components/ProductCard";
import { CatalogTree } from "@/components/CatalogTree";
import { Breadcrumb } from "@/components/Breadcrumb";
import { WaIcon } from "@/components/WaIcon";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "المنتجات",
  description: "تصفّح كتالوج نور القدس أو ابحث عن منتج بالاسم أو الكود.",
};

type SearchParams = { q?: string };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const isSearching = normalizeArabic(query).length >= 2;

  const [{ data: products, meta }, catalog] = await Promise.all([
    isSearching
      ? searchProducts(query, { per_page: 48 })
      : getProducts({ per_page: 48 }),
    getCatalogByStage(),
  ]);

  const title = isSearching ? `نتائج البحث عن «${query}»` : "كل المنتجات";

  return (
    <main className="flex-1">
      <div className="wrap">
        <Breadcrumb
          items={[{ label: "الرئيسية", href: "/" }, { label: "المنتجات" }]}
        />

        <div className="catintro">
          <span className="eyebrow">Catalog</span>
          <h1>{title}</h1>
          <p>
            {isSearching
              ? `${meta.total} نتيجة — الأسعار تتغيّر حسب السوق، اسأل عبر واتساب لمعرفة السعر الحالي.`
              : "الأسعار تتغيّر حسب السوق — اسأل عبر واتساب لمعرفة السعر والتوافر لأي صنف."}
          </p>
        </div>

        <div className="shop" style={{ paddingBottom: 60 }}>
          <aside className="shop__side">
            <div className="shop__sidehead">تصفّح الكتالوج</div>
            <CatalogTree catalog={catalog} />
          </aside>

          <div className="shop__main">
            {products.length > 0 ? (
              <div className="prods prods--3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="empty">
                <h3>لا توجد نتائج مطابقة</h3>
                <p>
                  جرّب كلمة أبسط أو اسأل عنها مباشرة عبر واتساب وسنساعدك في الوصول إليها.
                </p>
                <a className="btn btn--wa" href={waLink()} target="_blank" rel="noopener noreferrer">
                  <WaIcon /> اسأل عبر واتساب
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
