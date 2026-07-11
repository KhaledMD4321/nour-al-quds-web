import type { Metadata } from "next";
import { MapPin, Phone, Clock, Truck, Store, ExternalLink } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { WaIcon } from "@/components/WaIcon";
import { site, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "تواصل معنا — فرع الواسطى",
  description: `تواصل مع نور القدس: فرعنا في ${site.location}، مواعيد العمل ${site.hours}، واتساب وهاتف، مع خدمة الشحن لكل محافظات مصر.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  // LocalBusiness JSON-LD — بيانات الفرع للـ SEO المحلي
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: site.fullName,
    description: site.description,
    address: {
      "@type": "PostalAddress",
      addressLocality: "الواسطى",
      addressRegion: "بني سويف",
      addressCountry: "EG",
    },
    telephone: site.phone,
    url: site.url,
  };

  return (
    <main className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="wrap">
        <Breadcrumb items={[{ label: "الرئيسية", href: "/" }, { label: "تواصل معنا" }]} />

        <div className="catintro">
          <span className="eyebrow">Contact</span>
          <h1>تواصل معنا</h1>
          <p>أسرع رد على واتساب — وأهلاً بيك في الفرع في أي وقت خلال مواعيد العمل.</p>
        </div>

        <div className="contact" style={{ paddingBottom: 60 }}>
          <div className="contact__card">
            <h2>
              <Store aria-hidden="true" /> فرع الواسطى
            </h2>
            <ul className="contact__rows">
              <li>
                <MapPin aria-hidden="true" />
                <div>
                  <b>{site.location}</b>
                  <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer">
                    افتح الاتجاهات على خرائط جوجل <ExternalLink aria-hidden="true" />
                  </a>
                </div>
              </li>
              <li>
                <Clock aria-hidden="true" />
                <div>
                  <b>مواعيد العمل</b>
                  <span>{site.hours}</span>
                </div>
              </li>
              <li>
                <Phone aria-hidden="true" />
                <div>
                  <b>الهاتف</b>
                  <a href={`tel:${site.phone}`} className="num" dir="ltr">
                    {site.phoneDisplay}
                  </a>
                </div>
              </li>
              <li>
                <Truck aria-hidden="true" />
                <div>
                  <b>{site.shipping}</b>
                  <span>أو استلام مجاني من الفرع خلال مواعيد العمل</span>
                </div>
              </li>
            </ul>
            <a
              className="btn btn--wa btn--lg btn--full"
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WaIcon /> ابعتلنا على واتساب
            </a>
          </div>

          <div className="contact__side">
            <h3>إزاي تطلب؟</h3>
            <ol className="contact__steps">
              <li>تصفّح الكتالوج واختار الأصناف اللي محتاجها.</li>
              <li>اضغط «اسأل عن السعر والتوافر» — رسالة واتساب جاهزة بالكود.</li>
              <li>هنرد عليك بالسعر الحالي والتوافر وخيارات الشحن أو الاستلام.</li>
            </ol>
            <p className="contact__hint">
              معاك مقايسة كاملة؟ ابعتها زي ما هي على واتساب وهنسعّرها بند بند.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
