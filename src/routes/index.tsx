import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { WebBanner } from "@/components/WebBanner";
import { SectionHeader } from "@/components/SectionHeader";
import { CategoryCard } from "@/components/CategoryCard";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { Button } from "@/components/ui/button";
import { categoriesQuery, publicProductsQuery } from "@/lib/queries";
import { Truck, ShieldCheck, ListChecks, BadgeCheck, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mitu Home and Curtain — Curtains, Cushions & Home Decor in Bangladesh" },
      {
        name: "description",
        content:
          "Shop curtains, curtain rods, cushions, bed sheets, rugs, wallpapers, blinds and home decor — delivered across Bangladesh.",
      },
      { property: "og:title", content: "Mitu Home and Curtain — Curtains & Home Decor" },
      {
        property: "og:description",
        content: "Curtains, cushions, rugs, blinds and home decor delivered across Bangladesh.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home,
});

function useCountdown(hoursFromNow: number) {
  const targetRef = useRef<number>(Date.now() + hoursFromNow * 60 * 60 * 1000);
  const [msLeft, setMsLeft] = useState(() => targetRef.current - Date.now());

  useEffect(() => {
    const id = window.setInterval(() => {
      setMsLeft(Math.max(0, targetRef.current - Date.now()));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const totalSeconds = Math.floor(msLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");

  return { hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) };
}

function Home() {
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: products, isLoading } = useQuery(publicProductsQuery);
  const countdown = useCountdown(6);

  const featured = (products ?? []).filter((p) => p.isFeatured);
  const favorites = (featured.length > 0 ? featured : (products ?? [])).slice(0, 8);
  const deals = (products ?? []).filter((p) => p.discountPercent).slice(0, 8);
  const flashDeals = deals.slice(0, 6);

  const props = [
    { icon: Truck, title: "Fast local delivery", desc: "Clear delivery charge and easy order tracking." },
    { icon: ShieldCheck, title: "Reliable checkout", desc: "Simple checkout with order confirmation." },
    { icon: ListChecks, title: "Curated catalog", desc: "Home textiles grouped the way you shop." },
    { icon: BadgeCheck, title: "Verified orders", desc: "Every order goes through confirmation and QC." },
  ];

  return (
    <>
      <WebBanner />

      <section className="container-page py-16 sm:py-20">
        <SectionHeader
          eyebrow="Browse"
          title="Product categories"
          subtitle="Curtains, bedding, rugs and everything that finishes a room."
          action="View All"
          actionHref="/shop"
        />
        <div className="grid grid-cols-3 gap-3 sm:gap-4 md:grid-cols-4">
          {categories.map((c) => <CategoryCard key={c.slug} category={c} />)}
        </div>
      </section>

      {flashDeals.length > 0 && (
        <section className="border-y bg-brand">
          <div className="container-page py-6 sm:py-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-brand-foreground">
                <Zap size={20} className="fill-brand-foreground" />
                <h2 className="text-xl font-bold tracking-tight sm:text-2xl">Flash Sale</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-lg bg-background/15 px-3 py-1.5 text-brand-foreground">
                  <span className="text-xs font-medium opacity-90">Ends in</span>
                  <div className="ml-1 flex items-center gap-1 font-mono text-sm font-bold">
                    <span className="rounded bg-background/20 px-1.5 py-0.5">{countdown.hours}</span>
                    <span>:</span>
                    <span className="rounded bg-background/20 px-1.5 py-0.5">{countdown.minutes}</span>
                    <span>:</span>
                    <span className="rounded bg-background/20 px-1.5 py-0.5">{countdown.seconds}</span>
                  </div>
                </div>
                <Link
                  to="/shop"
                  search={{ deal: "flash" }}
                  className="hidden text-sm font-semibold text-brand-foreground hover:underline sm:inline-block"
                >
                  See all →
                </Link>
              </div>
            </div>

            <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:px-0 lg:grid-cols-6">
              {flashDeals.map((p) => (
                <div key={p.id} className="w-40 shrink-0 snap-start sm:w-auto">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            <div className="mt-4 text-center sm:hidden">
              <Link
                to="/shop"
                search={{ deal: "flash" }}
                className="text-sm font-semibold text-brand-foreground hover:underline"
              >
                See all deals →
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="container-page py-16 sm:py-20">
        <SectionHeader
          eyebrow="Loved by customers"
          title="Customer favorites"
          subtitle="Hand-picked pieces from our current collection."
          action="View all"
          actionHref="/shop"
        />
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : favorites.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {favorites.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {deals.length > 0 && (
        <section className="border-t bg-gradient-to-b from-primary-soft/60 to-background">
          <div className="container-page py-16 sm:py-20">
            <SectionHeader
              eyebrow="Limited time"
              title="Deals for You"
              subtitle="Current markdowns from our catalog."
              action="See all deals"
              actionHref="/shop"
            />
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {deals.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      <section className="container-page py-16 sm:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {props.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border bg-card p-6">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft text-brand">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-[oklch(0.5_0.09_200)] px-6 py-16 text-center text-brand-foreground sm:py-20">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Dress every window in your home</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm opacity-90 sm:text-base">
            Browse the full catalog, filter by category, compare prices, and order in a few clicks.
          </p>
          <div className="mt-8">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/shop">Go to Shop</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed p-16 text-center">
      <p className="font-semibold">No products published yet</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Our collection is being added right now — please check back shortly.
      </p>
    </div>
  );
}
