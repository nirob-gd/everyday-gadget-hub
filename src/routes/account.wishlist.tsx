import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useStore } from "@/lib/store";
import { publicProductsQuery } from "@/lib/queries";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/account/wishlist")({
  head: () => ({
    meta: [
      { title: "My Wishlist — Mitu Home and Curtain" },
      { name: "description", content: "Curtains, cushions and decor you've saved for later." },
      { property: "og:title", content: "My Wishlist — Mitu Home and Curtain" },
      { property: "og:description", content: "Products you've saved for later at Mitu Home and Curtain." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist } = useStore();
  const { data: products = [], isLoading } = useQuery(publicProductsQuery);
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <div>
      <h2 className="text-xl font-bold">Wishlist</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {isLoading ? "Loading…" : `${items.length} saved product${items.length === 1 ? "" : "s"}.`}
      </p>

      {!isLoading && items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed p-16 text-center">
          <p className="text-muted-foreground">You haven't saved any products yet.</p>
          <Button className="mt-4" asChild><Link to="/shop">Browse the shop</Link></Button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
