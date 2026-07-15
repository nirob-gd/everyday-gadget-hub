import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { categories, getByCategory } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const category = categories.find((c) => c.slug === params.slug);
    if (!category) throw notFound();
    return { category, products: getByCategory(params.slug) };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.category.name} — GadgetHub` },
          { name: "description", content: `Shop ${loaderData.category.name.toLowerCase()} at GadgetHub with fast delivery across Bangladesh.` },
        ]
      : [{ title: "Category — GadgetHub" }, { name: "robots", content: "noindex" }],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { category, products } = Route.useLoaderData();
  return (
    <div className="container-page py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-brand">Category</div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{category.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{products.length} products</p>
        </div>
        <Link to="/shop" className="text-sm font-semibold text-brand hover:underline">View all products →</Link>
      </div>
      {products.length === 0 ? (
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
