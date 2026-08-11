import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/account/orders")({
  head: () => ({
    meta: [
      { title: "My Orders — Mitu Home and Curtain" },
      { name: "description", content: "Track your Mitu Home and Curtain orders." },
      { property: "og:title", content: "My Orders — Mitu Home and Curtain" },
      { property: "og:description", content: "Track your curtain and home decor orders." },
    ],
  }),
  component: Orders,
});

function Orders() {
  return (
    <div>
      <h2 className="text-xl font-bold">Order history</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Orders you place are confirmed by phone by our team.
      </p>

      <div className="mt-6 rounded-2xl border border-dashed p-16 text-center">
        <p className="text-muted-foreground">
          No orders to show here yet. Keep the order number from your confirmation — our team can look it up for you.
        </p>
        <Button className="mt-4" asChild><Link to="/shop">Start shopping</Link></Button>
      </div>
    </div>
  );
}
