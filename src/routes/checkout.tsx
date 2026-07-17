import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { z } from "zod";
import { Package, ShieldCheck, Truck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatBDT, getProduct, type Product } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

type CheckoutSearch = {
  product?: string;
  qty?: number;
};

export const Route = createFileRoute("/checkout")({
  validateSearch: (search: Record<string, unknown>): CheckoutSearch => ({
    product: typeof search.product === "string" ? search.product : undefined,
    qty: typeof search.qty === "number" && search.qty > 0 ? Math.floor(search.qty) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Checkout — Mitu Home and Curtain" },
      { name: "description", content: "Complete your order with fast delivery across Bangladesh." },
      { property: "og:title", content: "Checkout — Mitu Home and Curtain" },
      { property: "og:description", content: "Complete your order with fast delivery across Bangladesh." },
    ],
  }),
  component: CheckoutPage,
});

const orderSchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^01[0-9]{9}$/, "Enter a valid 11-digit Bangladeshi mobile number"),
  email: z.string().trim().email("Enter a valid email").max(120).optional().or(z.literal("")),
  address: z.string().trim().min(8, "Please enter your full address").max(300),
  city: z.string().trim().min(2, "Please enter a city").max(60),
  area: z.string().trim().min(2, "Please enter an area/thana").max(60),
  notes: z.string().trim().max(300).optional().or(z.literal("")),
  payment: z.enum(["cod", "bkash", "nagad"]),
  bkashNumber: z.string().trim().optional().or(z.literal("")),
});

