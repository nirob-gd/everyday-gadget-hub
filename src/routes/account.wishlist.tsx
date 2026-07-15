import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { products } from "@/lib/catalog";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/account/wishlist")({
  head: () => ({ meta: [{ title: "My Wishlist — GadgetHub" }, { name: "description", content: "Products you've saved for later." }] }),
  component: Wishlist,
});

function Wishlist() {
  const { wishlist } = useStore();
  const items = products.filter((p) => wishlist.includes(p.id));

  return (
    <div>
      <h2 className="text-xl font-bold">Wishlist</h2>
      <p className="mt-1 text-sm text-muted-foreground">{items.length} saved product{items.length === 1 ? "" : "s"}.</p>

      {items.length === 0 ? (
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
