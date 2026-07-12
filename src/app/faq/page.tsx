import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { WaIcon } from "@/components/WaIcon";
import { FAQS } from "@/lib/faqs";
import { waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة — إزاي تطلب من نور القدس",
  description:
    "إزاي تطلب؟ إيه نظام الأسعار والشحن والاستلام من الفرع؟ إجابات مباشرة على الأسئلة الأكثر تكراراً.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="wrap">
        <Breadcrumb
          items={[{ label: "الرئيسية", href: "/" }, { label: "الأسئلة الشائعة" }]}
        />

        <div className="catintro">
          <span className="eyebrow">FAQ</span>
          <h1>الأسئلة الشائعة</h1>
          <p>كل اللي محتاج تعرفه عن الطلب والأسعار والشحن والاستلام — بإجابات مباشرة.</p>
        </div>

        <div className="faq" style={{ paddingBottom: 40 }}>
          {FAQS.map((f, i) => (
            <details key={i} className="faq__item" open={i === 0}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>

        <div className="post__cta" style={{ marginBottom: 60 }}>
          <div>
            <b>سؤالك مش هنا؟</b>
            <span>ابعتهولنا على واتساب وهنرد عليك بسرعة.</span>
          </div>
          <a className="btn btn--wa" href={waLink()} target="_blank" rel="noopener noreferrer">
            <WaIcon /> اسأل على واتساب
          </a>
        </div>
      </div>
    </main>
  );
}
