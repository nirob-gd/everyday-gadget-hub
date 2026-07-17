import { Link } from "@tanstack/react-router";
import { Heart, ShoppingCart, Package } from "lucide-react";
import type { Product } from "@/lib/catalog";
import { formatBDT } from "@/lib/catalog";
import { Rating } from "./Rating";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, isWished } = useStore();
  const wished = isWished(product.id);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/5">
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className={cn("relative flex aspect-square items-center justify-center overflow-hidden", product.gradient)}
      >
        {product.discountPercent && (
          <span className="absolute left-3 top-3 rounded-full bg-destructive px-2 py-0.5 text-[11px] font-semibold text-destructive-foreground">
            -{product.discountPercent}%
          </span>
        )}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product.id);
          }}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:bg-background"
        >
          <Heart size={16} className={wished ? "fill-destructive text-destructive" : "text-foreground"} />
        </button>
        <Package className="h-20 w-20 text-white/70 drop-shadow-lg transition-transform group-hover:scale-110" strokeWidth={1.2} />
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <Button size="sm" className="w-full" variant="secondary">
            View
          </Button>
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[11px] font-medium uppercase tracking-wider text-brand">{product.category}</span>
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="line-clamp-2 min-h-10 text-sm font-semibold leading-snug hover:text-brand"
        >
          {product.name}
        </Link>
        <Rating rating={product.rating} reviewCount={product.reviewCount} />
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-base font-bold text-foreground">{formatBDT(product.price)}</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">{formatBDT(product.originalPrice)}</span>
            )}
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="h-9 w-9 rounded-full text-brand hover:bg-primary-soft hover:text-brand"
            onClick={() => addToCart(product)}
            aria-label="Add to cart"
          >
            <ShoppingCart size={16} />
          </Button>
        </div>
        <Button size="sm" className="mt-2 w-full" asChild>
          <Link to="/checkout" search={{ product: product.slug, qty: 1 }}>
            Buy Now
          </Link>
        </Button>
      </div>
    </div>
  );
}
