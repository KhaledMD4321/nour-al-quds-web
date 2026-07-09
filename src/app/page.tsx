import Link from "next/link";
import {
  BadgeCheck,
  LayoutGrid,
  Truck,
  ArrowLeft,
  Warehouse,
  ShieldCheck,
  Handshake,
  FileText,
} from "lucide-react";
import { getCategories, getBrands, getFeaturedProducts } from "@/lib/erp";
import { ProductCard } from "@/components/ProductCard";
import { CategoryTile } from "@/components/CategoryTile";
import { SectionHead } from "@/components/SectionHead";
import { WaIcon } from "@/components/WaIcon";
import { brandHref } from "@/lib/urls";
import { site, waLink } from "@/lib/site";

export const revalidate = 300;

export default async function HomePage() {
  const [categories, brands, featured] = await Promise.all([
    getCategories(),
    getBrands(),
    getFeaturedProducts(4),
  ]);

  return (
    <main className="flex-1">
      {/* HERO */}
      <section className="hero">
        <div className="wrap hero__in">
          <div>
            <span className="hero__eyebrow">
              <BadgeCheck aria-hidden="true" /> وكيل نصّار الحصري في بني سويف · منذ {site.since}
            </span>
            <h1>
              المنتج المناسب، بقيمة مناسبة، <em>وتوريد تعتمد عليه</em>
            </h1>
            <p className="hero__sub">
              مواسير ووصلات، أنظمة مياه، أطقم حمامات وخلاطات — بأسعار الجملة وتوريد سريع يغطّي
              محافظة بني سويف بالكامل. للتجار والمقاولين والفنيين والأفراد.
            </p>
            <div className="hero__cta">
              <Link className="btn btn--gold btn--lg" href="/search">
                <LayoutGrid aria-hidden="true" /> تصفّح المنتجات
              </Link>
              <a className="btn btn--wa btn--lg" href={waLink()} target="_blank" rel="noopener noreferrer">
                <WaIcon /> اسأل عن السعر والتوافر
              </a>
            </div>
            <div className="hero__stats">
              <div>
                <div className="v num">{site.since}</div>
                <div className="l">خبرة في السوق منذ</div>
              </div>
              <div className="x" />
              <div>
                <div className="v num">+٥٠٠٠</div>
                <div className="l">صنف متوفر</div>
              </div>
              <div className="x" />
              <div>
                <div className="v">بني سويف</div>
                <div className="l">تغطية كاملة</div>
              </div>
            </div>
          </div>
          <div className="hero__art">
            <div className="hero__card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/symbol_white.png" alt="" />
              <div className="hero__tag">
                <Truck aria-hidden="true" />
                <div>
                  <b>توريد سريع للمشاريع والكميات</b>
                  <span>تغطية كل مراكز المحافظة</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AUDIENCE SPLIT */}
      <section id="audience" className="sec wrap">
        <SectionHead
          eyebrow="Two ways we serve you"
          title="وحدتان تحت اسم واحد"
          note="قوة توزيع للتجار والمشاريع، ومعرض يساعدك تجهّز بيتك — بنفس الجودة والثقة."
        />
        <div className="aud">
          <div className="aud__card aud--dist">
            <div className="pat" />
            <div className="rel">
              <span className="aud__lab">للتجار والمقاولين والفنيين</span>
              <h3>نور القدس للتوزيع</h3>
              <p>
                مخزون قوي، علامات تجارية موثوقة، وتوريد سريع للكميات الكبيرة. خدمة الجملة
                والمشاريع في كل أنحاء المحافظة.
              </p>
              <div className="aud__btns">
                <Link className="btn btn--gold" href="/search">
                  خدمات التوزيع
                </Link>
                <a className="btn btn--lighton" href={waLink()} target="_blank" rel="noopener noreferrer">
                  تواصل مع مندوب
                </a>
              </div>
            </div>
          </div>
          <div className="aud__card aud--show">
            <div className="pat" />
            <div className="rel">
              <span className="aud__lab">لتجهيز وتشطيب المنزل</span>
              <h3>معرض نور القدس</h3>
              <p>
                أطقم حمامات وخلاطات وفلاتر بأنماط حديثة وميزانيات مختلفة — مع مساعدتك في اختيار
                المنتجات المناسبة لبيتك.
              </p>
              <div className="aud__btns">
                <Link className="btn btn--gold" href="/search">
                  جهّز منزلك
                </Link>
                <a className="btn btn--lighton" href={waLink()} target="_blank" rel="noopener noreferrer">
                  احجز زيارة
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="sec wrap" style={{ paddingTop: 0 }}>
        <SectionHead
          eyebrow="Product Categories"
          title="تصفّح حسب الفئة"
          action={
            <Link className="btn btn--ghost" href="/search">
              كل الفئات <ArrowLeft aria-hidden="true" />
            </Link>
          }
        />
        <div className="cats">
          {categories.map((c) => (
            <CategoryTile key={c.id} category={c} />
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <SectionHead
          eyebrow="New & Featured"
          title="منتجات مختارة"
          note="الأسعار تتغيّر حسب السوق — اسأل عبر واتساب لمعرفة السعر الحالي."
        />
        <div className="prods">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section className="sec--tight wrap">
        <SectionHead eyebrow="Trusted Brands" title="علامات نتعامل معها" />
        <div className="brands">
          {brands.map((b) => (
            <Link key={b.id} className="brand" href={brandHref(b)}>
              {b.name}
              {b.slug === "nassar" && <span className="tag">وكيل حصري</span>}
            </Link>
          ))}
        </div>
      </section>

      {/* TRUST BAND */}
      <section id="trust" className="trust">
        <div className="wrap trust__in">
          <div className="tstat">
            <div className="ic">
              <Warehouse aria-hidden="true" />
            </div>
            <div className="v">مخزون كبير</div>
            <div className="l">منظّم وجاهز للتسليم</div>
          </div>
          <div className="tstat">
            <div className="ic">
              <Truck aria-hidden="true" />
            </div>
            <div className="v">توريد سريع</div>
            <div className="l">تغطية كل بني سويف</div>
          </div>
          <div className="tstat">
            <div className="ic">
              <ShieldCheck aria-hidden="true" />
            </div>
            <div className="v">علامات موثوقة</div>
            <div className="l">منتجات بمواصفات صحيحة</div>
          </div>
          <div className="tstat">
            <div className="ic">
              <Handshake aria-hidden="true" />
            </div>
            <div className="v">منذ {site.since}</div>
            <div className="l">خبرة في السوق المحلي</div>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="sec wrap">
        <div className="ctaband">
          <div className="ctaband__in">
            <div>
              <h2>محتاج عرض سعر لمشروع أو كمية؟</h2>
              <p>ابعت لنا قائمة احتياجاتك وفريق التوزيع يرجّعلك بالأسعار والتوافر بسرعة.</p>
            </div>
            <div className="ctaband__btns">
              <a className="btn btn--gold btn--lg" href={waLink()} target="_blank" rel="noopener noreferrer">
                <FileText aria-hidden="true" /> اطلب عرض سعر
              </a>
              <Link className="btn btn--lighton btn--lg" href="/search">
                تصفّح الكتالوج
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
