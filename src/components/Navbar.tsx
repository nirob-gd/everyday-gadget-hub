import { Link } from "@tanstack/react-router";
import { Heart, Search, ShoppingCart, Menu, User, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/mitu-logo.svg.asset.json";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/account/orders", label: "Orders" },
  { to: "/account/wishlist", label: "Wishlist" },
];

export function Navbar() {
  const { cartCount, wishlist } = useStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center" aria-label="Mitu Home and Curtain">
          <img src={logoAsset.url} alt="Mitu Home and Curtain" className="h-10 w-auto" />
        </Link>

        <nav className="ml-8 hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-brand"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Button size="icon" variant="ghost" aria-label="Search" asChild>
            <Link to="/shop"><Search size={18} /></Link>
          </Button>
          <Button size="icon" variant="ghost" aria-label="Wishlist" asChild className="relative">
            <Link to="/account/wishlist">
              <Heart size={18} />
              {wishlist.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                  {wishlist.length}
                </span>
              )}
            </Link>
          </Button>
          <Button size="icon" variant="ghost" aria-label="Account" asChild className="hidden sm:inline-flex">
            <Link to="/account/profile"><User size={18} /></Link>
          </Button>
          <Button size="icon" variant="ghost" aria-label="Cart" asChild className="relative">
            <Link to="/shop">
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </Button>
          <Button size="icon" variant="ghost" className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </div>

      <div className={cn("border-t md:hidden", open ? "block" : "hidden")}>
        <nav className="container-page flex flex-col py-3">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-2 py-2.5 text-sm font-medium hover:bg-primary-soft hover:text-brand"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/account/profile"
            className="rounded-md px-2 py-2.5 text-sm font-medium hover:bg-primary-soft hover:text-brand"
            onClick={() => setOpen(false)}
          >
            Profile
          </Link>
          <Link
            to="/contact"
            className="rounded-md px-2 py-2.5 text-sm font-medium hover:bg-primary-soft hover:text-brand"
            onClick={() => setOpen(false)}
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
