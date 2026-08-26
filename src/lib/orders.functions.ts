import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const placeOrderSchema = z.object({
  fullName: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .regex(/^01[0-9]{9}$/),
  email: z.string().trim().email().max(120).optional().or(z.literal("")),
  address: z.string().trim().min(8).max(300),
  city: z.string().trim().min(2).max(60),
  notes: z.string().trim().max(300).optional().or(z.literal("")),
  payment: z.enum(["cod", "bkash", "nagad"]),
  paymentReference: z.string().trim().max(30).optional().or(z.literal("")),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        qty: z.number().int().min(1).max(50),
      }),
    )
    .min(1)
    .max(50),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;

const FREE_SHIPPING_THRESHOLD = 3000;
const DELIVERY_FEE = 120;

/**
 * Creates an order entirely server-side: prices, totals and status are derived
 * from the database, never from client input.
 */
export const placeOrder = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => placeOrderSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const ids = [...new Set(data.items.map((i) => i.productId))];
    const { data: products, error: productsError } = await supabaseAdmin
      .from("products")
      .select("id,name,price,sale_price,is_active")
      .in("id", ids)
      .eq("is_active", true);

    if (productsError) {
      console.error("[placeOrder] product lookup failed", productsError);
      throw new Error("Could not place your order. Please try again.");
    }
    if (!products || products.length !== ids.length) {
      throw new Error("Some items are no longer available.");
    }

    const byId = new Map(products.map((p) => [p.id, p]));
    const lines = data.items.map(({ productId, qty }) => {
      const p = byId.get(productId)!;
      const unitPrice = Number(p.sale_price ?? p.price);
      return { productId, name: p.name, unitPrice, qty };
    });

    const subtotal = lines.reduce((sum, l) => sum + l.unitPrice * l.qty, 0);
    const deliveryFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : DELIVERY_FEE;
    const total = subtotal + deliveryFee;

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .insert({
        customer_name: data.fullName,
        phone: data.phone,
        email: data.email || null,
        address: data.address,
        city: data.city,
        payment_method: data.payment,
        payment_reference: data.paymentReference || null,
        subtotal,
        delivery_fee: deliveryFee,
        total,
        status: "pending",
        notes: data.notes || null,
      })
      .select("id,order_number")
      .single();

    if (error || !order) {
      console.error("[placeOrder] order insert failed", error);
      throw new Error("Could not place your order. Please try again.");
    }

    const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
      lines.map((l) => ({
        order_id: order.id,
        product_id: l.productId,
        product_name: l.name,
        unit_price: l.unitPrice,
        quantity: l.qty,
      })),
    );

    if (itemsError) {
      console.error("[placeOrder] order items insert failed", itemsError);
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      throw new Error("Could not place your order. Please try again.");
    }

    return { orderNumber: order.order_number, subtotal, deliveryFee, total };
  });
