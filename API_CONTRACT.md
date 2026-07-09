# Noor Al-Quds — Public Read-Only API Contract (v1)

This document is the **single source of truth** for the interface between the ERP
(Laravel) and the public website (Next.js). Both sides build against this file.
Any change to this contract must be reflected here first, then implemented.

- Producer: Laravel ERP — new isolated module `PublicApi`
- Consumer: Next.js website server **only** (never the browser)
- Nature: **READ-ONLY.** No endpoint may create, update, or delete anything.

---

## 1. Base URL & Versioning

```
https://erp.INTERNAL-DOMAIN.example/api/v1/public
```

- All routes are prefixed with `/api/v1/public`.
- Breaking changes require a new version prefix (`/api/v2/public`). Additive,
  backward-compatible changes (new optional fields) are allowed within v1.

## 2. Authentication & Access Rules

- Every request must include: `Authorization: Bearer <STATIC_TOKEN>`
- Token is stored in ERP `.env` as `PUBLIC_API_TOKEN` and in the website `.env`
  as `ERP_API_TOKEN`. It is never exposed to the browser.
- Missing/invalid token → `401` with the standard error shape (§8).
- Rate limit: 120 requests/minute per token → `429` when exceeded.
- Recommended (infrastructure level): IP allowlist restricted to the website
  server.

## 3. Common Conventions

- Encoding: UTF-8. Product/category/brand names are Arabic-first; `name` is the
  Arabic display name. Optional `name_en` may be null.
- Timestamps: ISO 8601 (`2026-07-08T14:30:00+02:00`).
- All list endpoints are paginated (§7).
- All responses: `Content-Type: application/json; charset=utf-8`.
- Responses should include `Cache-Control: public, max-age=60` (the website
  layers ISR on top; this is a safety net, not the main cache).

## 4. Data Types

### 4.1 Product (list item)

```json
{
  "id": 5001,
  "slug": "khalat-dafn-ideal-a9623",
  "name": "خلاط دفن",
  "name_en": null,
  "brand": { "id": 12, "name": "Ideal Standard", "slug": "ideal-standard" },
  "category": { "id": 7, "name": "خلاطات", "slug": "mixers" },
  "code": "PRD-00142",
  "availability": "in_stock",
  "price": 4850.00,
  "price_visibility": true,
  "currency": "EGP",
  "image_url": null,
  "updated_at": "2026-07-08T14:30:00+02:00"
}
```

Field rules:

| Field | Type | Rules |
|---|---|---|
| `id` | int | ERP product ID. Stable. Used in URLs. |
| `slug` | string | URL-safe, generated from name + code. May change; `id` is the canonical key. |
| `name` | string | Arabic display name. Required, non-empty. |
| `name_en` | string \| null | Optional Latin name. |
| `brand` | object \| null | Null allowed but flagged in the data-quality report. |
| `category` | object \| null | Same as brand. |
| `code` | string | Public product reference code = ERP internal `products.code` (e.g. `PRD-00142`). Non-null (auto-generated for every product). Shown on the site and used as the key for the image resolver. **Note:** the ERP has no manufacturer SKU column — `code` replaced the former `manufacturer_sku` field (v1.1, يوليو 2026). |
| `availability` | enum | `in_stock` \| `on_request` \| `out_of_stock` |
| `price` | decimal \| null | **Must be `null` whenever `price_visibility` is `false`.** Never leak hidden prices. |
| `price_visibility` | bool | `false` → website shows "اتصل لمعرفة السعر". |
| `currency` | string | Always `EGP` for v1. |
| `image_url` | string \| null | Absolute URL if the ERP has an image (from `product_web_images`), else null. Fallback chain is the website's job. |
| `updated_at` | string | Last modification time. |

### 4.2 Product (detail)

Same as list item, plus:

```json
{
  "description": "خلاط دفن مخرجين ...",
  "specs": [
    { "label": "الخامة", "value": "نحاس مطلي كروم" },
    { "label": "الضمان", "value": "5 سنوات" }
  ],
  "related_product_ids": [5002, 5010]
}
```

- `description`: string | null (plain text or minimal HTML — no scripts/styles).
- `specs`: array, may be empty.
- `related_product_ids`: array, may be empty (same category, max 8).

### 4.3 Category

```json
{ "id": 7, "name": "خلاطات", "slug": "mixers", "parent_id": null, "products_count": 143 }
```

### 4.4 Brand

```json
{ "id": 12, "name": "Ideal Standard", "slug": "ideal-standard", "logo_url": null, "catalog_pdf_url": null, "products_count": 89 }
```

- `catalog_pdf_url`: optional manufacturer catalog download (nice-to-have on
  brand pages; not an SEO strategy).

## 5. Endpoints

### 5.1 `GET /products`

Query params (all optional):

| Param | Type | Notes |
|---|---|---|
| `page` | int | Default 1. |
| `per_page` | int | Default 24, max 100. |
| `category_id` | int | Filter. |
| `brand_id` | int | Filter. |
| `availability` | enum | Filter. |
| `sort` | enum | `newest` (default) \| `name` |
| `updated_since` | ISO date | For sitemap/incremental use. |

Response: paginated envelope (§7) of Product list items.

### 5.2 `GET /products/{id}`

- `200` → Product detail object (§4.2), wrapped as `{ "data": { ... } }`.
- `404` → standard error shape.

### 5.3 `GET /categories`

- Full flat list (categories are few) — paginated envelope with `per_page=100` default.
- Only categories with `products_count > 0` unless `include_empty=1`.

### 5.4 `GET /brands`

- Same conventions as categories.

### 5.5 `GET /search?q=...`

| Param | Type | Notes |
|---|---|---|
| `q` | string | Required, min 2 chars after normalization. |
| `page`, `per_page` | int | As in §5.1. |

**Arabic normalization (server-side, applied to both the query and the indexed
comparison):**

- Strip diacritics (tashkeel) and tatweel (ـ)
- Unify alef forms: أ / إ / آ → ا
- Unify: ة → ه, ى → ي
- Trim/collapse whitespace

Search matches against: `name`, `name_en`, `code`, brand name.
Response: paginated envelope of Product list items.

### 5.6 `GET /health`

- No auth required. Returns `{ "status": "ok", "time": "..." }`.
- Used by the website to degrade gracefully (serve stale cache) if the ERP is down.

## 6. Sitemap Support

`GET /products?per_page=100&sort=newest&updated_since=...` must be efficient
enough for the website to walk the full catalog nightly to rebuild
`sitemap.xml`. No dedicated endpoint needed for v1.

## 7. Pagination Envelope

```json
{
  "data": [ ... ],
  "meta": { "current_page": 1, "per_page": 24, "total": 1430, "last_page": 60 }
}
```

## 8. Error Shape

```json
{ "error": { "code": "not_found", "message": "Product not found." } }
```

Codes: `unauthorized` (401), `not_found` (404), `validation` (422),
`rate_limited` (429), `server_error` (500).

## 9. Hard Guarantees (non-negotiable)

1. All endpoints are `GET`. Any other method → `405`.
2. The module connects through a **read-only DB user** (`SELECT` only).
3. Responses are built via explicit whitelist Resources — cost prices, supplier
   data, internal stock counts, and user data can never appear in any response.
4. The only new table is `product_web_images`. No existing table or column is
   modified.
