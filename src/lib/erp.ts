import type {
  Product,
  ProductDetail,
  Category,
  Brand,
  Paginated,
  ProductListParams,
} from "@/types/erp";
import { normalizeArabic } from "@/lib/arabic";
import productsData from "../../fixtures/products.json";
import categoriesData from "../../fixtures/categories.json";
import brandsData from "../../fixtures/brands.json";

/**
 * طبقة الوصول لبيانات الـ ERP.
 *
 * DATA_SOURCE=mock (افتراضي) → يقرأ من fixtures/*.json المطابقة لـ API_CONTRACT.md.
 * DATA_SOURCE=erp            → يتصل بالـ ERP الحقيقي (المرحلة 4) عبر ERP_API_URL + ERP_API_TOKEN.
 *
 * كل النداءات server-side فقط — التوكن لا يصل للمتصفح أبداً.
 */

const DATA_SOURCE = (process.env.DATA_SOURCE ?? "mock") as "mock" | "erp";

/** ISR: يعيد التوليد كل ٥ دقائق على صفحات الكتالوج (per CLAUDE.md). */
export const REVALIDATE = 300;

// ---------------------------------------------------------------------------
// Mock source (fixtures)
// ---------------------------------------------------------------------------

const ALL_PRODUCTS = productsData as unknown as ProductDetail[];
const ALL_CATEGORIES = categoriesData as unknown as Category[];
const ALL_BRANDS = brandsData as unknown as Brand[];

function toListItem(p: ProductDetail): Product {
  // نتأكد من قاعدة السعر: price لازم null لو price_visibility=false
  const price = p.price_visibility ? p.price : null;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    name_en: p.name_en,
    brand: p.brand,
    category: p.category,
    code: p.code,
    availability: p.availability,
    price,
    price_visibility: p.price_visibility,
    currency: p.currency,
    image_url: p.image_url,
    updated_at: p.updated_at,
  };
}

function paginate<T>(items: T[], page: number, perPage: number): Paginated<T> {
  const total = items.length;
  const lastPage = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, page), lastPage);
  const start = (current - 1) * perPage;
  return {
    data: items.slice(start, start + perPage),
    meta: { current_page: current, per_page: perPage, total, last_page: lastPage },
  };
}

function mockProducts(params: ProductListParams): Paginated<Product> {
  let items = [...ALL_PRODUCTS];

  if (params.category_id != null) {
    items = items.filter((p) => p.category?.id === params.category_id);
  }
  if (params.brand_id != null) {
    items = items.filter((p) => p.brand?.id === params.brand_id);
  }
  if (params.availability) {
    items = items.filter((p) => p.availability === params.availability);
  }
  if (params.q) {
    const q = normalizeArabic(params.q);
    items = items.filter((p) => {
      const haystack = normalizeArabic(
        [p.name, p.name_en ?? "", p.code, p.brand?.name ?? ""].join(" "),
      );
      return haystack.includes(q);
    });
  }

  if (params.sort === "name") {
    items.sort((a, b) => a.name.localeCompare(b.name, "ar"));
  } else {
    items.sort((a, b) => b.updated_at.localeCompare(a.updated_at)); // newest
  }

  return paginate(items.map(toListItem), params.page ?? 1, params.per_page ?? 24);
}

// ---------------------------------------------------------------------------
// ERP source (real API — PublicApi module, api/v1/public)
// ---------------------------------------------------------------------------

/** خطأ من الـ ERP API — بيحمل الـ status علشان نفرّق 404 (منتج مش موجود) عن الأعطال المؤقتة. */
export class ErpError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ErpError";
  }
}

/** مهلة الاتصال بالـ ERP (ms) — نفشل بسرعة بدل ما الصفحة تعلّق. */
const ERP_TIMEOUT_MS = Number(process.env.ERP_API_TIMEOUT_MS ?? 5000);

/**
 * degradation لطيف: الأعطال بتترمى (throw) — على صفحة مخزّنة بالـ ISR يخدم Next
 * النسخة القديمة تلقائياً؛ وعلى بداية باردة يمسكها حدّ الخطأ (app/error.tsx) فمفيش صفحة مكسورة.
 */
