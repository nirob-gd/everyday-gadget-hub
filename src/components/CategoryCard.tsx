import { Link } from "@tanstack/react-router";
import type { Category } from "@/lib/catalog";
import {
  Blinds,
  Ruler,
  Sofa,
  BedDouble,
  Layers,
  Palette,
  LampCeiling,
  Home,
  Waves,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Blinds,
  Ruler,
  Sofa,
  BedDouble,
  Layers,
  Palette,
  LampCeiling,
  Home,
  Waves,
};

export function CategoryCard({ category }: { category: Category }) {
  const Icon = iconMap[category.icon] ?? Home;
  return (
    <Link
      to="/category/$slug"
      params={{ slug: category.slug }}
      className="group flex flex-col items-center gap-2 rounded-2xl border bg-card p-3 text-center transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md sm:gap-3 sm:p-6"
    >
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-brand transition-transform group-hover:scale-110 sm:h-14 sm:w-14">
        <Icon size={22} strokeWidth={1.75} className="sm:hidden" />
        <Icon size={26} strokeWidth={1.75} className="hidden sm:block" />
      </div>
      <div>
        <div className="text-xs font-semibold sm:text-sm">{category.name}</div>
        <div className="text-[11px] text-muted-foreground sm:text-xs">{category.count} items</div>
      </div>
    </Link>
  );
}
