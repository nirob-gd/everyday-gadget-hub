import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminOrdersQuery, ORDER_STATUSES, type OrderRow, type OrderStatus } from "@/lib/queries";
import { productImageSrc, formatBDT } from "@/lib/catalog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const qc = useQueryClient();
  const { data: orders = [] } = useQuery(adminOrdersQuery);
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [open, setOpen] = useState<OrderRow | null>(null);
  const [note, setNote] = useState("");

  const rows = useMemo(
    () =>
      orders.filter((o) => {
        const d = o.created_at.slice(0, 10);
        return (
          (status === "all" || o.status === status) &&
          (search === "" ||
            o.order_number.toLowerCase().includes(search.toLowerCase()) ||
            o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
            o.phone.includes(search)) &&
          (from === "" || d >= from) &&
          (to === "" || d <= to)
        );
      }),
    [orders, status, search, from, to],
  );

  async function setOrderStatus(id: string, next: OrderStatus) {
    const { error } = await supabase.from("orders").update({ status: next }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Order marked ${next}`);
    qc.invalidateQueries({ queryKey: ["orders"] });
    setOpen((o) => (o && o.id === id ? { ...o, status: next } : o));
  }

  async function saveNote(id: string) {
    const { error } = await supabase.from("orders").update({ notes: note }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Note saved");
    qc.invalidateQueries({ queryKey: ["orders"] });
  }

  const selectCls = "rounded-lg border bg-background px-3 py-2 text-sm";

  return (
    <div>
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search order, name or phone" className="max-w-xs" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
          <option value="all">All statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className={selectCls} />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className={selectCls} />
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((o) => (
              <tr key={o.id} className="cursor-pointer border-t hover:bg-muted/40" onClick={() => { setOpen(o); setNote(o.notes ?? ""); }}>
                <td className="px-4 py-3 font-semibold">{o.order_number}</td>
                <td className="px-4 py-3">{o.customer_name}</td>
                <td className="px-4 py-3">{o.order_items?.length ?? 0}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.created_at.slice(0, 10)}</td>
                <td className="px-4 py-3 capitalize">{o.status}</td>
                <td className="px-4 py-3 text-right font-semibold">{formatBDT(Number(o.total))}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="mt-6 rounded-2xl border bg-card p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold">{open.order_number}</h2>
              <p className="text-sm text-muted-foreground">{open.created_at.slice(0, 16).replace("T", " ")}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setOpen(null)}>Close</Button>
          </div>

          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            <div className="space-y-1 text-sm">
              <div className="font-semibold">Customer</div>
              <div>{open.customer_name}</div>
              <div className="text-muted-foreground">{open.phone}</div>
              {open.email && <div className="text-muted-foreground">{open.email}</div>}
              <div className="text-muted-foreground">{open.address}{open.city ? `, ${open.city}` : ""}</div>
              <div className="pt-2 text-muted-foreground">
                Payment: <span className="font-medium text-foreground">{open.payment_method}</span>
                {open.payment_reference ? ` (${open.payment_reference})` : ""}
              </div>
            </div>
            <div className="text-sm">
              <div className="font-semibold">Items</div>
              <ul className="mt-1 space-y-1">
                {(open.order_items ?? []).map((it) => (
                  <li key={it.id} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2">
                      {it.selected_image_path && (
                        <img
                          src={productImageSrc(it.selected_image_path)}
                          alt={it.product_name}
                          className="h-10 w-10 shrink-0 rounded-md border object-cover"
                        />
                      )}
                      <span>{it.product_name} × {it.quantity}</span>
                    </span>
                    <span className="font-medium">{formatBDT(Number(it.unit_price) * it.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex justify-between border-t pt-2 font-semibold">
                <span>Total</span><span>{formatBDT(Number(open.total))}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {ORDER_STATUSES.map((s) => (
              <Button key={s} size="sm" variant={open.status === s ? "default" : "outline"} onClick={() => setOrderStatus(open.id, s)}>
                {s}
              </Button>
            ))}
          </div>

          <div className="mt-6">
            <label className="text-sm font-semibold">Internal notes</label>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="mt-1 w-full rounded-lg border bg-background px-3 py-2 text-sm" />
            <Button size="sm" className="mt-2" onClick={() => saveNote(open.id)}>Save note</Button>
          </div>
        </div>
      )}
    </div>
  );
}
