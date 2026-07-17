import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBDT } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart — Mitu Home and Curtain" },
      { name: "description", content: "Review the curtains and home decor in your cart before checkout." },
      { property: "og:title", content: "Your Cart — Mitu Home and Curtain" },
      { property: "og:description", content: "Review the curtains and home decor in your cart before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, updateQty, removeFromCart, cartTotal, clearCart } = useStore();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-md rounded-3xl border bg-card p-10 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary-soft text-brand">
            <ShoppingBag size={28} />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Browse our curtains and home essentials and add something you love.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/shop">Continue shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  const shipping = cartTotal >= 3000 ? 0 : 120;
  const grandTotal = cartTotal + shipping;

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold tracking-tight">Your cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">{cart.length} item{cart.length > 1 ? "s" : ""} in your cart</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {cart.map(({ product, qty }) => (
            <div key={product.id} className="flex gap-4 rounded-2xl border bg-card p-4">
              <Link
                to="/product/$slug"
                params={{ slug: product.slug }}
                className={`relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl ${product.gradient}`}
              >
                <Package className="h-10 w-10 text-white/80" strokeWidth={1.2} />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] font-medium uppercase tracking-wider text-brand">
                      {product.category}
                    </div>
                    <Link
                      to="/product/$slug"
                      params={{ slug: product.slug }}
                      className="mt-0.5 line-clamp-2 text-sm font-semibold hover:text-brand"
                    >
                      {product.name}
                    </Link>
                  </div>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    aria-label="Remove item"
                    className="text-muted-foreground transition hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="mt-auto flex items-end justify-between pt-3">
                  <div className="flex items-center rounded-lg border">
                    <button
                      className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground"
                      onClick={() => updateQty(product.id, qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                    <button
                      className="grid h-9 w-9 place-items-center text-muted-foreground hover:text-foreground"
                      onClick={() => updateQty(product.id, qty + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-bold">{formatBDT(product.price * qty)}</div>
                    {qty > 1 && (
                      <div className="text-xs text-muted-foreground">
                        {formatBDT(product.price)} each
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between pt-2">
            <Button variant="ghost" asChild>
              <Link to="/shop">← Continue shopping</Link>
            </Button>
            <Button variant="ghost" onClick={clearCart} className="text-muted-foreground hover:text-destructive">
              Clear cart
            </Button>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border bg-card p-6">
          <h2 className="text-lg font-bold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-semibold">{formatBDT(cartTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Shipping</dt>
              <dd className="font-semibold">
                {shipping === 0 ? <span className="text-brand">Free</span> : formatBDT(shipping)}
              </dd>
            </div>
            {shipping > 0 && (
              <p className="text-xs text-muted-foreground">
                Free delivery on orders over {formatBDT(3000)}.
              </p>
            )}
          </dl>
          <div className="mt-4 flex items-baseline justify-between border-t pt-4">
            <span className="text-sm font-semibold">Total</span>
            <span className="text-2xl font-bold">{formatBDT(grandTotal)}</span>
          </div>
          <Button
            size="lg"
            className="mt-6 w-full"
            onClick={() => navigate({ to: "/checkout" })}
          >
            Proceed to checkout <ArrowRight size={18} />
          </Button>
        </aside>
      </div>
    </div>
  );
}
