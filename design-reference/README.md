# Developer Handoff — Nour Al Quds Website & Brand System
### نور القدس للأدوات الصحية وأنظمة المياه · Sanitary Ware & Water Systems

## Overview
Nour Al Quds is a sanitary-ware & water-systems distributor and showroom in Beni Suef,
Egypt (operating since 2011, exclusive Nassar agent). This package is everything a
developer needs to build the **public marketing + catalog website**: an **Arabic-first,
right-to-left (RTL)** lead-generation site. There is **no e-commerce checkout and no public
pricing** — every product's primary call-to-action is **"ask on WhatsApp"** (prices move
with the market). The audience skews low digital-literacy, so the UI is large, calm, and
unambiguous.

The site serves two audiences under one brand:
- **نور القدس للتوزيع (Distribution)** — traders, contractors, technicians; wholesale & projects.
- **معرض نور القدس (Showroom)** — homeowners fitting out a bathroom/kitchen.

## About the Design Files
The files in this bundle are **design references created in HTML/CSS** — high-fidelity
prototypes that show the intended look, layout, and behavior. **They are not production code
to ship as-is.** Your task is to **recreate these designs in the target codebase's
environment** (e.g. Next.js/React, Nuxt/Vue, Astro, Laravel Blade, etc.) using its
established patterns, component library, and i18n/RTL tooling. If no codebase exists yet,
pick the most appropriate modern framework — **Next.js (App Router) with CSS variables or
Tailwind** is a good default for a content/catalog site that needs strong RTL support and SEO.

The design tokens (`tokens/*.css`) **are** intended to be used directly or ported 1:1 — they
are the single source of truth for color, type, spacing, radius, shadow, and motion.

## Fidelity
**High-fidelity (hifi).** Colors, typography, spacing, and interactions are final and
approved (Brand Kit v1.0). Recreate the UI pixel-faithfully using the codebase's libraries,
but treat the **tokens as canonical** — do not eyeball values, reference the variables.

## Tech & Localization Requirements
- **Direction:** `dir="rtl"` and `lang="ar"` on `<html>`. The entire layout is RTL-first.
  Use CSS logical properties (`margin-inline-start`, `inset-inline-end`, `padding-block`,
  etc.) — the prototypes already do. Do **not** hard-code `left`/`right`.
- **Numerals:** UI displays **Arabic-Indic numerals** (٠١٢٣٤٥٦٧٨٩) in body/marketing copy,
  but **product codes and phone numbers stay Latin/Western** and are wrapped `dir="ltr"`
  with the mono font. Keep this split.
- **Fonts (Google Fonts):**
  - `Kufam` (Black 900) — **wordmark/logotype only** ("نور القدس"). In production the logo
    is the supplied outlined PNG/SVG; Kufam is only the live fallback. Do not set body text in Kufam.
  - `Alexandria` (300–900) — **the system typeface**: all headings, body, UI, Arabic & Latin.
  - `IBM Plex Mono` (400–600) — product codes, prices on documents, phone numbers.
  - `Cairo` — retained as a fallback only.
  - Import: `https://fonts.googleapis.com/css2?family=Alexandria:wght@300;400;500;600;700;800;900&family=Kufam:wght@700;800;900&family=Cairo:wght@400;600;700;900&family=IBM+Plex+Mono:wght@400;500;600&display=swap`
  - For production/offline, self-host the `.woff2` files.
- **Accessibility:** minimum hit target **48px** (low-literacy, mobile audience). Body text
  never below 16px. Maintain AA contrast (the navy/teal/gold combos in tokens are tuned for this).

## Screens / Views
The website prototype (`Nour Al Quds Website.html`) is a single file with three screens
toggled by a `go(id)` function (`home`, `cat`, `pdp`). In production these are **routes**:
`/` , `/category/[slug]` , `/product/[code]`.

