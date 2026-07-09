import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Download } from "lucide-react";
import { getBrand, getBrands, getProducts } from "@/lib/erp";
import { parseIdFromParam, brandHref } from "@/lib/urls";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { WaIcon } from "@/components/WaIcon";
import { site, waLink } from "@/lib/site";

export const revalidate = 300;

type Params = { slug: string };

export async function generateStaticParams() {
  const brands = await getBrands();
  return brands.map((b) => ({ slug: `${b.id}-${b.slug}` }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = parseIdFromParam(slug);
  const brand = id ? await getBrand(id) : null;
  if (!brand) return { title: "العلامة غير موجودة" };
  return {
    title: `منتجات ${brand.name}`,
    description: `تصفّح منتجات ${brand.name} المتوفرة لدى نور القدس.`,
    alternates: { canonical: brandHref(brand) },
  };
}

export default async function BrandPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const id = parseIdFromParam(slug);
  if (!id) notFound();

  const brand = await getBrand(id);
  if (!brand) notFound();

  const canonical = `${brand.id}-${brand.slug}`;
  if (slug !== canonical) redirect(brandHref(brand));

  const { data: products, meta } = await getProducts({ brand_id: id, per_page: 24 });
  const isExclusive = brand.slug === "nassar";

  return (
    <main className="flex-1">
      <div className="wrap">
        <Breadcrumb
          items={[
            { label: "الرئيسية", href: "/" },
            { label: "العلامات" },
            { label: brand.name },
          ]}
        />

        <div className="catintro">
          <span className="eyebrow">Brand</span>
          <h1>
            {brand.name}
            {isExclusive && (
              <span className="chip-gold" style={{ marginInlineStart: 12, verticalAlign: "middle" }}>
                وكيل حصري
              </span>
            )}
          </h1>
          <p>
            منتجات {brand.name} المتوفرة لدى نور القدس. اسأل عن السعر والتوافر لأي صنف عبر واتساب.
          </p>
          {brand.catalog_pdf_url && (
            <a
              className="btn btn--outline btn--sm"
              style={{ marginTop: 14 }}
              href={brand.catalog_pdf_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download aria-hidden="true" /> تحميل كتالوج {brand.name}
            </a>
          )}
        </div>

        <div style={{ paddingBottom: 60 }}>
          <div className="toolbar">
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>
              عرض <b style={{ color: "var(--ink)" }} className="num">{products.length}</b> من{" "}
              <span className="num">{meta.total}</span> صنف
            </span>
          </div>

          {products.length > 0 ? (
            <div className="prods prods--3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <h3>لا توجد منتجات لهذه العلامة حالياً</h3>
              <p>تواصل معنا عبر واتساب وسنساعدك.</p>
              <a className="btn btn--wa" href={waLink()} target="_blank" rel="noopener noreferrer">
                <WaIcon /> تواصل مع {site.name}
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
