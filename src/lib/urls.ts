import type { Product, Category, Brand } from "@/types/erp";

/** URLs use `{id}-{slug}`; the id is the canonical key (slug may change). */
export function productHref(p: Pick<Product, "id" | "slug">): string {
  return `/products/${p.id}-${p.slug}`;
}
export function categoryHref(c: Pick<Category, "id" | "slug">): string {
  return `/categories/${c.id}-${c.slug}`;
}
export function brandHref(b: Pick<Brand, "id" | "slug">): string {
  return `/brands/${b.id}-${b.slug}`;
}

/** Extract the leading numeric id from a `{id}-{slug}` route param. */
export function parseIdFromParam(param: string): number | null {
  const m = /^(\d+)/.exec(param);
  return m ? Number(m[1]) : null;
}
