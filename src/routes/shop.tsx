import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { products, categories, brands } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop all gadgets & audio gear — GadgetHub" },
      { name: "description", content: "Browse the full catalog with filters for category, brand, price and sort order." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<string>("all");
  const [brand, setBrand] = useState<string>("all");
  const [sort, setSort] = useState<string>("popular");
  const [maxPrice, setMaxPrice] = useState<number>(20000);

  const filtered = useMemo(() => {
    let list = products.filter((p) =>
      (cat === "all" || p.categorySlug === cat) &&
      (brand === "all" || p.brand === brand) &&
      p.price <= maxPrice &&
      (query === "" || p.name.toLowerCase().includes(query.toLowerCase()))
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [query, cat, brand, sort, maxPrice]);

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
        <p className="mt-1 text-sm text-muted-foreground">{filtered.length} products</p>
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
          <FilterGroup label="Brand">
            <FilterButton active={brand === "all"} onClick={() => setBrand("all")}>All brands</FilterButton>
            {brands.map((b) => (
              <FilterButton key={b} active={brand === b} onClick={() => setBrand(b)}>{b}</FilterButton>
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
                { v: "popular", l: "Popular" },
                { v: "rating", l: "Top rated" },
                { v: "price-asc", l: "Price ↑" },
                { v: "price-desc", l: "Price ↓" },
              ].map((s) => (
                <Button key={s.v} size="sm" variant={sort === s.v ? "default" : "outline"} onClick={() => setSort(s.v)}>{s.l}</Button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-16 text-center text-muted-foreground">
              No products match those filters.
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
