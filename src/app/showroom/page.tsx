import type { Metadata } from "next";
import Link from "next/link";
import {
  Store,
  ShieldCheck,
  HeartHandshake,
  Wallet,
  Home,
  MessageCircleMore,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { WaIcon } from "@/components/WaIcon";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "المعرض — جهّز بيتك بأمان وبسعر الجملة",
  description:
    "معرض نور القدس في الواسطى بني سويف: مساعدة حقيقية في اختيار أدوات سباكة وأدوات صحية أصلية على قد ميزانيتك — في سوق مليان تقليد، اشتري وانت مطمّن.",
  alternates: { canonical: "/showroom" },
};

export default function ShowroomPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "معرض الأدوات الصحية وأنظمة المياه",
    provider: { "@type": "Organization", name: site.fullName },
    areaServed: "EG",
    audience: { "@type": "Audience", audienceType: "الأفراد وأصحاب المنازل" },
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="wrap">
        <Breadcrumb items={[{ label: "الرئيسية", href: "/" }, { label: "المعرض" }]} />

        <div className="catintro">
          <span className="eyebrow">Showroom</span>
          <h1>معرض نور القدس — جهّز بيتك وانت مطمّن</h1>
          <p>
            بيتك بتأسسه أو بتشطبه مرة واحدة في العمر غالباً — ودورنا إنك تعمل ده صح: منتج
            أصلي، اختيار مناسب لميزانيتك، وحد تسأله بعد ما تشتري.
          </p>
        </div>

        <article className="post" style={{ paddingTop: 0 }}>
          <section>
            <h2>الخدمة بالتفصيل</h2>
            <p>
              المعرض هو واجهة نور القدس للأفراد وأصحاب البيوت في {site.location}. سواء
              بتأسس شقة جديدة أو بتجدد حمام أو مطبخ، هتلاقي عندنا احتياجك من مرحلة التأسيس
              (مواسير التغذية والصرف بأنظمتها الكاملة) لمستلزمات التشطيب — وبنساعدك تظبط
              قايمتك مع الفني بتاعك خطوة بخطوة.
            </p>
            <p>
              مش من بني سويف؟ مش مشكلة — نفس الخدمة بتشتغل عن بُعد: تتصفح الكتالوج، تسأل
              على واتساب، وطلبك يوصلك لأي محافظة.
            </p>
          </section>

          <section>
            <h2>ليه تشتري من عندنا؟ (الحكاية أكبر من السعر)</h2>
            <ul className="about__points">
              <li>
                <ShieldCheck aria-hidden="true" />
                <span>
                  <b>أصلي مضمون في سوق مليان مضروب</b> — التقليد في خامات السباكة بيتدفن
                  في الحيطة وبيبان بعد سنة بتسريب يكلّفك تكسير. إحنا وكيل نصّار الحصري
                  وموزّع معتمد لـ EGIC وديما ثيرم: بضاعتنا من المصنع مباشرة، وبنوريك بنفسك
                  علامات المنتج الأصلي عشان تفرق بعد كده في أي مكان.
                </span>
              </li>
              <li>
                <HeartHandshake aria-hidden="true" />
                <span>
                  <b>نصيحة أمينة مش «أغلى حاجة في الرف»</b> — بنسألك عن شغلك وميزانيتك
                  الأول، وبنرشّحلك المناسب فعلاً حتى لو كان الأرخص. مصلحتنا الحقيقية إنك
                  ترجع وتجيب معاك جيرانك، مش إنك تدفع زيادة مرة واحدة.
                </span>
              </li>
              <li>
                <Wallet aria-hidden="true" />
                <span>
                  <b>سعر قريب من الجملة للأفراد</b> — لأننا موزّعون في الأساس، الفرد عندنا
                  بيشتري بمستوى أسعار التجار تقريباً. قارن بنفسك: اسأل عن أي صنف على
                  واتساب وشوف الفرق.
                </span>
              </li>
              <li>
                <Home aria-hidden="true" />
                <span>
                  <b>الشقة كلها من مكان واحد</b> — بدل ما تلف على خمس محلات وتستلم من خمس
                  أماكن، بنجمعلك التأسيس ومستلزماته في طلب واحد متناسق: نفس النظام، نفس
                  المقاسات، ومفيش قطعة ناقصة توقف الفني.
                </span>
              </li>
              <li>
                <MessageCircleMore aria-hidden="true" />
                <span>
                  <b>حد تسأله بعد الشراء</b> — رقم الواتساب اللي اشتريت منه هو نفسه اللي
                  هيرد عليك لو الفني احتاج قطعة زيادة أو عندك استفسار في التركيب. خدمة ما
                  بعد البيع عندنا مش شعار — دي طريقة شغلنا من {site.since}.
                </span>
              </li>
              <li>
                <Store aria-hidden="true" />
                <span>
                  <b>معرض حقيقي تقدر تزوره</b> — مش صفحة على النت وخلاص: فرع قائم في{" "}
                  {site.location} بمواعيد عمل ثابتة ({site.hours})، تعاين فيه بنفسك وتستلم
                  منه طلبك من غير شحن.
                </span>
              </li>
            </ul>
          </section>

          <section>
            <h2>إزاي نبدأ؟</h2>
            <p>
              لو معاك قايمة من الفني، ابعتهالنا زي ما هي على واتساب وهنسعّرها ونظبط
              نواقصها. ولو لسه في البداية، قولنا انت في أنهي مرحلة (تأسيس ولا تشطيب) وإيه
              ميزانيتك التقريبية — وهنمشي معاك خطوة بخطوة.
            </p>
          </section>

          <div className="post__cta">
            <div>
              <b>ابدأ تجهيز بيتك النهاردة</b>
              <span>استشارة الاختيار مجانية — على واتساب أو في المعرض.</span>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a className="btn btn--wa" href={waLink("السلام عليكم، بجهّز بيتي وحابب أستشيركم في القايمة والأسعار.")} target="_blank" rel="noopener noreferrer">
                <WaIcon /> استشارة مجانية
              </a>
              <Link className="btn btn--outline" href="/contact">
                <Store aria-hidden="true" /> زورنا في المعرض
              </Link>
              <Link className="btn btn--ghost" href="/distribution">
                تاجر أو مقاول؟ شوف التوزيع <ArrowLeft aria-hidden="true" />
              </Link>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
