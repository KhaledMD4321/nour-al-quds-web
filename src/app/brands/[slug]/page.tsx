import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { Download, Globe, FileText, BadgeCheck, ExternalLink, PackageCheck } from "lucide-react";
import { getBrand, getBrands, getCategories, getProducts } from "@/lib/erp";
import { getCmsBrandInfo, getSiteConfig } from "@/lib/cms";
import { type BrandLinkKind } from "@/lib/brandInfo";
import { parseIdFromParam, brandHref } from "@/lib/urls";
import { ProductCard } from "@/components/ProductCard";
import { CategoryTile } from "@/components/CategoryTile";
import { SectionHead } from "@/components/SectionHead";
import { Breadcrumb } from "@/components/Breadcrumb";
import { WaIcon } from "@/components/WaIcon";
import { buildWaLink } from "@/lib/site";

const LINK_ICON: Record<BrandLinkKind, typeof Globe> = {
  site: Globe,
  catalog: FileText,
  quality: BadgeCheck,
};

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

  const [{ data: products, meta }, allCategories, info, site] = await Promise.all([
    getProducts({ brand_id: id, per_page: 24 }),
    getCategories(),
    getCmsBrandInfo(brand.slug),
    getSiteConfig(),
  ]);
  const brandCategories = allCategories.filter((c) => c.brand?.id === brand.id);
  const isExclusive = brand.name.includes("نصار");
  const waCfg = { number: site.whatsapp, defaultMessage: site.waDefaultMessage };
  const waLink = () => buildWaLink(site.whatsapp, site.waDefaultMessage);

  return (
    <main className="flex-1">
      <div className="wrap">
        <Breadcrumb
          items={[
            { label: "الرئيسية", href: "/" },
            { label: "العلامات التجارية", href: "/brands" },
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

        {brandCategories.length > 0 && (
          <section className="sec" style={{ paddingTop: 8 }}>
            <SectionHead eyebrow="Categories" title={`فئات ${brand.name}`} />
            <div className="cats">
              {brandCategories.map((c) => (
                <CategoryTile key={c.id} category={c} />
              ))}
            </div>
          </section>
        )}

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
                <ProductCard key={p.id} product={p} waCfg={waCfg} />
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

        {/* عن المصنّع — قسم ثانوي للزائر المهتم */}
        {info && (
          <section className="brandabout" aria-label={`عن ${brand.name}`}>
            <div className="brandabout__head">
              <span className="benefit__ic"><PackageCheck aria-hidden="true" /></span>
              <div>
                <h2>عن {brand.name}</h2>
                <span className="brandabout__tag">{info.tagline}</span>
              </div>
            </div>

            <div className="brandabout__body">
              {info.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="brandabout__cols">
              <div>
                <h3>خطوط الإنتاج والأنظمة</h3>
                <ul>
                  {info.lines.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>الجودة والثقة</h3>
                <ul>
                  {info.quality.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>

            {info.links.length > 0 && (
              <div className="brandabout__links">
                {info.links.map((link, i) => {
                  const Icon = LINK_ICON[link.kind];
                  return (
                    <a
                      key={i}
                      className="btn btn--outline btn--sm"
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon aria-hidden="true" /> {link.label}{" "}
                      <ExternalLink aria-hidden="true" className="ext" />
                    </a>
                  );
                })}
              </div>
            )}

            <p className="brandabout__note">
              كل منتجات {brand.name} المعروضة هنا أصلية وموردة من المصنّع مباشرة عبر نور القدس.
              {brand.catalog_pdf_url ? "" : " للكتالوجات وشهادات الجودة التفصيلية، تواصل معنا عبر واتساب."}
            </p>
          </section>
        )}
      </div>
    </main>
  );
}
