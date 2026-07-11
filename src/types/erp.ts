/**
 * أنواع بيانات الـ ERP — مطابقة لـ API_CONTRACT.md (v1) حرفياً.
 * أي تغيير هنا لازم يتحدّث في العقد الأول.
 */

export type Availability = "in_stock" | "on_request" | "out_of_stock";

export interface BrandRef {
  id: number;
  name: string;
  slug: string;
}

export interface CategoryRef {
  id: number;
  name: string;
  slug: string;
}

/** Product — list item (§4.1) */
export interface Product {
  id: number;
  slug: string;
  name: string;
  name_en: string | null;
  brand: BrandRef | null;
  category: CategoryRef | null;
  /** الكود العام = products.code في الـ ERP (مثال PRD-00142). الـ ERP مفيهوش SKU مصنّع. */
  code: string;
  availability: Availability;
  /** لازم null لما price_visibility = false */
  price: number | null;
  price_visibility: boolean;
  currency: string;
  image_url: string | null;
  updated_at: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

/** Product — detail (§4.2) */
export interface ProductDetail extends Product {
  description: string | null;
  specs: ProductSpec[];
  related_product_ids: number[];
}

/** Category (§4.3) */
export interface Category {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
  products_count: number;
  /** v1.1: المصنّع الغالب لمنتجات الفئة — للتجميع «مصنّع ← فئاته». قد يكون null. */
  brand: BrandRef | null;
}

/** Brand (§4.4) */
export interface Brand {
  id: number;
  name: string;
  slug: string;
  logo_url: string | null;
  catalog_pdf_url: string | null;
  products_count: number;
}

/** Pagination envelope (§7) */
export interface Paginated<T> {
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface ProductListParams {
  page?: number;
  per_page?: number;
  category_id?: number;
  brand_id?: number;
  availability?: Availability;
  sort?: "newest" | "name";
  updated_since?: string;
  q?: string;
}
