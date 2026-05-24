"use client";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Admin login gets a clean, centered full-screen layout
  if (isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
        {children}
        <Toaster position="top-right" richColors />
      </div>
    );
  }

  // Admin dashboard & all other admin pages
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar isMobile={false} />
      <div className="md:ml-64">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6 md:hidden">
          <AdminSidebar isMobile={true} />
          <h1 className="text-sm font-medium">Li & Lanny Trends</h1>
        </header>
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </main>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}