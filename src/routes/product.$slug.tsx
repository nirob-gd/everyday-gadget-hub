import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Package, Heart, ShoppingCart, Check, ArrowLeft } from "lucide-react";
import { getProduct, products, formatBDT } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/Rating";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.product.name} — GadgetHub` },
          { name: "description", content: loaderData.product.description },
          { property: "og:title", content: loaderData.product.name },
          { property: "og:description", content: loaderData.product.description },
        ]
      : [{ title: "Product — GadgetHub" }, { name: "robots", content: "noindex" }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addToCart, toggleWishlist, isWished } = useStore();
  const [qty, setQty] = useState(1);

  const related = products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);
  const wished = isWished(product.id);

  return (
    <div className="container-page py-10">
      <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand">
        <ArrowLeft size={14} /> Back to shop
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border ${product.gradient}`}>
          <Package className="h-56 w-56 text-white/80" strokeWidth={1} />
          {product.discountPercent && (
            <span className="absolute left-5 top-5 rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-brand">
            {product.brand} · {product.category}
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
          <div className="mt-3"><Rating rating={product.rating} reviewCount={product.reviewCount} size={16} /></div>

          <div className="mt-6 flex items-baseline gap-3">
            <div className="text-3xl font-bold">{formatBDT(product.price)}</div>
            {product.originalPrice && (
              <div className="text-lg text-muted-foreground line-through">{formatBDT(product.originalPrice)}</div>
            )}
          </div>

          <p className="mt-6 text-muted-foreground">{product.description}</p>

          <ul className="mt-6 space-y-2 text-sm">
            {["1-year warranty on eligible items", "Cash on delivery available", "Ships in 1-3 days across Bangladesh"].map((f) => (
              <li key={f} className="flex items-center gap-2"><Check size={16} className="text-brand" />{f}</li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex h-11 items-center rounded-lg border">
              <button className="px-3 text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span className="w-8 text-center font-semibold">{qty}</span>
              <button className="px-3 text-lg" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
            <Button
              size="lg"
              onClick={() => {
                addToCart(product, qty);
                toast.success(`${product.name} added to cart`);
              }}
            >
              <ShoppingCart size={18} /> Add to cart
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/checkout" search={{ product: product.slug, qty }}>
                Buy Now
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => toggleWishlist(product.id)}
            >
              <Heart size={18} className={wished ? "fill-destructive text-destructive" : ""} />
              {wished ? "Saved" : "Wishlist"}
            </Button>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-6 text-2xl font-bold">Related products</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}
