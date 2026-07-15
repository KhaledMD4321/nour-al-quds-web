import { WaIcon } from "./WaIcon";
import { waLink } from "@/lib/site";

/** الزر العائم — href يُمرَّر من الـ layout بإعدادات الـ CMS (والافتراضي الثابت fallback). */
export function WhatsAppFab({ href = waLink() }: { href?: string }) {
  return (
    <a className="fab" href={href} target="_blank" rel="noopener noreferrer" aria-label="واتساب">
      <WaIcon />
    </a>
  );
}
