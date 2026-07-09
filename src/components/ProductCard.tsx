import Link from "next/link";
import type { Product } from "@/types/erp";
import { ProductImage } from "./ProductImage";
import { Badge } from "./Badge";
import { WaIcon } from "./WaIcon";
import { productHref } from "@/lib/urls";
import { waLink, waProductMessage } from "@/lib/site";

export function ProductCard({ product }: { product: Product }) {
  const href = productHref(product);
  const wa = waLink(waProductMessage(product.name, product.manufacturer_sku));

  return (
    <div className="pcard">
      <Link href={href} className="pcard__media" aria-label={product.name}>
        <ProductImage
          imageUrl={product.image_url}
          brandSlug={product.brand?.slug ?? null}
          sku={product.manufacturer_sku}
          name={product.name}
        />
        {product.brand && <span className="pcard__brand">{product.brand.name}</span>}
        <Badge availability={product.availability} absolute />
      </Link>
      <div className="pcard__body">
        <Link href={href} className="pcard__nm">
          {product.name}
        </Link>
        <div className="pcard__meta">
          {product.manufacturer_sku && (
            <span className="pcard__code" dir="ltr">
              {product.manufacturer_sku}
            </span>
          )}
          {product.category && <span>{product.category.name}</span>}
        </div>
        <div className="pcard__foot">
          <a className="wa-soft" href={wa} target="_blank" rel="noopener noreferrer">
            <WaIcon /> اسأل عن السعر والتوافر
          </a>
        </div>
      </div>
    </div>
  );
}
