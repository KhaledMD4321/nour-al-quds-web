import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCategory, getCategories, getAllProducts } from "@/lib/erp";
import { parseIdFromParam, categoryHref, brandHref } from "@/lib/urls";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CategoryBrowser } from "@/components/CategoryBrowser";
import { getSiteConfig } from "@/lib/cms";

export const revalidate = 300;

type Params = { slug: string };

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ slug: `${c.id}-${c.slug}` }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = parseIdFromParam(slug);
  const category = id ? await getCategory(id) : null;
  if (!category) return { title: "الفئة غير موجودة" };
  return {
    title: category.name,
    description: `تصفّح منتجات ${category.name} من نور القدس — اسأل عن السعر والتوافر عبر واتساب.`,
    alternates: { canonical: categoryHref(category) },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const id = parseIdFromParam(slug);
  if (!id) notFound();

  const category = await getCategory(id);
  if (!category) notFound();

  // canonical redirect لو الـ slug اتغيّر
  const canonical = `${category.id}-${category.slug}`;
  if (slug !== canonical) redirect(categoryHref(category));

  // كل منتجات الفئة تُرسَل للعميل ويتم فلترتها/ترتيبها هناك (الصفحة تبقى SSG)
  const [products, site] = await Promise.all([
    getAllProducts({ category_id: id }),
    getSiteConfig(),
  ]);
  const waCfg = { number: site.whatsapp, defaultMessage: site.waDefaultMessage };

  return (
    <main className="flex-1">
      <div className="wrap">
        <Breadcrumb
          items={[
            { label: "الرئيسية", href: "/" },
            category.brand
              ? { label: category.brand.name, href: brandHref(category.brand) }
              : { label: "المنتجات", href: "/search" },
            { label: category.name },
          ]}
        />

        <div className="catintro">
          <span className="eyebrow">{category.brand?.name ?? "فئة"}</span>
          <h1>{category.name}</h1>
          <p>
            تشكيلة {category.name}
            {category.brand ? ` من ${category.brand.name}` : ""} المتوفّرة لدى نور القدس — بأسعار
            الجملة و{site.shipping}. اسأل عن السعر والتوافر لأي صنف عبر واتساب.
          </p>
        </div>

        <div style={{ paddingBottom: 60 }}>
          <CategoryBrowser products={products} waCfg={waCfg} />
        </div>
      </div>
    </main>
  );
}