### 1. Home  ( `/` )
- **Purpose:** Establish trust, route the two audiences, surface categories & featured products, drive WhatsApp leads.
- **Layout (max content width 1280px, side padding `clamp(18px,4vw,40px)`):**
  - **Sticky header** (see Global Components).
  - **Hero** — navy (`--navy-800`) background, 3px gold bottom border, faint arch pattern at
    6% opacity + a radial petrol glow. Two-column grid `1.15fr / .85fr`, vertical padding
    `clamp(56px,8vw,92px)`. Left: gold pill eyebrow ("وكيل نصّار الحصري… · منذ ٢٠١١"),
    H1 `clamp(38px,5.4vw,68px)/900` with the last clause in `--stone-400`, lead paragraph
    `clamp(16px,1.5vw,19px)`, two CTAs (gold "تصفّح المنتجات" + WhatsApp green "اسأل عن السعر
    والتوافر"), and a 3-up stat row (٢٠١١ / +٥٠٠٠ / بني سويف) separated by hairline rules.
    Right: a "gateway" card (aspect 5/6, radius `28px 28px 6px 6px`, navy→petrol gradient,
    pipes pattern) holding the white symbol, with a frosted info tag pinned bottom.
  - **Audience split** — two cards, grid `1fr 1fr`, 24px gap, radius 20px, min-height 300px,
    text bottom-aligned. Left card navy gradient ("نور القدس للتوزيع"); right card petrol
    gradient ("معرض نور القدس"). Each: gold label, 27px/900 title, paragraph, two buttons.
  - **Categories** — section header (eyebrow + 40px/900 title + "كل الفئات" ghost link), then
    a 4-col grid (`repeat(4,1fr)`, 18px gap → 2-col under 980px) of category tiles: white card,
    1px subtle border, radius 16px; 52px rounded icon chip (teal-050 bg → fills teal on hover);
    name 17px/800; count; "تصفّح →" link. Hover: lift `translateY(-3px)` + `--shadow-lg` + teal border.
  - **Featured products** — header + note ("الأسعار تتغيّر… اسأل عبر واتساب"), 4-col ProductCard grid.
  - **Brands strip** — flex-wrap row of brand chips; Nassar carries a "وكيل حصري" gold tag.
  - **Trust band** — navy, faint pipes pattern, 4-col grid of stat blocks (64px rounded icon
    tile in translucent petrol, value 19px/800, label). 2-col under 760px.
  - **CTA band** — petrol gradient, radius `28px 28px 6px 6px`, arch pattern at 10%; headline
    + paragraph on one side, gold + outline-light buttons on the other.
  - **Footer** (see Global Components).

### 2. Category  ( `/category/[slug]` )
- **Purpose:** Browse/filter a category; every product still routes to WhatsApp, no cart.
- **Layout:** breadcrumb → category intro (eyebrow + title + description) → two-column
  `248px / 1fr` grid (collapses to 1-col under 860px):
  - **Filters sidebar** (sticky, top 128px): white card radius 15px; groups for Brand / Size /
    Availability with checkbox options (`accent-color: var(--teal-500)`) and Arabic-numeral
    counts in mono; a full-width WhatsApp button "لم تجد ما تبحث عنه؟" at the bottom.
  - **Results:** toolbar (result count + sort `<select>`), then a 3-col ProductCard grid.

### 3. Product Detail  ( `/product/[code]` )
- **Purpose:** Show specs and convert to a WhatsApp inquiry. **No price is ever shown.**
- **Layout:** breadcrumb → two-column `1fr 1fr` grid (1-col under 860px):
  - **Left:** main media (square, radius `28px 28px 6px 6px`, navy→petrol gradient, arch
    pattern, centered white symbol) + a row of 4 thumbnails (74px, active has teal border).
  - **Right:** availability badge, H1 `clamp(26px,3vw,34px)/900`, a row with mono product code
    chip + gold "وكيل نصّار الحصري" chip, description (line-height 1.85), a **specs table**
    (zebra rows on `--slate-100`, key in `--text-muted`, value 700/navy), two actions
    (WhatsApp "اسأل عن السعر والتوافر" + outline "اطلب عرض سعر"), and an info **note** in a
    teal-tinted box explaining prices move with the market.
  - **Related products** 4-col grid below.

## Global Components
- **Top bar** (navy `--navy-900`, 38px, 12.5px): tagline on one side; phone + location on the other.
- **Header** (sticky, `rgba(246,244,239,.82)` + blur, 1px bottom border, 74px tall): logo
  lockup (46px tall, `assets/lockup_horizontal.png`) → nav links (15px/600, active = teal on
  teal-050 pill) → flexible spacer → search field (max 340px, 44px tall, focus = teal border
  + teal-050 ring) → WhatsApp button. Nav/search hide under 1080px (mobile menu needed).
- **ProductCard** (the core repeating unit — also a coded React component in this system):
  - White card, 1px `--border-subtle`, radius 15px, column flex, hover lift + teal border.
  - **Media** (aspect 4/3, navy→petrol gradient, arch pattern at 14%, centered symbol at 38%
    width). Brand chip pinned top-start (white 92% bg, 12px/800). Availability badge pinned top-end.
  - **Body:** name 15.5px/700 (hover → teal), meta row (mono code + size), divider, then a
    **WhatsApp soft link** "اسأل عن السعر والتوافر" (never a price). The card never shows a price or an "add to cart".
  - **Availability** has three states only: `in` متوفر (success/green), `request` حسب الطلب
    (warning/amber), `out` غير متوفر (danger/red) — pill, 7px dot + label.
- **Buttons** — variants used: `navy` (primary dark), `teal` (petrol, carries `--shadow-teal`),
  `gold` (on dark/hero), `outline`, `ghost`, `lighton` (translucent on dark), `wa` (WhatsApp
  green — **reserved exclusively for WhatsApp actions**). Sizes `sm / default / lg`. Radius
  9–12px. Hover lifts `translateY(-2px)`.
- **Floating WhatsApp FAB** — fixed bottom-end, 60px circle, WhatsApp green, green glow shadow.

## Interactions & Behavior
- **Navigation:** in the prototype `go(id)` toggles `.screen.on` and scrolls to top — in
  production these are real routes with the header persisting.
- **WhatsApp deep links:** every CTA opens `https://wa.me/<PHONE>?text=<encoded message>`
  in a new tab. The prototype uses placeholder `201000000000` and a default Arabic message
  ("السلام عليكم، أريد الاستفسار عن سعر وتوافر منتج."). **Wire the real business number and,
  where possible, prefill the message with the product name + code.**
- **Hover states:** cards lift + gain `--shadow-lg` + teal border; nav items get a soft bg;
  buttons translate up 2px. Use `--dur-base` (200ms) `--ease-standard`.
- **Focus:** visible ring `--ring` (3px teal at 40%) on all interactive elements.
- **Responsive:** grids documented above collapse at 1080 / 980 / 860 / 760px. Build a real
  mobile menu (hamburger) since the desktop nav + search hide under 1080px.
- **No loading/cart/checkout states** — this is a catalog + lead-gen site. Product "fetch"
  is just content; inquiries leave via WhatsApp.

## Design Tokens
All values live in `tokens/*.css` as CSS custom properties. Reference the **semantic
aliases** (`--brand-primary`, `--bg-page`, `--text-body`, `--avail-in`, …) in components,
not raw scale values. Highlights:

**Color — brand**
- Navy (PRIMARY): `--navy-800 #0D1B33` (+ 900 `#070F1F`, 700 `#14274A`, 600 `#1D3766`, 100 `#DCE3EF`, 050 `#EEF1F7`)
- Petrol/Teal (signal): `--teal-500 #15707E` (+ 700 `#0E5560`, 600 `#126370`, 400 `#3A8C99`, 300 `#6FAEB8`, 200 `#A9D2D8`, 100 `#D2E8EB`, 050 `#ECF5F6`). Approved alternate `#0F4E57`.
- Quds Gold (accent, sparing): `--stone-500 #C49A3F` (+ 700 `#8C6E2B`, 600 `#A9842F`, 300 `#E0C88E`, 100 `#F6EEDC`). Approved alternate `#C2A36A`.
- Slate Gray (support text): `--slate-500 #5F6673`. Neutrals 800→100 in `colors.css`.
- Warm Cream page bg: `--limestone #F6F4EF` (never pure white for page background).

**Color — semantic**
- Available `--success-600 #15875A` / bg `#E0F2E9`
- On request `--warning-600 #C9761F` / bg `#FBEBD6`
- Out of stock `--danger-600 #B83838` / bg `#FBE3E3`
- WhatsApp `--whatsapp #25D366` / dark `#1DA851` (WhatsApp actions only)
- **Usage ratio:** Navy 50–60% · Cream 20–30% · Gold 8–15% · Petrol 5–10% · Gray supporting.

**Typography** (16px base, `tokens/typography.css`)
- Scale: 2xs 11 · xs 12 · sm 14 · base 16 · md 18 · lg 22 · xl 28 · 2xl 36 · 3xl 48 · 4xl 64 · 5xl 88 (px)
- Weights: 300/400/500/600/700/800/900. Line-heights: tight 1.15 · snug 1.3 · normal 1.55 · relaxed 1.8 (Arabic body wants 1.55–1.8).
- Letter-spacing applies to **Latin only** — never track Arabic.

**Spacing** (8px grid): 4·8·12·16·24·32·40·48·64·80·112px. Gutter `clamp(1rem,4vw,2.5rem)`. Hit target 48px.

**Radius:** xs 4 · sm 6 · md 10 (default) · lg 14 · xl 20 · 2xl 28 · **arch `28px 28px 6px 6px`** (the signature "gateway" motif) · pill 999.

**Shadows** (navy-tinted): xs/sm/md/lg/xl in `effects.css`; `--shadow-teal` for teal CTAs. No glow/neon.

**Motion:** durations 120/200/320ms; `--ease-standard cubic-bezier(.4,0,.2,1)`; calm, no bounce.

## Assets
Real, approved Brand Kit v1.0 art (in `assets/brand/`):
- `lockup_horizontal.png` / `_reversed.png` — primary horizontal logo (header; reversed for dark).
- `lockup_stacked.png` / `_reversed.png` — stacked logo (footer).
- `symbol_primary.png` (full-color mark, on light) · `symbol_white.png` / `symbol_reversed.png` (on dark) · `symbol_black.svg` / `symbol_monochrome.svg` (single-color).
- `app_icon_512.png` / `app_icon.svg` (rounded app icon) · `favicon_256.png`.
- `pattern-arch.svg` / `pattern-pipes.svg` — brand background patterns (use at 6–14% opacity).
The mark is a "Quds Gate" arch + water-drop. **Clear space** = height of the water drop on all
sides; **min size** 24px on screen / 16px favicon; never stretch, recolor, rotate, or place on
low-contrast/busy backgrounds. Product imagery in the prototypes is symbol-on-navy placeholders —
**replace with real product photography**.

## Files in this bundle
- `website/Nour Al Quds Website.html` — the full hifi website prototype (Home / Category / Product).
- `templates/Storefront.dc.html` — the same storefront as a design-system template (for reference).
- `tokens/` — `colors.css`, `typography.css`, `fonts.css`, `spacing.css`, `effects.css`, `base.css` (**canonical design tokens — port these**).
- `styles.css` — the entry point that `@import`s the token files (note: original lives at project root; paths adjusted for this bundle).
- `assets/brand/` — all approved logo, symbol, icon, and pattern files.
- The reference **ProductCard** React implementation is inlined below (Appendix A).

## Implementation checklist
- [ ] Set up RTL + Arabic locale; logical properties throughout.
- [ ] Port `tokens/*.css` (or convert to your system's theme format) — keep variable names.
- [ ] Load the four font families; set the wordmark in Kufam, everything else in Alexandria.
- [ ] Build Header (with real mobile menu), Footer, Button, ProductCard, Badge as shared components.
- [ ] Implement the three routes; wire the **real WhatsApp number** + per-product prefilled messages.
- [ ] Replace placeholder product art with real photography; keep Arabic-Indic numerals in copy, Latin in codes/phones.
- [ ] Verify 48px hit targets, AA contrast, and the responsive breakpoints (1080/980/860/760).


---

## Appendix A — Reference: ProductCard (React)
The core catalog card. **No public price** — the action is always "ask on WhatsApp".
Styling reads the design tokens via CSS variables. Recreate it in your codebase's
component conventions; this is a faithful reference, not a drop-in dependency.

**Props** ( `ProductCardProps` )
- `name: string` — product name (Arabic).
- `brand?: string` — manufacturer / partner brand label.
- `code?: string` — public product code, e.g. `PRD-00142`.
- `image?: string` — image URL; omit to show the brand-symbol placeholder.
- `availability?: 'in' | 'request' | 'out'` — stock state (متوفر / حسب الطلب / غير متوفر).
- `sizes?: string` — size/spec line, e.g. `"25mm · 4 بار"`.
- `phone?: string` — WhatsApp number for the inquiry.
- `message?: string` — pre-filled WhatsApp message (product name is appended automatically).

```jsx
import React from 'react';

const WA_PATH = "M19.05 4.91A10 10 0 0 0 2.05 12a9.9 9.9 0 0 0 1.34 5l-1.42 5.18 5.3-1.39A10 10 0 0 0 12 22a10 10 0 0 0 7.05-17.09zM12 20.13a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.1.81.83-3.02-.2-.31A8.13 8.13 0 1 1 12 20.13zm4.5-6.1c-.25-.12-1.47-.72-1.7-.8s-.39-.13-.56.13-.64.8-.78.97-.29.18-.54.06a6.7 6.7 0 0 1-3.35-2.93c-.25-.43.25-.4.72-1.33.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84-.4-.42-.56-.43h-.48a.92.92 0 0 0-.66.31 2.78 2.78 0 0 0-.87 2.07 4.83 4.83 0 0 0 1.01 2.56 11.05 11.05 0 0 0 4.23 3.74c1.57.68 2.19.74 2.98.62.48-.07 1.47-.6 1.68-1.18s.21-1.08.15-1.18-.23-.18-.48-.3z";

const AVAIL = {
  in:      { c: 'success', ar: 'متوفر' },
  request: { c: 'warning', ar: 'حسب الطلب' },
  out:     { c: 'danger',  ar: 'غير متوفر' },
};

export function ProductCard({
  name, brand, code, image,
  availability = 'in', sizes,
  phone = '201000000000',
  message = 'السلام عليكم، أريد الاستفسار عن سعر وتوافر منتج.',
  className = '', ...rest
}) {
  const av = AVAIL[availability] || AVAIL.in;
  const href = `https://wa.me/${phone}?text=${encodeURIComponent(message + ' ' + (name || ''))}`;
  return (
    <div className={`nq-pcard ${className}`} dir="rtl" {...rest}>
      <div className="nq-pcard__media">
        {image
          ? <img src={image} alt={name} />
          : /* brand-symbol placeholder — use assets/brand/symbol_primary (or the
               symbol_black.svg silhouette) at ~.5 opacity, centered */
            <img className="nq-pcard__ph" src="/assets/brand/symbol_primary.png" alt="" aria-hidden="true" />}
        {brand && <span className="nq-pcard__brand">{brand}</span>}
        <span className="nq-pcard__badge">
          <span className={`nq-pcard__avail nq-pcard__avail--${av.c}`}>
            <span className="d" />{av.ar}
          </span>
        </span>
      </div>
      <div className="nq-pcard__body">
        <h3 className="nq-pcard__name">{name}</h3>
        <div className="nq-pcard__meta">
          {code && <span className="nq-pcard__code">{code}</span>}
          {sizes && <span>{sizes}</span>}
        </div>
        <div className="nq-pcard__foot">
          <a className="nq-pcard__wa" href={href} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={WA_PATH} /></svg>
            اسأل عن السعر والتوافر
          </a>
        </div>
      </div>
    </div>
  );
}
```

**Card styles** (token-driven; port to your CSS solution):
```css
.nq-pcard{display:flex;flex-direction:column;background:#fff;border:1px solid var(--border-subtle);
  border-radius:var(--radius-lg);overflow:hidden;font-family:var(--font-ui);
  transition:box-shadow var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-standard),border-color var(--dur-base);}
