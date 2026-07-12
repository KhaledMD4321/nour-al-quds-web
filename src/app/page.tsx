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
  Store,
} from "lucide-react";
import { getCatalogByStage, getProducts } from "@/lib/erp";
import { STAGE_INTRO } from "@/lib/stages";
import { HOME_FAQS } from "@/lib/faqs";
import { ProductCard } from "@/components/ProductCard";
import { CategoryTile } from "@/components/CategoryTile";
import { SectionHead } from "@/components/SectionHead";
import { WaIcon } from "@/components/WaIcon";
import { brandHref, categoryHref } from "@/lib/urls";
import { site, waLink } from "@/lib/site";

export const revalidate = 300;

export default async function HomePage() {
  const [catalogByStage, { data: bestSellers }] = await Promise.all([
    getCatalogByStage(),
    getProducts({ sort: "best_selling", per_page: 4 }),
  ]);
  const brands = catalogByStage.flatMap((s) => s.groups.map((g) => g.brand));

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
              مواسير ووصلات، أنظمة مياه، أطقم حمامات وخلاطات — بأسعار الجملة. مقرّنا الواسطى ببني
              سويف، ونشحن لكل محافظات مصر. للتجار والمقاولين والفنيين والأفراد.
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
                <div className="v">كل مصر</div>
                <div className="l">شحن وتوصيل</div>
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
                  <span>شحن وتوصيل لكل محافظات مصر</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS STRIP */}
      <section className="wrap benefits">
        <div className="benefit">
          <span className="benefit__ic"><Truck aria-hidden="true" /></span>
          <div>
            <b>شحن لكل محافظات مصر</b>
            <span>توصيل سريع للطلبات والكميات</span>
          </div>
        </div>
        <div className="benefit">
          <span className="benefit__ic"><Store aria-hidden="true" /></span>
          <div>
            <b>استلام من الفرع</b>
            <span>الواسطى، بني سويف</span>
          </div>
        </div>
        <div className="benefit">
          <span className="benefit__ic"><ShieldCheck aria-hidden="true" /></span>
          <div>
            <b>منتجات أصلية</b>
            <span>علامات موثوقة بمواصفات صحيحة</span>
          </div>
        </div>
        <div className="benefit">
          <span className="benefit__ic"><WaIcon /></span>
          <div>
            <b>دعم واتساب فوري</b>
            <span>أسعار وتوافر لحظي</span>
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
                <Link className="btn btn--gold" href="/distribution">
                  اعرف خدمات التوزيع
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
                <Link className="btn btn--gold" href="/showroom">
                  اعرف خدمة المعرض
                </Link>
                <a className="btn btn--lighton" href={waLink()} target="_blank" rel="noopener noreferrer">
                  احجز زيارة
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAGE QUESTION — دخول سريع بالسؤال (بتأسّس؟ بتشطّب؟) */}
      <section className="sec wrap" style={{ paddingBottom: 0 }}>
        <div className="qsplit">
          <a className="qcard qcard--tasees" href="#stage-tasees">
            <span className="qcard__q">بتأسّس السباكة؟</span>
            <span className="qcard__a">
              مواسير تغذية وصرف ووصلات من نصّار وEGIC وديما ثيرم — بأسعار الجملة
            </span>
            <span className="qcard__go">
              اتفرّج على منتجات التأسيس <ArrowLeft aria-hidden="true" />
            </span>
          </a>
          <a
            className="qcard qcard--tashteeb"
            href={waLink("السلام عليكم، بجهّز تشطيب حمام/مطبخ وحابب أعرف المتاح عندكم من أطقم وخلاطات.")}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="qcard__q">بتشطّب حمامك؟</span>
            <span className="qcard__a">
              أطقم وخلاطات وأدوات صحية في المعرض — والتشكيلة قريباً أونلاين
            </span>
            <span className="qcard__go">
              كلمنا واتساب دلوقتي <ArrowLeft aria-hidden="true" />
            </span>
          </a>
        </div>
      </section>

      {/* CATALOG — مرحلة (تأسيس/تشطيب) ← مصنّع ← فئاته */}
      <section id="categories" className="sec wrap" style={{ paddingTop: 24 }}>
        <SectionHead
          eyebrow="Browse the Catalog"
          title="تصفّح الكتالوج"
          note="حسب المرحلة ثم المصنّع ثم الفئة — تقسيمة واضحة زي أكبر متاجر الأدوات الصحية."
        />
        {catalogByStage.map(({ stage, groups }) => (
          <div
            key={stage}
            id={stage === "تأسيس" ? "stage-tasees" : "stage-tashteeb"}
            className="stage"
          >
            <div className="stage__head">
              <h2 className="stage__name">{stage}</h2>
              <span className="stage__intro">{STAGE_INTRO[stage]}</span>
            </div>

            {groups.length > 0 ? (
              <div className="mfrs">
                {groups.map(({ brand, categories }) => (
                  <div key={brand.id} className="mfr">
                    <div className="mfr__head">
                      <h3 className="mfr__name">
                        {brand.name}
                        {brand.name.includes("نصار") && <span className="tag">وكيل حصري</span>}
                        <span className="mfr__ct num">{brand.products_count} صنف</span>
                      </h3>
                      <Link className="mfr__all" href={brandHref(brand)}>
                        كل منتجات {brand.name} <ArrowLeft aria-hidden="true" />
                      </Link>
                    </div>
                    {/* أشهر ٤ فئات ككروت، والباقي في قائمة منسدلة خفيفة */}
                    <div className="cats">
                      {categories.slice(0, 4).map((c) => (
                        <CategoryTile key={c.id} category={c} />
                      ))}
                    </div>
                    {categories.length > 4 && (
                      <details className="morecats">
                        <summary>
                          عرض باقي فئات {brand.name}
                          <span className="num"> (+{categories.length - 4})</span>
                        </summary>
                        <div className="morecats__chips">
                          {categories.slice(4).map((c) => (
                            <Link key={c.id} className="chipcat" href={categoryHref(c)}>
                              {c.name}
                              <span className="num">{c.products_count}</span>
                            </Link>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="stage__soon">قريباً — نجهّز تشكيلة {stage} كاملة</div>
            )}
          </div>
        ))}
      </section>

      {/* BEST SELLERS — من مبيعات حقيقية */}
      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <SectionHead
          eyebrow="Best Sellers"
          title="الأكثر طلباً"
          note="الأصناف الأكثر طلباً فعلاً من عملائنا — الترتيب من حركة البيع الحقيقية."
          action={
            <Link className="btn btn--ghost" href="/best-sellers">
              شوف الكل <ArrowLeft aria-hidden="true" />
            </Link>
          }
        />
        <div className="prods">
          {bestSellers.map((p) => (
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
              {b.name.includes("نصار") && <span className="tag">وكيل حصري</span>}
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
            <div className="l">شحن لكل محافظات مصر</div>
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

      {/* FAQ — أهم الأسئلة (الكل في /faq) */}
      <section className="sec wrap" style={{ paddingTop: 0 }}>
        <SectionHead
          eyebrow="FAQ"
          title="أسئلة بتتكرر علينا"
          action={
            <Link className="btn btn--ghost" href="/faq">
              كل الأسئلة <ArrowLeft aria-hidden="true" />
            </Link>
          }
        />
        <div className="faq faq--home">
          {HOME_FAQS.map((f, i) => (
            <details key={i} className="faq__item" open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
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