async function erpFetch<T>(path: string, opts: { noStore?: boolean } = {}): Promise<T> {
  const base = process.env.ERP_API_URL;
  const token = process.env.ERP_API_TOKEN;
  if (!base || !token) {
    throw new ErpError("ERP_API_URL / ERP_API_TOKEN غير مضبوطين (DATA_SOURCE=erp).");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ERP_TIMEOUT_MS);
  try {
    const res = await fetch(`${base.replace(/\/$/, "")}${path}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      signal: controller.signal,
      ...(opts.noStore
        ? { cache: "no-store" as const }
        : { next: { revalidate: REVALIDATE } }),
    });
    if (!res.ok) {
      throw new ErpError(`ERP API ${res.status} @ ${path}`, res.status);
    }
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

function buildQuery(params: ProductListParams): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v != null) sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

// ---------------------------------------------------------------------------
// Public API (source-agnostic — the UI never knows which is active)
// ---------------------------------------------------------------------------

export async function getProducts(
  params: ProductListParams = {},
): Promise<Paginated<Product>> {
  if (DATA_SOURCE === "erp") {
    return erpFetch<Paginated<Product>>(`/products${buildQuery(params)}`);
  }
  return mockProducts(params);
}

export async function searchProducts(
  q: string,
  params: ProductListParams = {},
): Promise<Paginated<Product>> {
  if (DATA_SOURCE === "erp") {
    // البحث لا يُخزّن (نتائج لحظية) لكنه يظل server-rendered
    return erpFetch<Paginated<Product>>(`/search${buildQuery({ ...params, q })}`, {
      noStore: true,
    });
  }
  return mockProducts({ ...params, q });
}

export async function getProduct(id: number): Promise<ProductDetail | null> {
  if (DATA_SOURCE === "erp") {
    try {
      const res = await erpFetch<{ data: ProductDetail }>(`/products/${id}`);
      return res.data;
    } catch (e) {
      if (e instanceof ErpError && e.status === 404) return null; // منتج مش موجود فعلاً
      throw e; // عطل مؤقت → خلّي ISR يخدم النسخة المخزّنة / حدّ الخطأ يمسكها
    }
  }
  const p = ALL_PRODUCTS.find((x) => x.id === id);
  if (!p) return null;
  return { ...p, price: p.price_visibility ? p.price : null };
}

export async function getRelatedProducts(ids: number[]): Promise<Product[]> {
  if (ids.length === 0) return [];
  if (DATA_SOURCE === "erp") {
    const results = await Promise.all(ids.map((id) => getProduct(id)));
    return results.filter((p): p is ProductDetail => p != null).map(toListItem);
  }
  return ALL_PRODUCTS.filter((p) => ids.includes(p.id)).map(toListItem);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const { data } = await getProducts({ sort: "newest", per_page: limit });
  return data;
}

/**
 * يجيب كل المنتجات المطابقة عبر الترقيم (per_page=100 — الحد الأقصى في العقد §5.1).
 * لِـ sitemap وصفحة الفئة. ملاحظة: الفئات الكبيرة جداً هتحتاج ترقيم server-side لاحقاً.
 */
export async function getAllProducts(
  params: ProductListParams = {},
): Promise<Product[]> {
  const per_page = 100;
  const first = await getProducts({ ...params, per_page, page: 1 });
  const all = [...first.data];
  for (let page = 2; page <= first.meta.last_page; page++) {
    const next = await getProducts({ ...params, per_page, page });
    all.push(...next.data);
  }
  return all;
}

export async function getCategories(): Promise<Category[]> {
  if (DATA_SOURCE === "erp") {
    const res = await erpFetch<Paginated<Category>>(`/categories?per_page=100`);
    return res.data;
  }
  return ALL_CATEGORIES;
}

export async function getCategory(id: number): Promise<Category | null> {
  const cats = await getCategories();
  return cats.find((c) => c.id === id) ?? null;
}

export async function getBrands(): Promise<Brand[]> {
  if (DATA_SOURCE === "erp") {
    const res = await erpFetch<Paginated<Brand>>(`/brands?per_page=100`);
    return res.data;
  }
  return ALL_BRANDS;
}

export async function getBrand(id: number): Promise<Brand | null> {
  const brands = await getBrands();
  return brands.find((b) => b.id === id) ?? null;
}
