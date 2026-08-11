import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { categoriesQuery, publicProductsQuery } from "@/lib/queries";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Mitu Home and Curtain` },
      { name: "description", content: `Shop this category at Mitu Home and Curtain with delivery across Bangladesh.` },
      { property: "og:title", content: `Mitu Home and Curtain` },
      { property: "og:description", content: "Curtains, cushions, rugs and home decor delivered across Bangladesh." },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: allProducts, isLoading } = useQuery(publicProductsQuery);

  const category = categories.find((c) => c.slug === slug);
  const products = (allProducts ?? []).filter((p) => p.categorySlug === slug);

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-brand">Category</div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight capitalize sm:text-4xl">
            {category?.name ?? slug.replace(/-/g, " ")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${products.length} products`}
          </p>
        </div>
        <Link to="/shop" className="text-sm font-semibold text-brand hover:underline">View all products →</Link>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-16 text-center text-muted-foreground">
          No products in this category yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