function CheckoutPage() {
  const { product: buyNowSlug, qty: buyNowQty } = Route.useSearch();
  const { cart, cartTotal, clearCart } = useStore();
  const navigate = useNavigate();

  // Buy Now takes priority: if a valid product slug is present, checkout only that item.
  const buyNowItem = useMemo(() => {
    if (!buyNowSlug) return null;
    const p = getProduct(buyNowSlug);
    if (!p) return null;
    return { product: p, qty: buyNowQty ?? 1 };
  }, [buyNowSlug, buyNowQty]);

  const items: { product: Product; qty: number }[] = buyNowItem ? [buyNowItem] : cart;
  const subtotal = buyNowItem
    ? buyNowItem.product.price * buyNowItem.qty
    : cartTotal;
  const shipping = subtotal >= 3000 || subtotal === 0 ? 0 : 120;
  const grandTotal = subtotal + shipping;

  const [payment, setPayment] = useState<"cod" | "bkash" | "nagad">("cod");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placed, setPlaced] = useState<string | null>(null);

  if (items.length === 0 && !placed) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-md rounded-3xl border bg-card p-10 text-center">
          <h1 className="text-2xl font-bold">Nothing to check out</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add items to your cart or pick a product to buy directly.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/shop">Go to shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="container-page py-20">
        <div className="mx-auto max-w-md rounded-3xl border bg-card p-10 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary-soft text-brand">
            <CheckCircle2 size={30} />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Order placed!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your order <span className="font-semibold text-foreground">{placed}</span> has been received.
            We'll call you shortly to confirm delivery.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button asChild>
              <Link to="/account/orders">View orders</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/shop">Continue shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = orderSchema.safeParse({
      fullName: fd.get("fullName"),
      phone: fd.get("phone"),
      email: fd.get("email"),
      address: fd.get("address"),
      city: fd.get("city"),
      area: fd.get("area"),
      notes: fd.get("notes"),
      payment,
      bkashNumber: fd.get("bkashNumber"),
    });

    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errs[String(issue.path[0])] = issue.message;
      }
      setErrors(errs);
      toast.error("Please fix the highlighted fields.");
      return;
    }

    if ((payment === "bkash" || payment === "nagad") && !parsed.data.bkashNumber) {
      setErrors({ bkashNumber: `Enter the ${payment === "bkash" ? "bKash" : "Nagad"} number used for payment` });
      return;
    }

    setErrors({});
    const orderId = `ORD-${Math.floor(10000 + Math.random() * 89999)}`;
    if (!buyNowItem) clearCart();
    setPlaced(orderId);
    toast.success(`Order ${orderId} placed successfully`);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
    void navigate;
  }

  const inputCls =
    "w-full rounded-lg border bg-background px-3 py-2.5 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {buyNowItem ? "Buying now — 1 item" : `${items.length} item${items.length > 1 ? "s" : ""} in your order`}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <section className="rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-bold">Contact & delivery</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.fullName}>
                <input name="fullName" required className={inputCls} placeholder="Your full name" />
              </Field>
              <Field label="Mobile number" error={errors.phone}>
                <input name="phone" required inputMode="numeric" maxLength={11} className={inputCls} placeholder="01XXXXXXXXX" />
              </Field>
              <Field label="Email (optional)" error={errors.email} className="sm:col-span-2">
                <input name="email" type="email" className={inputCls} placeholder="you@example.com" />
              </Field>
              <Field label="Address" error={errors.address} className="sm:col-span-2">
                <textarea name="address" required rows={3} className={inputCls} placeholder="House, road, block…" />
              </Field>
              <Field label="City" error={errors.city}>
                <input name="city" required className={inputCls} placeholder="Dhaka" />
              </Field>
              <Field label="Area / Thana" error={errors.area}>
                <input name="area" required className={inputCls} placeholder="Dhanmondi" />
              </Field>
              <Field label="Order notes (optional)" className="sm:col-span-2">
                <textarea name="notes" rows={2} className={inputCls} placeholder="Preferred delivery time, gate code, etc." />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-bold">Payment method</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {(
                [
                  { id: "cod", label: "Cash on Delivery", desc: "Pay when you receive" },
                  { id: "bkash", label: "bKash", desc: "Send Money manually" },
                  { id: "nagad", label: "Nagad", desc: "Send Money manually" },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.id}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    payment === opt.id ? "border-brand bg-primary-soft" : "hover:border-brand/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={opt.id}
                    checked={payment === opt.id}
                    onChange={() => setPayment(opt.id)}
                    className="sr-only"
                  />
                  <div className="text-sm font-semibold">{opt.label}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{opt.desc}</div>
                </label>
              ))}
            </div>

            {(payment === "bkash" || payment === "nagad") && (
              <div className="mt-5 rounded-xl border bg-secondary/50 p-4">
                <p className="text-sm">
                  Send <span className="font-bold">{formatBDT(grandTotal)}</span> to our{" "}
                  <span className="font-semibold">{payment === "bkash" ? "bKash" : "Nagad"} Merchant</span>{" "}
                  number <span className="font-bold">01700-000000</span> and enter your sender number below.
                </p>
                <div className="mt-4">
                  <Field label={`Your ${payment === "bkash" ? "bKash" : "Nagad"} number`} error={errors.bkashNumber}>
                    <input
                      name="bkashNumber"
                      inputMode="numeric"
                      maxLength={11}
                      className={inputCls}
                      placeholder="01XXXXXXXXX"
                    />
                  </Field>
                </div>
              </div>
            )}
          </section>
        </div>

        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border bg-card p-6">
            <h2 className="text-lg font-bold">Your order</h2>
            <ul className="mt-4 space-y-3">
              {items.map(({ product, qty }) => (
                <li key={product.id} className="flex gap-3">
                  <div className={`grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg ${product.gradient}`}>
                    <Package className="h-6 w-6 text-white/80" strokeWidth={1.2} />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <span className="line-clamp-2 text-sm font-semibold">{product.name}</span>
                    <span className="text-xs text-muted-foreground">Qty {qty}</span>
                  </div>
                  <span className="text-sm font-semibold">{formatBDT(product.price * qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-semibold">{formatBDT(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-semibold">
                  {shipping === 0 ? <span className="text-brand">Free</span> : formatBDT(shipping)}
                </dd>
              </div>
            </dl>
            <div className="mt-3 flex items-baseline justify-between border-t pt-3">
              <span className="text-sm font-semibold">Total</span>
              <span className="text-2xl font-bold">{formatBDT(grandTotal)}</span>
            </div>
            <Button type="submit" size="lg" className="mt-5 w-full">
              Place order
            </Button>
          </div>

          <div className="rounded-2xl border bg-card p-5 text-sm">
            <div className="flex items-center gap-2 text-brand"><Truck size={16} /> Fast delivery across Bangladesh</div>
            <div className="mt-2 flex items-center gap-2 text-brand"><ShieldCheck size={16} /> Easy returns within 7 days</div>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className ?? ""}`}>
      <span className="mb-1.5 block text-xs font-semibold text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
