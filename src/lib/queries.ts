import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  PRODUCT_SELECT,
  mapCategory,
  mapProduct,
  type CategoryRow,
  type ProductRow,
} from "./catalog";

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("id,name,slug,icon,sort_order")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data as unknown as CategoryRow[]).map(mapCategory);
  },
});

/** Products visible on the storefront (RLS returns active products only for visitors). */
export const publicProductsQuery = queryOptions({
  queryKey: ["products", "public"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_active", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as unknown as ProductRow[]).map(mapProduct);
  },
});

export const publicProductQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(PRODUCT_SELECT)
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data ? mapProduct(data as unknown as ProductRow) : null;
    },
  });

/** Every product, including hidden ones — only returns rows for admins (RLS). */
export const adminProductsQuery = queryOptions({
  queryKey: ["products", "admin"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as unknown as ProductRow[]).map(mapProduct);
  },
});

export type OrderRow = {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string | null;
  payment_method: string;
  payment_reference: string | null;
  subtotal: number | string;
  delivery_fee: number | string;
  total: number | string;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  order_items?: OrderItemRow[];
};

export type OrderItemRow = {
  id: string;
  product_name: string;
  unit_price: number | string;
  quantity: number;
};

export const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

const ORDER_SELECT =
  "id,order_number,customer_name,phone,email,address,city,payment_method,payment_reference,subtotal,delivery_fee,total,status,notes,created_at,order_items(id,product_name,unit_price,quantity)";

export const adminOrdersQuery = queryOptions({
  queryKey: ["orders", "admin"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(ORDER_SELECT)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []) as unknown as OrderRow[];
  },
});

export const adminOrderQuery = (id: string) =>
  queryOptions({
    queryKey: ["order", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("orders").select(ORDER_SELECT).eq("id", id).maybeSingle();
      if (error) throw error;
      return (data ?? null) as unknown as OrderRow | null;
    },
  });

export const isAdminQuery = queryOptions({
  queryKey: ["is-admin"],
  queryFn: async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;
    const { data, error } = await supabase.rpc("has_role", { _user_id: userData.user.id, _role: "admin" });
    if (error) throw error;
    return Boolean(data);
  },
});
