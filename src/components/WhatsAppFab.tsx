import { WaIcon } from "./WaIcon";
import { waLink } from "@/lib/site";

export function WhatsAppFab() {
  return (
    <a className="fab" href={waLink()} target="_blank" rel="noopener noreferrer" aria-label="واتساب">
      <WaIcon />
    </a>
  );
}
