import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Warehouse, Store, Truck, Handshake, ArrowLeft } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { WaIcon } from "@/components/WaIcon";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "عن نور القدس",
  description:
    "نور القدس للأدوات الصحية وأنظمة المياه — وكيل نصّار الحصري في بني سويف منذ ٢٠١١. وحدة توزيع للتجار والمشاريع ومعرض للأفراد، وشحن لكل محافظات مصر.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <div className="wrap">
        <Breadcrumb items={[{ label: "الرئيسية", href: "/" }, { label: "عن نور القدس" }]} />

        <div className="catintro">
          <span className="eyebrow">About Us</span>
          <h1>عن نور القدس</h1>
          <p>
            من {site.location} لكل محافظات مصر — بنوفّر أدوات السباكة والأدوات الصحية الأصلية
            بأسعار الجملة منذ {site.since}.
          </p>
        </div>

        <article className="post" style={{ paddingTop: 0 }}>
          <section>
            <h2>مين إحنا؟</h2>
            <p>
              نور القدس شركة متخصصة في تجارة وتوزيع الأدوات الصحية وأنظمة المياه، بدأت من
              الواسطى ببني سويف سنة {site.since} وكبرت مع عملائها سنة ورا سنة. النهاردة بنخدم
              التجار والمقاولين والفنيين والأفراد بمخزون دائم من أكتر من ١٥٠٠ صنف، وبنشحن
              لكل محافظات مصر.
            </p>
            <p>
              إحنا <b>وكيل نصّار الحصري في بني سويف</b>، وموزّع معتمد لمنتجات{" "}
              <b>إيجيك EGIC</b> (بانينجر، سمارت هوم، كيسيل) و<b>ديما ثيرم</b> — يعني اللي
              بتشتريه من عندنا واصل من المصنّع مباشرة، أصلي وبضمانه.
            </p>
          </section>

          <section>
            <h2>وحدتان تحت اسم واحد</h2>
            <div className="about__units">
              <div className="about__unit">
                <span className="benefit__ic"><Warehouse aria-hidden="true" /></span>
                <div>
                  <b>نور القدس للتوزيع</b>
                  <p>
                    جملة للتجار والمقاولين والمشاريع: مخزون قوي، تسعير تنافسي للكميات،
                    وتوريد سريع يغطي مواعيد التنفيذ.
                  </p>
                  <Link className="mfr__all" href="/distribution">
                    تفاصيل خدمة التوزيع <ArrowLeft aria-hidden="true" />
                  </Link>
                </div>
              </div>
              <div className="about__unit">
                <span className="benefit__ic"><Store aria-hidden="true" /></span>
                <div>
                  <b>معرض نور القدس</b>
                  <p>
                    للأفراد اللي بيجهّزوا أو بيشطّبوا بيوتهم: مساعدة حقيقية في الاختيار،
                    ونفس جودة وأسعار الجملة.
                  </p>
                  <Link className="mfr__all" href="/showroom">
                    تفاصيل خدمة المعرض <ArrowLeft aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2>ليه عملاؤنا بيكملوا معانا؟</h2>
            <ul className="about__points">
              <li>
                <BadgeCheck aria-hidden="true" />
                <span><b>أصلي ومضمون</b> — توريد مباشر من المصنّعين وضمان المصنّع على كل صنف.</span>
              </li>
              <li>
                <Truck aria-hidden="true" />
                <span><b>{site.shipping}</b> — من مقرّنا في {site.location} لباب موقعك.</span>
              </li>
              <li>
                <Handshake aria-hidden="true" />
                <span><b>خبرة {site.since}–اليوم</b> — بنساعدك تختار الصح لمشروعك مش الأغلى.</span>
              </li>
            </ul>
          </section>

          <div className="post__cta">
            <div>
              <b>جاهز تبدأ؟</b>
              <span>تصفّح الكتالوج أو كلمنا مباشرة على واتساب.</span>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link className="btn btn--gold" href="/search">
                تصفّح المنتجات <ArrowLeft aria-hidden="true" />
              </Link>
              <a className="btn btn--wa" href={waLink()} target="_blank" rel="noopener noreferrer">
                <WaIcon /> واتساب
              </a>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
