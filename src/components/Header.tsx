"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Search, Menu, X, ChevronDown } from "lucide-react";
import { WaIcon } from "./WaIcon";
import { CatalogTree } from "./CatalogTree";
import { site, waLink } from "@/lib/site";
import type { StageGroup } from "@/lib/stages";

const SIMPLE_NAV = [
  { label: "الرئيسية", href: "/" },
  { label: "التوزيع", href: "/#audience" },
  { label: "المعرض", href: "/#audience" },
  { label: "عن الشركة", href: "/#trust" },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/search")) return pathname.startsWith("/search");
  return false;
}

export function Header({ catalog }: { catalog: StageGroup[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // أغلق درج الموبايل تلقائياً عند أي انتقال بين الصفحات
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="hdr">
      {/* top bar */}
      <div className="topbar">
        <div className="wrap">
          <span>{site.tagline}</span>
          <span style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <a href={`tel:${site.phone}`}>
              <Phone aria-hidden="true" />{" "}
              <span className="num" dir="ltr">
                {site.phoneDisplay}
              </span>
            </a>
            <span className="sep">·</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <MapPin aria-hidden="true" /> {site.location}
            </span>
          </span>
        </div>
      </div>

      {/* main bar */}
      <div className="wrap hdr__main">
        <Link className="hdr__logo" href="/" aria-label={site.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/lockup_horizontal.png" alt={site.name} />
        </Link>

        <nav className="hdr__nav">
          <Link href="/" className={isActive("/", pathname) ? "on" : ""}>
            الرئيسية
          </Link>
          <div className="hdr__hasmenu">
            <Link
              href="/search"
              className={isActive("/search", pathname) ? "on" : ""}
            >
              المنتجات <ChevronDown aria-hidden="true" className="caret" />
            </Link>
            <div className="megapanel">
              <CatalogTree catalog={catalog} />
            </div>
          </div>
          <Link
            href="/brands"
            className={pathname === "/brands" || pathname.startsWith("/brands/") ? "on" : ""}
          >
            العلامات
          </Link>
          <Link href="/distribution" className={pathname === "/distribution" ? "on" : ""}>
            التوزيع
          </Link>
          <Link href="/showroom" className={pathname === "/showroom" ? "on" : ""}>
            المعرض
          </Link>
          <Link href="/blog" className={pathname.startsWith("/blog") ? "on" : ""}>
            المدونة
          </Link>
          <Link href="/contact" className={pathname === "/contact" ? "on" : ""}>
            تواصل معنا
          </Link>
        </nav>

        <div className="hdr__spacer" />

        <form className="hdr__search" action="/search" method="get" role="search">
          <Search aria-hidden="true" />
          <input name="q" placeholder="ابحث عن منتج أو كود…" aria-label="بحث" />
        </form>

        <a
          className="btn btn--wa btn--sm"
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <WaIcon /> واتساب
        </a>

        <button
          className="hdr__burger"
          aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {/* mobile drawer */}
      <div className={`mmenu${open ? " on" : ""}`}>
        <div className="mmenu__in">
          <form className="mmenu__search" action="/search" method="get" role="search">
            <Search aria-hidden="true" />
            <input name="q" placeholder="ابحث عن منتج أو كود…" aria-label="بحث" />
          </form>
          <Link href="/" className={isActive("/", pathname) ? "on" : ""}>
            الرئيسية
          </Link>
          <Link href="/search" className={isActive("/search", pathname) ? "on" : ""}>
            كل المنتجات
          </Link>
          <Link
            href="/brands"
            className={pathname === "/brands" || pathname.startsWith("/brands/") ? "on" : ""}
          >
            العلامات التجارية
          </Link>
          <Link href="/distribution" className={pathname === "/distribution" ? "on" : ""}>
            التوزيع والجملة
          </Link>
          <Link href="/showroom" className={pathname === "/showroom" ? "on" : ""}>
            المعرض
          </Link>
          <Link href="/blog" className={pathname.startsWith("/blog") ? "on" : ""}>
            المدونة
          </Link>
          <Link href="/about" className={pathname === "/about" ? "on" : ""}>
            عن الشركة
          </Link>
          <Link href="/faq" className={pathname === "/faq" ? "on" : ""}>
            الأسئلة الشائعة
          </Link>
          <Link href="/contact" className={pathname === "/contact" ? "on" : ""}>
            تواصل معنا
          </Link>

          <div className="mmenu__cats">
            <CatalogTree catalog={catalog} />
          </div>
        </div>
      </div>
    </header>
  );
}
