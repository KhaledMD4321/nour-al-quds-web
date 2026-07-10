import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { FileText, Info } from "lucide-react";
import { getProduct, getRelatedProducts } from "@/lib/erp";
import { parseIdFromParam, productHref, categoryHref } from "@/lib/urls";
import { ProductCard } from "@/components/ProductCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Badge, availabilityMeta } from "@/components/Badge";
import { WaIcon } from "@/components/WaIcon";
import { SectionHead } from "@/components/SectionHead";
import { site, waLink, waProductMessage } from "@/lib/site";
import type { Availability } from "@/types/erp";

export const revalidate = 300;

type Params = { slug: string };

// كتالوج كبير (1500+ منتج): مفيش prerender وقت البناء — كل منتج يُرندَر عند أول طلب
// ويُخزَّن بالـ ISR (revalidate 300، dynamicParams افتراضياً true). الـ sitemap بيسرد كلهم للفهرسة.
export async function generateStaticParams() {
  return [];
}

const AVAIL_LABEL: Record<Availability, string> = {
  in_stock: "متوفر في المخزون",
  on_request: "حسب الطلب",
  out_of_stock: "غير متوفر حالياً",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = parseIdFromParam(slug);
  const product = id ? await getProduct(id) : null;
  if (!product) return { title: "المنتج غير موجود" };
  const title = product.brand ? `${product.name} — ${product.brand.name}` : product.name;
  return {
    title,
    description:
      product.description ?? `${product.name} من نور القدس — اسأل عن السعر والتوافر عبر واتساب.`,
    alternates: { canonical: productHref(product) },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const id = parseIdFromParam(slug);
  if (!id) notFound();

  const product = await getProduct(id);
  if (!product) notFound();

  const canonical = `${product.id}-${product.slug}`;
  if (slug !== canonical) redirect(productHref(product));

  const related = await getRelatedProducts(product.related_product_ids);
  const waMsg = waProductMessage(product.name, product.code);

  // JSON-LD Product schema (offers فقط لو السعر ظاهر — دايماً مخفي هنا)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    ...(product.brand ? { brand: { "@type": "Brand", name: product.brand.name } } : {}),
    sku: product.code,
    ...(product.description ? { description: product.description } : {}),
    ...(product.price_visibility && product.price != null
      ? {
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: product.currency,
            availability:
              product.availability === "in_stock"
                ? "https://schema.org/InStock"
                : product.availability === "on_request"
                  ? "https://schema.org/PreOrder"
                  : "https://schema.org/OutOfStock",
          },
        }
      : {}),
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="wrap">
        <Breadcrumb
          items={[
            { label: "الرئيسية", href: "/" },
            ...(product.category
              ? [{ label: product.category.name, href: categoryHref(product.category) }]
              : []),
            { label: product.name },
          ]}
        />

        <div className="pdp" style={{ paddingTop: 14 }}>
          <div>
            <div className="pdp__main">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="ph" src="/brand/symbol_white.png" alt="" aria-hidden="true" />
            </div>
            <div className="pdp__thumbs">
              <div className="pdp__thumb on" />
              <div className="pdp__thumb" />
              <div className="pdp__thumb" />
              <div className="pdp__thumb" />
            </div>
          </div>

          <div className="pdp__info">
            <Badge availability={product.availability} label={AVAIL_LABEL[product.availability]} />
            <h1>{product.name}</h1>
            <div className="pdp__row">
              <span className="pdp__code" dir="ltr">
                {product.code}
              </span>
              {product.brand?.slug === "nassar" && (
                <span className="chip-gold">وكيل نصّار الحصري</span>
              )}
            </div>
            {product.description && <p className="pdp__desc">{product.description}</p>}

            {product.specs.length > 0 && (
              <div className="specs">
                {product.specs.map((s, i) => (
                  <div key={i} className="specs__row">
                    <span className="k">{s.label}</span>
                    <span className="v">{s.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="pdp__actions">
              <a className="btn btn--wa btn--lg" href={waLink(waMsg)} target="_blank" rel="noopener noreferrer">
                <WaIcon /> اسأل عن السعر والتوافر
              </a>
              <a className="btn btn--outline btn--lg" href={waLink(waMsg)} target="_blank" rel="noopener noreferrer">
                <FileText aria-hidden="true" /> اطلب عرض سعر
              </a>
            </div>

            <div className="note">
              <Info aria-hidden="true" />
              <span>
                الأسعار تتغيّر حسب السوق، لذلك لا نعرض سعرًا ثابتًا. تواصل معنا عبر واتساب لمعرفة
                السعر الحالي والتوافر الفوري للكميات.
              </span>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <section className="sec" style={{ paddingTop: 0 }}>
            <SectionHead eyebrow="Related" title="منتجات ذات صلة" />
            <div className="prods">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
