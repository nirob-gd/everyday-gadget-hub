import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { categoriesQuery, publicProductsQuery } from "@/lib/queries";

export const Route = createFileRoute("/shop")({
  validateSearch: (search: Record<string, unknown>): { deal?: string } => ({
    deal: typeof search.deal === "string" ? search.deal : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Shop curtains, rugs & home decor — Mitu Home and Curtain" },
      { name: "description", content: "Browse the full Mitu Home and Curtain catalog with filters for category, price and sort order." },
      { property: "og:title", content: "Shop curtains, rugs & home decor — Mitu Home and Curtain" },
      { property: "og:description", content: "Browse curtains, cushions, bed sheets, rugs, blinds and decor delivered across Bangladesh." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: products, isLoading } = useQuery(publicProductsQuery);

  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [sort, setSort] = useState<string>("newest");
  const [maxPrice, setMaxPrice] = useState<number>(20000);

  const filtered = useMemo(() => {
    let list = (products ?? []).filter((p) =>
      (cat === "all" || p.categorySlug === cat) &&
      p.price <= maxPrice &&
      (query === "" || p.name.toLowerCase().includes(query.toLowerCase()))
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return list;
  }, [products, query, cat, sort, maxPrice]);

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isLoading ? "Loading products…" : `${filtered.length} products`}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-6">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Search</label>
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search products" className="pl-9" />
            </div>
          </div>
          <FilterGroup label="Category">
            <FilterButton active={cat === "all"} onClick={() => setCat("all")}>All</FilterButton>
            {categories.map((c) => (
              <FilterButton key={c.slug} active={cat === c.slug} onClick={() => setCat(c.slug)}>{c.name}</FilterButton>
            ))}
          </FilterGroup>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max Price: BDT {maxPrice.toLocaleString()}</label>
            <input type="range" min={500} max={20000} step={500} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-[var(--brand)]" />
          </div>
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground">Sort by</div>
            <div className="flex flex-wrap gap-2">
              {[
                { v: "newest", l: "Newest" },
                { v: "rating", l: "Top rated" },
                { v: "price-asc", l: "Price ↑" },
                { v: "price-desc", l: "Price ↓" },
              ].map((s) => (
                <Button key={s.v} size="sm" variant={sort === s.v ? "default" : "outline"} onClick={() => setSort(s.v)}>{s.l}</Button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-16 text-center text-muted-foreground">
              {(products ?? []).length === 0
                ? "No products have been published yet — check back soon."
                : "No products match those filters."}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-left text-sm transition ${active ? "bg-primary-soft font-semibold text-brand" : "text-muted-foreground hover:bg-muted"}`}
    >
      {children}
    </button>
  );
}
