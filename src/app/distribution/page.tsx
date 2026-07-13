import type { Metadata } from "next";
import Link from "next/link";
import {
  Warehouse,
  Truck,
  ShieldCheck,
  ClipboardCheck,
  PackageSearch,
  Handshake,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { WaIcon } from "@/components/WaIcon";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "التوزيع والجملة — للتجار والمقاولين والفنيين",
  description:
    "خدمة توزيع أدوات السباكة بالجملة من نور القدس: توريد مباشر من المصانع (وكيل نصّار الحصري)، مخزون دائم 1500+ صنف، مراجعة مقايسات مجانية، وشحن لكل محافظات مصر.",
  alternates: { canonical: "/distribution" },
};

export default function DistributionPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "توزيع أدوات السباكة والأدوات الصحية بالجملة",
    provider: { "@type": "Organization", name: site.fullName },
    areaServed: "EG",
    audience: { "@type": "Audience", audienceType: "تجار ومقاولون وفنيون" },
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="wrap">
        <Breadcrumb
          items={[{ label: "الرئيسية", href: "/" }, { label: "التوزيع والجملة" }]}
        />

        <div className="catintro">
          <span className="eyebrow">Distribution &amp; Wholesale</span>
          <h1>نور القدس للتوزيع — شريك التوريد اللي بتبني عليه</h1>
          <p>
            بنخدم التجار والمقاولين والفنيين من {site.location} لكل محافظات مصر منذ{" "}
            {site.since} — توريد جملة تقدر تحسب عليه مواعيدك وهامش ربحك.
          </p>
        </div>

        <article className="post" style={{ paddingTop: 0 }}>
          <section>
            <h2>الخدمة بالتفصيل</h2>
            <p>
              وحدة التوزيع هي القلب التجاري لنور القدس: مخزن رئيسي بمخزون دائم يتجاوز ١٥٠٠
              صنف من أنظمة التغذية والصرف — نصّار والبولي بروبلين بأنواعه، بانينجر وكيسيل
              وسمارت هوم من EGIC، وديما ثيرم — بكل المقاسات والوصلات اللي بيحتاجها شغل
              التأسيس اليومي.
            </p>
            <p>
              بنجهّز طلبات الجملة بنظام: تستلم من المخزن مباشرة بتحميل سريع، أو نشحنلك
              لمحلك أو موقعك في أي محافظة. ولو انت مقاول شغّال على مشروع، بنقدر نجدولّك
              التوريد على دفعات حسب مراحل التنفيذ.
            </p>
          </section>

          <section>
            <h2>إيه اللي بيميّزنا فعلاً؟ (غير السعر والجودة)</h2>
            <ul className="about__points">
              <li>
                <ShieldCheck aria-hidden="true" />
                <span>
                  <b>سلسلة توريد نضيفة في سوق مليان مضروب</b> — إحنا وكيل نصّار الحصري في
                  بني سويف وموزّع معتمد لـ EGIC وديما ثيرم. بضاعتنا بتيجي من المصنع مباشرة
                  بفواتير رسمية، فمفيش نقطة في السلسلة يدخل منها التقليد. لما تبيع لعميلك
                  من عندنا، انت مغطّي اسمك وسمعتك.
                </span>
              </li>
              <li>
                <Warehouse aria-hidden="true" />
                <span>
                  <b>عمق مخزون مش مجرد تشكيلة</b> — الفرق بين مورد ومورد بيظهر لما تطلب
                  ٥٠ كرتونة من صنف واحد مش كرتونتين. مخزوننا متعمّق في الأصناف اللي بتتباع
                  فعلاً، ومتحدّث بنظام إدارة لحظي — اللي تشوفه «متوفر» على الموقع موجود
                  فعلاً على الرف.
                </span>
              </li>
              <li>
                <ClipboardCheck aria-hidden="true" />
                <span>
                  <b>مراجعة مقايسات مجانية</b> — ابعت مقايسة مشروعك وهنراجعها بند بند:
                  بنكمّل النواقص اللي بتوقّف الشغل (الكيعان والجلب اللي بتتنسي)، وبننبّهك
                  لو فيه بديل أوفر بنفس الجودة. خبرة سنين بتشتغل لصالحك قبل ما تدفع.
                </span>
              </li>
              <li>
                <PackageSearch aria-hidden="true" />
                <span>
                  <b>طلب عن بُعد بدقة الكود</b> — كتالوجنا كله أونلاين بأكواد واضحة وحالة
                  توفّر حقيقية. تطلب بالكود من غير لبس، وتتابع من غير مشاوير — نظام شغل
                  يوفّر وقتك انت وفريقك.
                </span>
              </li>
              <li>
                <Handshake aria-hidden="true" />
                <span>
                  <b>كلمة تعرف تبني عليها</b> — اللي مش متوفر بنقولها من الأول، والسعر اللي
                  بنأكده بنلتزم بيه لمدته، ومفيش تبديل أصناف بجودة أقل في التجهيز. علاقتنا
                  بعملائنا من {site.since} قايمة على كده.
                </span>
              </li>
              <li>
                <Truck aria-hidden="true" />
                <span>
                  <b>{site.shipping}</b> — من مخزن الواسطى لباب محلك أو موقعك، بتغليف
                  وتحميل يحافظ على البضاعة، وتأكيد تكلفة الشحن قبل التنفيذ.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2>لمين الخدمة دي؟</h2>
            <p>
              <b>تجار التجزئة:</b> تشكيلة بتتباع فعلاً وتسعير جملة يسيبلك هامش حقيقي —
              وتكملة نواقص سريعة عشان رفّك ميفضاش. <b>المقاولون:</b> توريد ملتزم بمواعيد
              التنفيذ وجدولة دفعات حسب مراحل المشروع. <b>الفنيون:</b> كل احتياج شغلك من
              مكان واحد، بمراجعة فنية لقايمتك قبل الشراء.
            </p>
          </section>

          <div className="post__cta">
            <div>
              <b>جرّبنا في طلبك الجاي</b>
              <span>ابعت مقايستك أو استفسارك — بنرد بسعر اليوم والتوافر الفعلي.</span>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a className="btn btn--wa" href={waLink("السلام عليكم، معايا مقايسة/طلب جملة وحابب أعرف الأسعار والتوافر.")} target="_blank" rel="noopener noreferrer">
                <WaIcon /> ابعت مقايستك
              </a>
              <Link className="btn btn--outline" href="/search">
                <FileText aria-hidden="true" /> تصفّح الكتالوج
              </Link>
              <Link className="btn btn--ghost" href="/showroom">
                بتجهّز بيتك؟ شوف المعرض <ArrowLeft aria-hidden="true" />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
