import { detectProductType, type ProductType } from "@/lib/productType";

/**
 * رسمة توضيحية نظيفة حسب نوع المنتج (كوع/ماسورة/تي…) — بهوية نور القدس،
 * تظهر لأي منتج مالوش صورة حقيقية. أسلوب خطّي موحّد بلون كريمي على خلفية الكارت.
 */
const TUBE = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 13,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};
const THIN = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Art({ type }: { type: ProductType }) {
  switch (type) {
    case "pipe":
      return (
        <>
          <path {...TUBE} d="M20 60 H100" />
          <path {...THIN} d="M44 47 V73 M76 47 V73" />
        </>
      );
    case "elbow":
      return <path {...TUBE} d="M44 102 V72 Q44 44 72 44 H102" />;
    case "tee":
      return (
        <>
          <path {...TUBE} d="M20 48 H100" />
          <path {...TUBE} d="M60 48 V102" />
        </>
      );
    case "coupling":
      return (
        <>
          <path {...TUBE} d="M22 60 H46 M74 60 H98" />
          <rect
            x="44"
            y="40"
            width="32"
            height="40"
            rx="6"
            fill="currentColor"
          />
        </>
      );
    case "reducer":
      return (
        <path
          fill="currentColor"
          d="M22 40 H58 L92 54 V66 L58 80 H22 Z"
        />
      );
    case "cap":
      return (
        <>
          <path {...TUBE} d="M30 84 H90" />
          <path
            fill="currentColor"
            d="M38 78 V60 Q38 34 60 34 Q82 34 82 60 V78 Z"
          />
        </>
      );
    case "valve":
      return (
        <>
          <path {...TUBE} d="M20 72 H100" />
          <path fill="currentColor" d="M48 72 L60 48 L72 72 Z" />
          <path {...THIN} d="M60 48 V26 M46 26 H74" />
        </>
      );
    case "mixer":
      return (
        <>
          <path {...TUBE} d="M42 100 V56 C42 36 62 30 84 30 H96" />
          <path {...THIN} d="M28 100 H60" />
        </>
      );
    case "strainer":
      return (
        <>
          <circle {...THIN} cx="60" cy="60" r="34" />
          <path {...THIN} d="M60 26 V94 M26 60 H94 M38 38 L82 82 M82 38 L38 82" />
        </>
      );
    case "drain":
      return (
        <>
          <rect {...THIN} x="26" y="26" width="68" height="68" rx="10" />
          <path {...THIN} d="M44 30 V90 M60 30 V90 M76 30 V90" />
        </>
      );
    default: // fitting — تقاطع مواسير عام
      return (
        <>
          <path {...TUBE} d="M20 60 H100" />
          <path {...TUBE} d="M60 20 V100" />
          <circle cx="60" cy="60" r="9" fill="currentColor" />
        </>
      );
  }
}

export function ProductTypeArt({ name }: { name: string }) {
  return (
    <svg
      className="typeart"
      viewBox="0 0 120 120"
      role="img"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Art type={detectProductType(name)} />
    </svg>
  );
}
