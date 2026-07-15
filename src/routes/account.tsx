import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { User, Package, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account")({
  component: AccountLayout,
});

const tabs = [
  { to: "/account/profile", label: "Profile", icon: User },
  { to: "/account/orders", label: "Orders", icon: Package },
  { to: "/account/wishlist", label: "Wishlist", icon: Heart },
] as const;

function AccountLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="container-page py-10">
      <h1 className="text-3xl font-bold tracking-tight">My account</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="flex flex-row gap-2 lg:flex-col">
          {tabs.map((t) => {
            const active = pathname === t.to;
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                  active ? "bg-primary-soft text-brand" : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon size={16} /> {t.label}
              </Link>
            );
          })}
        </aside>
        <div><Outlet /></div>
      </div>
    </div>
  );
}
