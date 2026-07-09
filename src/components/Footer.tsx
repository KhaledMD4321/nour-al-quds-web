import Link from "next/link";
import { MapPin, Phone, Clock } from "lucide-react";
import { WaIcon } from "./WaIcon";
import { site, waLink } from "@/lib/site";

const PRODUCT_LINKS = [
  { label: "مواسير ووصلات", href: "/categories/1-pipes-fittings" },
  { label: "أنظمة المياه", href: "/categories/2-water-systems" },
  { label: "أطقم حمامات", href: "/categories/3-bathroom-sets" },
  { label: "خلاطات وحنفيات", href: "/categories/4-mixers-taps" },
  { label: "فلاتر مياه", href: "/categories/7-water-filters" },
];

const COMPANY_LINKS = [
  { label: "عن نور القدس", href: "/#trust" },
  { label: "خدمات التوزيع", href: "/#audience" },
  { label: "المقاولون والمشاريع", href: "/#audience" },
  { label: "المعرض", href: "/#audience" },
  { label: "كل المنتجات", href: "/search" },
];

export function Footer() {
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
            <h4>المنتجات</h4>
            <ul>
              {PRODUCT_LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
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
