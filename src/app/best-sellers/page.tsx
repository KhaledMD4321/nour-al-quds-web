import type { Metadata } from "next";
import { getProducts } from "@/lib/erp";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { WaIcon } from "@/components/WaIcon";
import { waLink } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "الأكثر طلباً",
  description:
    "الأصناف الأكثر طلباً فعلياً من عملاء نور القدس — مواسير ووصلات وأدوات صحية بتتباع كل يوم. اسأل عن السعر والتوافر عبر واتساب.",
  alternates: { canonical: "/best-sellers" },
};

export default async function BestSellersPage() {
  // الترتيب من مبيعات حقيقية في نظام الشركة (بدون عرض أرقام)
  const { data: products } = await getProducts({ sort: "best_selling", per_page: 24 });

  return (
    <main className="flex-1">
      <div className="wrap">
        <Breadcrumb
          items={[{ label: "الرئيسية", href: "/" }, { label: "الأكثر طلباً" }]}
        />

        <div className="catintro">
          <span className="eyebrow">Best Sellers</span>
          <h1>الأكثر طلباً</h1>
          <p>
            الأصناف دي هي الأكثر طلباً فعلاً من عملائنا — تجار وفنيين وأصحاب بيوت. الترتيب
            متحدّث تلقائياً من حركة البيع الحقيقية.
          </p>
        </div>

        <div style={{ paddingBottom: 60 }}>
          {products.length > 0 ? (
            <div className="prods prods--3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3>القائمة بتتجهّز</h3>
              <p>اسأل عن أي صنف مباشرة عبر واتساب وسنساعدك.</p>
              <a className="btn btn--wa" href={waLink()} target="_blank" rel="noopener noreferrer">
                <WaIcon /> تواصل معنا
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
