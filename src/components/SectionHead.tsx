import type { ReactNode } from "react";

export function SectionHead({
  eyebrow,
  title,
  note,
  action,
}: {
  eyebrow?: string;
  title: string;
  note?: string;
  action?: ReactNode;
}) {
  return (
    <div className="sechead">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{title}</h2>
      </div>
      {note && <p>{note}</p>}
      {action}
    </div>
  );
}
