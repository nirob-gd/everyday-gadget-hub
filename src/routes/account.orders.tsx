import { createFileRoute } from "@tanstack/react-router";
import { mockOrders, formatBDT } from "@/lib/catalog";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/account/orders")({
  head: () => ({ meta: [{ title: "My Orders — GadgetHub" }, { name: "description", content: "Track your GadgetHub orders." }] }),
  component: Orders,
});

function Orders() {
  return (
    <div>
      <h2 className="text-xl font-bold">Order history</h2>
      <p className="mt-1 text-sm text-muted-foreground">Sample data — connect a backend to persist real orders.</p>

      <div className="mt-6 overflow-hidden rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="px-4 py-4 font-semibold">{o.id}</td>
                <td className="px-4 py-4 text-muted-foreground">{o.date}</td>
                <td className="px-4 py-4">{o.items}</td>
                <td className="px-4 py-4">
                  <Badge variant={o.status === "Delivered" ? "default" : "secondary"}>{o.status}</Badge>
                </td>
                <td className="px-4 py-4 text-right font-semibold">{formatBDT(o.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
