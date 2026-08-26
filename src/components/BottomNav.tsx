import { Link, useRouterState } from "@tanstack/react-router";
import { Home, MessageCircle, LayoutGrid, Zap, User } from "lucide-react";
import { cn } from "@/lib/utils";

const WHATSAPP_NUMBER = "8801XXXXXXXXX";

const items = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: `https://wa.me/${WHATSAPP_NUMBER}`, label: "WhatsApp", icon: MessageCircle, external: true },
  { to: "/shop", label: "Categories", icon: LayoutGrid },
  { to: "/shop", label: "Flash Sale", icon: Zap, search: { deal: "flash" } },
  { to: "/account/profile", label: "Account", icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = "exact" in item && item.exact ? pathname === "/" : pathname.startsWith(item.to) && item.to !== "/";

          if ("external" in item && item.external) {
            return (
              <a
                key={item.label}
                href={item.to}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center gap-1 py-2 text-muted-foreground"
              >
                <Icon size={20} />
                <span className="text-[11px] font-medium">{item.label}</span>
              </a>
            );
          }

          return (
            <Link
              key={item.label}
              to={item.to}
              search={"search" in item ? item.search : undefined}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 text-muted-foreground transition-colors",
                isActive && "text-brand"
              )}
            >
              <Icon size={20} />
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
