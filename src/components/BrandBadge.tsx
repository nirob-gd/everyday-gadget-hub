export function BrandBadge({ name }: { name: string }) {
  return (
    <div className="shrink-0 rounded-full border bg-card px-5 py-2.5 text-sm font-semibold text-muted-foreground grayscale transition-all hover:border-brand hover:text-brand hover:grayscale-0">
      {name}
    </div>
  );
}
