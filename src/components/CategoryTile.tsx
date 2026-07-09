import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Category } from "@/types/erp";
import { categoryIcon } from "@/lib/categoryIcons";
import { categoryHref } from "@/lib/urls";

export function CategoryTile({ category }: { category: Category }) {
  const Icon = categoryIcon(category.slug);
  return (
    <Link className="cat" href={categoryHref(category)}>
      <span className="cat__ic">
        <Icon aria-hidden="true" />
      </span>
      <span className="cat__nm">{category.name}</span>
      <span className="cat__ct num">+{category.products_count} صنف</span>
      <span className="cat__go">
        تصفّح <ArrowLeft aria-hidden="true" />
      </span>
    </Link>
  );
}
