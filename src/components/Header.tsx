"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, MapPin, Search, Menu, X } from "lucide-react";
import { WaIcon } from "./WaIcon";
import { site, waLink } from "@/lib/site";

const NAV = [
  { label: "الرئيسية", href: "/" },
  { label: "المنتجات", href: "/search" },
  { label: "التوزيع", href: "/#audience" },
  { label: "المعرض", href: "/#audience" },
  { label: "عن الشركة", href: "/#trust" },
];

function isActive(href: string, pathname: string): boolean {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/search")) return pathname.startsWith("/search");
  return false;
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
          {NAV.map((n) => (
            <Link key={n.label} href={n.href} className={isActive(n.href, pathname) ? "on" : ""}>
              {n.label}
            </Link>
          ))}
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
          {NAV.map((n) => (
            <Link
              key={n.label}
              href={n.href}
              className={isActive(n.href, pathname) ? "on" : ""}
              onClick={() => setOpen(false)}
            >
              {n.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
