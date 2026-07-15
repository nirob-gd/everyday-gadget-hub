import { Link } from "@tanstack/react-router";
import { Package, ShieldCheck, Truck, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, formatBDT } from "@/lib/catalog";
import { Rating } from "./Rating";

export function Hero() {
  const spot = products.find((p) => p.slug === "hidizs-s9-pro") ?? products[0];

  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-br from-primary-soft via-background to-background">
      <div className="container-page grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" /> Spotlight this week
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Everyday gadgets and audio,{" "}
            <span className="text-brand">delivered across Bangladesh</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Hand-picked earphones, portable DACs, cables and accessories from the brands enthusiasts trust — with reliable local delivery and easy checkout.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/product/$slug" params={{ slug: spot.slug }}>Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/shop">Browse catalog</Link>
            </Button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: ShoppingBag, label: "8+ Categories" },
              { icon: Truck, label: "Fast Delivery" },
              { icon: ShieldCheck, label: "Easy Checkout" },
              { icon: Package, label: "Verified Orders" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-xl border bg-card/60 px-3 py-2.5 backdrop-blur">
                <Icon size={18} className="shrink-0 text-brand" />
                <span className="min-w-0 truncate text-xs font-semibold sm:text-sm">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className={`relative mx-auto flex aspect-square max-w-md items-center justify-center overflow-hidden rounded-3xl border shadow-2xl shadow-brand/10 ${spot.gradient}`}>
            <Package className="h-48 w-48 text-white/80 drop-shadow-2xl" strokeWidth={1} />
            {spot.discountPercent && (
              <span className="absolute left-5 top-5 rounded-full bg-destructive px-3 py-1 text-xs font-bold text-destructive-foreground">
                -{spot.discountPercent}% today
              </span>
            )}
          </div>

          <div className="absolute -bottom-6 left-1/2 w-[92%] max-w-md -translate-x-1/2 rounded-2xl border bg-background p-5 shadow-xl">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-brand">{spot.category}</div>
            <div className="mt-1 font-bold">{spot.name}</div>
            <div className="mt-1"><Rating rating={spot.rating} reviewCount={spot.reviewCount} /></div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold">{formatBDT(spot.price)}</span>
              {spot.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">{formatBDT(spot.originalPrice)}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