.nq-pcard:hover{box-shadow:var(--shadow-lg);transform:translateY(-3px);border-color:var(--slate-300);}
.nq-pcard__media{position:relative;aspect-ratio:4/3;overflow:hidden;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(135deg,var(--navy-050),var(--teal-050));}
.nq-pcard__media img{width:100%;height:100%;object-fit:cover;}
.nq-pcard__ph{width:auto!important;height:62%!important;object-fit:contain;opacity:.5;}
.nq-pcard__badge{position:absolute;top:12px;inset-inline-end:12px;}
.nq-pcard__brand{position:absolute;top:12px;inset-inline-start:12px;font-size:11px;font-weight:700;
  color:var(--navy-700);background:rgba(255,255,255,.92);padding:4px 9px;border-radius:var(--radius-pill);}
.nq-pcard__body{padding:16px 16px 18px;display:flex;flex-direction:column;gap:6px;flex:1;}
.nq-pcard__name{font-size:16px;font-weight:var(--weight-bold);color:var(--ink);line-height:1.4;}
.nq-pcard__meta{display:flex;gap:10px;flex-wrap:wrap;font-size:12px;color:var(--slate-500);}
.nq-pcard__code{font-family:var(--font-mono);color:var(--teal-700);}
.nq-pcard__foot{margin-top:auto;padding-top:14px;}
.nq-pcard__avail{display:inline-flex;align-items:center;gap:6px;font-size:11.5px;font-weight:700;
  padding:4px 9px;border-radius:var(--radius-pill);}
.nq-pcard__avail .d{width:7px;height:7px;border-radius:50%;background:currentColor;}
.nq-pcard__avail--success{background:var(--success-100);color:var(--success-600);}
.nq-pcard__avail--warning{background:var(--warning-100);color:var(--warning-600);}
.nq-pcard__avail--danger{background:var(--danger-100);color:var(--danger-600);}
.nq-pcard__wa{display:inline-flex;align-items:center;justify-content:center;gap:.5em;width:100%;height:38px;
  font-family:var(--font-ui);font-weight:var(--weight-bold);font-size:13px;text-decoration:none;
  background:var(--success-100);color:var(--whatsapp-dark);border-radius:var(--radius-sm);
  transition:background var(--dur-fast),color var(--dur-fast);}
.nq-pcard__wa:hover{background:var(--whatsapp);color:#063d20;}
.nq-pcard__wa svg{width:1.2em;height:1.2em;}
```
