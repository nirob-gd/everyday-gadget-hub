import { createFileRoute, Link } from "@tanstack/react-router";
import { WebBanner } from "@/components/WebBanner";
import { SectionHeader } from "@/components/SectionHeader";
import { CategoryCard } from "@/components/CategoryCard";
import { BrandBadge } from "@/components/BrandBadge";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { brands, categories, products } from "@/lib/catalog";
import { Truck, ShieldCheck, ListChecks, BadgeCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const topRated = products.filter((p) => p.topRated);
  const flashDeals = products.filter((p) => p.discountPercent).slice(0, 8);

  const props = [
    { icon: Truck, title: "Fast local delivery", desc: "Clear delivery charge and easy order tracking." },
    { icon: ShieldCheck, title: "Reliable checkout", desc: "Simple checkout with order confirmation." },
    { icon: ListChecks, title: "Curated catalog", desc: "Products grouped by real, useful categories." },
    { icon: BadgeCheck, title: "Verified orders", desc: "Every order goes through confirmation and QC." },
  ];

  return (
    <>
      <WebBanner />

      <section className="container-page py-16 sm:py-20">
        <SectionHeader
          eyebrow="Browse"
          title="Product categories"
          subtitle="Find gear grouped the way enthusiasts actually shop."
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {categories.map((c) => <CategoryCard key={c.slug} category={c} />)}
        </div>
      </section>

      <section className="border-y bg-secondary/40">
        <div className="container-page py-14">
          <SectionHeader
            eyebrow="Trusted brands"
            title="Shop popular audio & tech brands"
          />
          <div className="flex flex-wrap gap-3">
            {brands.map((b) => <BrandBadge key={b} name={b} />)}
          </div>
        </div>
      </section>

      <section className="container-page py-16 sm:py-20">
        <SectionHeader
          eyebrow="Loved by customers"
          title="Customer favorites"
          subtitle="Products with the highest ratings from our community."
          action="View all"
          actionHref="/shop"
        />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {topRated.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="border-t bg-gradient-to-b from-primary-soft/60 to-background">
        <div className="container-page py-16 sm:py-20">
          <SectionHeader
            eyebrow="Limited time"
            title="Flash Deals for You"
            subtitle="Discounts refresh weekly — grab them before they're gone."
            action="See all deals"
            actionHref="/shop"
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {flashDeals.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

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
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Find your next everyday gadget</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm opacity-90 sm:text-base">
            Browse the full catalog, filter by category, compare prices, and add to cart in a few clicks.
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
