import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "./catalog";

export type CartItem = { product: Product; qty: number; selectedImagePath?: string };

/** Cart lines are unique per product + chosen image, so the same product can be added twice with different designs. */
export const cartItemKey = (item: Pick<CartItem, "product" | "selectedImagePath">) =>
  `${item.product.id}::${item.selectedImagePath ?? ""}`;

type StoreCtx = {
  cart: CartItem[];
  wishlist: string[];
  addToCart: (p: Product, qty?: number, selectedImagePath?: string) => void;
  removeFromCart: (key: string) => void;
  updateQty: (key: string, qty: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string) => void;
  isWished: (id: string) => boolean;
  cartCount: number;
  cartTotal: number;
};

const Ctx = createContext<StoreCtx | null>(null);

const isBrowser = typeof window !== "undefined";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!isBrowser) return;
    try {
      const c = localStorage.getItem("cart");
      const w = localStorage.getItem("wishlist");
      if (c) setCart(JSON.parse(c));
      if (w) setWishlist(JSON.parse(w));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  const value = useMemo<StoreCtx>(() => ({
    cart,
    wishlist,
    addToCart: (p, qty = 1, selectedImagePath) =>
      setCart((prev) => {
        const key = cartItemKey({ product: p, selectedImagePath });
        const found = prev.find((i) => cartItemKey(i) === key);
        if (found) return prev.map((i) => (cartItemKey(i) === key ? { ...i, qty: i.qty + qty } : i));
        return [...prev, { product: p, qty, selectedImagePath }];
      }),
    removeFromCart: (key) => setCart((prev) => prev.filter((i) => cartItemKey(i) !== key)),
    updateQty: (key, qty) =>
      setCart((prev) => prev.map((i) => (cartItemKey(i) === key ? { ...i, qty: Math.max(1, qty) } : i))),
    clearCart: () => setCart([]),
    toggleWishlist: (id) =>
      setWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
    isWished: (id) => wishlist.includes(id),
    cartCount: cart.reduce((s, i) => s + i.qty, 0),
    cartTotal: cart.reduce((s, i) => s + i.qty * i.product.price, 0),
  }), [cart, wishlist]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useStore must be used inside StoreProvider");
  return c;
}
