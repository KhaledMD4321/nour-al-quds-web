import {
  GitMerge,
  Droplets,
  Bath,
  ShowerHead,
  Square,
  Flame,
  Filter,
  Wrench,
  Package,
  type LucideIcon,
} from "lucide-react";

/** خريطة أيقونة لكل فئة حسب الـ slug (مستقلة عن مصدر البيانات). */
const ICONS: Record<string, LucideIcon> = {
  "pipes-fittings": GitMerge,
  "water-systems": Droplets,
  "bathroom-sets": Bath,
  "mixers-taps": ShowerHead,
  "basins-sinks": Square,
  heaters: Flame,
  "water-filters": Filter,
  "tools-plumbing": Wrench,
};

export function categoryIcon(slug: string): LucideIcon {
  return ICONS[slug] ?? Package;
}
