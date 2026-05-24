"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, Package, FileText, ShoppingCart, Settings, LogOut, Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { label: "Products", icon: Package, href: "/admin/products" },
  { label: "Quotes", icon: FileText, href: "/admin/quotes" },
  { label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
  { label: "Settings", icon: Settings, href: "/admin/settings" },
];

// Extracted outside render to satisfy React rules
function NavContent() {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut({ scope: 'global' });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <nav className="flex flex-col gap-1 px-3 py-4 h-full">
      <div className="mb-6 px-3 pt-2">
        <h2 className="text-lg font-bold tracking-tight text-foreground">Li & Lanny Trends</h2>
        <p className="text-xs text-muted-foreground">Admin Panel</p>
      </div>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
            pathname === route.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
          )}
        >
          <route.icon className="h-4 w-4" />
          {route.label}
        </Link>
      ))}
      <div className="mt-auto pt-4">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors cursor-pointer"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </nav>
  );
}

export function AdminSidebar({ isMobile = false }: { isMobile?: boolean }) {
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <NavContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-background min-h-screen fixed left-0 top-0 z-10">
      <NavContent />
    </aside>
  );
}