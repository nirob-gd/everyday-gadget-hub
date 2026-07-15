import { Link } from "@tanstack/react-router";
import { type ReactNode } from "react";

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
  actionHref,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: string;
  actionHref?: string;
  children?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-brand">{eyebrow}</div>}
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action && actionHref && (
        <Link to={actionHref} className="text-sm font-semibold text-brand hover:underline">
          {action} →
        </Link>
      )}
    </div>
  );
}
