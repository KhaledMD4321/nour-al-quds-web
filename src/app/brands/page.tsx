import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, PackageCheck } from "lucide-react";
import { getBrands } from "@/lib/erp";
import { getBrandInfo } from "@/lib/brandInfo";
import { brandHref } from "@/lib/urls";
import { Breadcrumb } from "@/components/Breadcrumb";
import { WaIcon } from "@/components/WaIcon";
import { site, waLink } from "@/lib/site";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "العلامات التجارية — المصنّعون اللي بنتعامل معهم",
  description:
    "العلامات التجارية المتوفرة لدى نور القدس: نصّار (وكيل حصري)، إيجيك EGIC، وديما ثيرم — منتجات أصلية بضمان المصنّع وشحن لكل محافظات مصر.",
  alternates: { canonical: "/brands" },
};

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <main className="flex-1">
      <div className="wrap">
        <Breadcrumb items={[{ label: "الرئيسية", href: "/" }, { label: "العلامات التجارية" }]} />

        <div className="catintro">
          <span className="eyebrow">Brands</span>
          <h1>العلامات التجارية</h1>
          <p>
            بنتعامل مع مصنّعين موثوقين ونوردّ منتجاتهم أصلية مباشرة — وكالة حصرية وتوزيع
            معتمد، بضمان المصنّع وشحن لكل محافظات مصر.
          </p>
        </div>

        <div className="brandgrid" style={{ paddingBottom: 40 }}>
          {brands.map((b) => {
            const info = getBrandInfo(b.slug);
            const isExclusive = b.name.includes("نصار");
            return (
              <Link key={b.id} className="brandcard" href={brandHref(b)}>
                <div className="brandcard__top">
                  <span className="brandcard__ic"><PackageCheck aria-hidden="true" /></span>
                  {isExclusive && <span className="tag">وكيل حصري</span>}
                </div>
                <h2>{b.name}</h2>
                {info && <p className="brandcard__tag">{info.tagline}</p>}
                <div className="brandcard__foot">
                  <span className="num">{b.products_count} صنف</span>
                  <span className="brandcard__go">
                    تصفّح المنتجات <ArrowLeft aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="post__cta" style={{ marginBottom: 60 }}>
          <div>
            <b>بتدوّر على علامة معيّنة؟</b>
            <span>لو محتاج منتج من ماركة مش موجودة هنا، اسألنا وهنشوفلك.</span>
          </div>
          <a className="btn btn--wa" href={waLink()} target="_blank" rel="noopener noreferrer">
            <WaIcon /> اسأل {site.name}
          </a>
        </div>
      </div>
    </main>
  );
}
