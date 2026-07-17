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
};

export function CategoryCard({ category }: { category: Category }) {
  const Icon = iconMap[category.icon] ?? Headphones;
  return (
    <Link
      to="/category/$slug"
      params={{ slug: category.slug }}
      className="group flex flex-col items-center gap-3 rounded-2xl border bg-card p-6 text-center transition-all hover:-translate-y-0.5 hover:border-brand hover:shadow-md"
    >
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft text-brand transition-transform group-hover:scale-110">
        <Icon size={26} strokeWidth={1.75} />
      </div>
      <div>
        <div className="text-sm font-semibold">{category.name}</div>
        <div className="text-xs text-muted-foreground">{category.count} items</div>
      </div>
    </Link>
  );
}
