import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Package, Heart, ShoppingCart, Check, ArrowLeft } from "lucide-react";
import { formatBDT } from "@/lib/catalog";
import { publicProductQuery, publicProductsQuery } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/Rating";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Mitu Home and Curtain` },
      { name: "description", content: "Curtains, cushions, rugs and home decor delivered across Bangladesh." },
      { property: "og:title", content: "Mitu Home and Curtain" },
      { property: "og:description", content: "Curtains, cushions, rugs and home decor delivered across Bangladesh." },
      { property: "og:type", content: "product" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data: product, isLoading } = useQuery(publicProductQuery(slug));
  const { data: allProducts = [] } = useQuery(publicProductsQuery);
  const { addToCart, toggleWishlist, isWished } = useStore();
  const [qty, setQty] = useState(1);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const images = useMemo(() => product?.images ?? [], [product]);

  useEffect(() => {
    setSelectedPath(images[0]?.path ?? null);
  }, [images]);

  if (isLoading) {
    return <div className="container-page py-20 text-center text-muted-foreground">Loading product…</div>;
  }

  if (!product) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">This product may have been removed or is not published.</p>
        <Button className="mt-6" asChild><Link to="/shop">Back to shop</Link></Button>
      </div>
    );
  }

  const wished = isWished(product.id);
  const mainUrl = images.find((i) => i.path === selectedPath)?.url ?? product.imageUrl;
  const related = allProducts.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);

  return (
    <div className="container-page py-10">
      <Link to="/shop" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-brand">
        <ArrowLeft size={16} /> Back to shop
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          <div className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-3xl border ${mainUrl ? "" : product.gradient}`}>
            {mainUrl ? (
              <img src={mainUrl} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <Package className="h-56 w-56 text-white/80" strokeWidth={1} />
            )}
            {product.discountPercent && (
              <span className="absolute left-5 top-5 rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">
                -{product.discountPercent}%
              </span>
            )}
          </div>

          {images.length > 1 && (
            <>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img) => {
                  const active = img.path === selectedPath;
                  return (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setSelectedPath(img.path)}
                      aria-label={`Select image ${img.id}`}
                      aria-pressed={active}
                      className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                        active ? "border-brand ring-2 ring-brand/25" : "border-border hover:border-brand/50"
                      }`}
                    >
                      <img src={img.url} alt={product.name} loading="lazy" className="h-full w-full object-cover" />
                      {active && (
                        <span className="absolute bottom-1 right-1 grid h-5 w-5 place-items-center rounded-full bg-brand text-white">
                          <Check size={12} />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">
                Tap a design to select it — your choice is sent with the order.
              </p>
            </>
          )}
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-brand">{product.category}</div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
          {product.rating !== undefined && (
            <div className="mt-3"><Rating rating={product.rating} reviewCount={product.reviewCount} size={16} /></div>
          )}

          <div className="mt-6 flex items-baseline gap-3">
            <div className="text-3xl font-bold">{formatBDT(product.price)}</div>
            {product.originalPrice && (
              <div className="text-lg text-muted-foreground line-through">{formatBDT(product.originalPrice)}</div>
            )}
          </div>

          <p className="mt-6 whitespace-pre-line text-muted-foreground">{product.description}</p>

          <ul className="mt-6 space-y-2 text-sm">
            {["Quality-checked before dispatch", "Cash on delivery available", "Ships in 1-3 days across Bangladesh"].map((f) => (
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
                addToCart(product, qty, selectedPath ?? undefined);
                toast.success(`${product.name} added to cart`);
              }}
            >
              <ShoppingCart size={18} /> Add to cart
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/checkout" search={{ product: product.slug, qty, img: selectedPath ?? undefined }}>
                Buy Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" onClick={() => toggleWishlist(product.id)}>
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
