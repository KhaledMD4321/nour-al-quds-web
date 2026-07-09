import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav className="crumb" aria-label="مسار التصفح">
      {items.map((item, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
          {i > 0 && <ChevronLeft aria-hidden="true" />}
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span className="cur">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
