import { Link } from "@tanstack/react-router";
import { Facebook } from "lucide-react";
import logoAsset from "@/assets/mitu-logo.svg.asset.json";

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-secondary/40">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <img src={logoAsset.url} alt="Mitu Home and Curtain" className="h-12 w-auto" />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Elegant curtains and home decor delivered across Bangladesh.
          </p>
          <a
            href="https://facebook.com"
            aria-label="Facebook"
            className="mt-4 inline-grid h-9 w-9 place-items-center rounded-full border text-muted-foreground transition hover:border-brand hover:text-brand"
          >
            <Facebook size={16} />
          </a>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Shop</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-brand">All products</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "curtains" }} className="hover:text-brand">Curtains</Link></li>
            <li><Link to="/category/$slug" params={{ slug: "cushions" }} className="hover:text-brand">Cushions</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/account/orders" className="hover:text-brand">Track order</Link></li>
            <li><Link to="/account/profile" className="hover:text-brand">Profile</Link></li>
            <li><Link to="/contact" className="hover:text-brand">Contact</Link></li>
            <li><Link to="/warranty-policy" className="hover:text-brand">Warranty policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold">Store info</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Delivery: 1-3 days across Bangladesh</li>
            <li>Support: hello@mituhome.bd</li>
            <li>© {new Date().getFullYear()} Mitu Home and Curtain</li>
          </ul>
        </div>
      </div>

      <div className="border-t">
        <div className="container-page flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-4 text-xs text-muted-foreground">
          <span>Fast delivery</span>
          <span className="opacity-40">·</span>
          <span>Secure checkout</span>
          <span className="opacity-40">·</span>
          <span>Fresh deals</span>
        </div>
      </div>
    </footer>
  );
}
