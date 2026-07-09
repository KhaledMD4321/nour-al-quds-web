import type { Availability } from "@/types/erp";

const META: Record<Availability, { cls: "in" | "req" | "out"; label: string }> = {
  in_stock: { cls: "in", label: "متوفر" },
  on_request: { cls: "req", label: "حسب الطلب" },
  out_of_stock: { cls: "out", label: "غير متوفر" },
};

export function availabilityMeta(a: Availability) {
  return META[a];
}

export function Badge({
  availability,
  absolute = false,
  label,
}: {
  availability: Availability;
  absolute?: boolean;
  label?: string;
}) {
  const m = META[availability];
  return (
    <span className={`badge badge--${m.cls}${absolute ? " badge--abs" : ""}`}>
      <span className="d" />
      {label ?? m.label}
    </span>
  );
}
