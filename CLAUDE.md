# CLAUDE.md — Noor Al-Quds Website (Next.js)

> Place this file at the root of the **website repo**, named `CLAUDE.md`.

## What this site is

An **Arabic-first, RTL, catalog + lead-generation** website for نور القدس
(sanitary ware & water systems, Egypt). It is NOT an e-commerce store: no
cart, no checkout, no accounts. Conversion = WhatsApp / phone call / branch
visit. Its competitive job is SEO coverage of the product catalog with zero
manual content maintenance — all data comes live from the ERP.

`API_CONTRACT.md` defines the ERP API. Consume it exactly as written.

## Stack

- Next.js (App Router) + TypeScript.
- Styling: CSS with the **canonical design tokens** — port the variables from
  `styles.css` / `tokens/*.css` as-is. Keep variable names. Do not invent new
  colors, fonts, radii, or shadows; the approved identity is final.
- Reference layout: `Nour_Al_Quds_Website.html` (Home · Category · Product).
  Recreate it as components; visual output should match it closely.
- `lang="ar" dir="rtl"` on `<html>`. Use logical CSS properties
  (`margin-inline-start`, `inset-inline-end`, …) — never left/right.

## Hard architecture rules

1. **The browser never talks to the ERP.** All ERP calls happen server-side
   (Server Components / route handlers) using `ERP_API_TOKEN` from env. The
   token must never reach client bundles.
2. **ISR is the cache.** Product, category, and brand pages use
   `revalidate: 300` (5 minutes). No client-side data fetching for catalog
   content. The listing/search page may use a route handler + server fetch;
   search results can be `no-store` but must still render server-side HTML.
3. **Graceful degradation.** Wrap ERP fetches in a thin client
   (`lib/erp.ts`) with a short timeout and typed responses. If the ERP is
   unreachable, serve the last ISR-cached page (default Next behavior) and
   never render a broken page; empty states get a designed fallback.
4. **Mock-first.** Phase 1 runs on fixtures in `fixtures/*.json` matching the
   contract exactly, behind the same `lib/erp.ts` interface, switched by
   `DATA_SOURCE=mock|erp`. The UI must not know which source is active.

## URLs

- Product: `/products/{id}-{slug}` → resolve by `id`; if the slug part
  doesn't match the current slug, 301-redirect to the canonical URL.
- Category: `/categories/{id}-{slug}` · Brand: `/brands/{id}-{slug}`
- Search: `/search?q=...`

## Image fallback chain (per contract)

Component `<ProductImage>` resolves in order:

1. `image_url` from the API (ERP-managed image)
2. Local resolver: `/img/{brandSlug}/{manufacturer_sku}.webp` — a route
   handler that checks the local `product-images/` storage folder
3. Branded placeholder (designed, on-token — never a broken image icon)

Adding an image file later must light up automatically with no data change.

## SEO (the reason this site exists)

- Every product/category/brand page: server-rendered HTML, Arabic
  `<title>` = "اسم المنتج — البراند | نور القدس", meta description from the
  product data, canonical URL.
- JSON-LD `Product` schema on product pages (name, brand, sku, image,
  availability; include `offers` only when `price_visibility` is true).
- `sitemap.xml` generated from the API (walk `/products`, `/categories`,
  `/brands`), plus `robots.txt`. Regenerated at build + revalidated daily.
- `next/image` for optimization; explicit width/height to avoid CLS; Arabic
  `alt` text from product name.

## Lead-gen behavior

- Product page CTAs: WhatsApp (prefilled Arabic message with product name +
  SKU + page URL), phone call, branch locations.
- `price_visibility: false` → show "اتصل لمعرفة السعر" with the WhatsApp CTA;
  never show 0 or an empty price.
- Availability badges map to the design's `badge--in / badge--req / badge--out`.

## Quality bar

- Lighthouse: performance and SEO ≥ 90 on product pages (mobile).
- Works fully without JavaScript for content (JS enhances, never gates).
- Typecheck + lint clean; a few Playwright smoke tests (home renders, product
  page renders from fixtures, search returns results, WhatsApp link correct).
