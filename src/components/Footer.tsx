import Link from "next/link";
import { MapPin, Phone, Clock, Truck } from "lucide-react";
import { WaIcon } from "./WaIcon";
import { getBrands } from "@/lib/erp";
import { brandHref } from "@/lib/urls";
import { site, waLink } from "@/lib/site";

const COMPANY_LINKS = [
  { label: "عن نور القدس", href: "/about" },
  { label: "الأكثر طلباً", href: "/best-sellers" },
  { label: "المدونة", href: "/blog" },
  { label: "الأسئلة الشائعة", href: "/faq" },
  { label: "تواصل معنا", href: "/contact" },
  { label: "كل المنتجات", href: "/search" },
];

export async function Footer() {
  const brands = await getBrands();
  return (
    <footer className="ftr">
      <div className="wrap">
        <div className="ftr__in">
          <div className="ftr__logo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/lockup_stacked_reversed.png" alt={site.name} />
            <p>{site.description}</p>
          </div>

          <div>
            <h4>المصنّعون</h4>
            <ul>
              {brands.map((b) => (
                <li key={b.id}>
                  <Link href={brandHref(b)}>{b.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/search">كل المنتجات</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4>الشركة</h4>
            <ul>
              {COMPANY_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4>تواصل معنا</h4>
            <ul>
              <li>
                <span className="ftr__row">
                  <MapPin aria-hidden="true" /> {site.location}
                </span>
              </li>
              <li>
                <span className="ftr__row">
                  <Truck aria-hidden="true" /> {site.shipping}
                </span>
              </li>
              <li>
                <a className="ftr__row" href={`tel:${site.phone}`}>
                  <Phone aria-hidden="true" />{" "}
                  <span className="num" dir="ltr">
                    {site.phoneDisplay}
                  </span>
                </a>
              </li>
              <li>
                <span className="ftr__row">
                  <Clock aria-hidden="true" /> {site.hours}
                </span>
              </li>
            </ul>
            <a
              className="btn btn--wa btn--full btn--sm"
              style={{ marginTop: 14 }}
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              <WaIcon /> تواصل عبر واتساب
            </a>
          </div>
        </div>

        <div className="ftr__bot">
          <span>
            © <span className="num">٢٠٢٦</span> {site.fullName}
          </span>
          <span>{site.tagline}</span>
        </div>
      </div>
    </footer>
  );
}
