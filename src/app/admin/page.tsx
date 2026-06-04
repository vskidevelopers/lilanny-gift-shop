/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link"
import { PageHeader } from "@/components/admin/PageHeader"
import { StatCard } from "@/components/admin/StatCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { adminDb } from "@/lib/supabase/admin-client"
import {
    ShoppingCart, Package, Tag, Users, Plus, ArrowUpRight,
    TrendingUp, Clock
} from "lucide-react"

// Server Component - fetches data directly
export default async function AdminDashboard() {
    // Fetch all data in parallel
    const [
        { count: totalOrders },
        { count: activeProducts },
        { count: totalCategories },
        { data: orders },
        { data: revenueData }
    ] = await Promise.all([
        // Total orders
        adminDb.from("orders").select("*", { count: "exact", head: true }),

        // Active products
        adminDb.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),

        // Categories
        adminDb.from("categories").select("*", { count: "exact", head: true }),

        // Recent orders (last 5)
        adminDb
            .from("orders")
            .select("id, customer_name, total_amount, customer_phone, payment_status, fulfillment_status, created_at")
            .order("created_at", { ascending: false })
            .limit(5),

        // Revenue (sum of paid orders)
        adminDb
            .from("orders")
            .select("total_amount")
            .eq("payment_status", "paid")
    ])

    // Calculate revenue
    const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total_amount), 0) || 0

    // Count unique customers
    const uniqueCustomers = new Set(orders?.map(o => o.customer_phone)).size || 0

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="Dashboard"
                description="Overview of your Li & Lanny Trends store performance"
            />

            {/* 📊 Stats Grid */}
            <section aria-label="Store Statistics">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    <StatCard
                        title="Total Orders"
                        value={totalOrders?.toString() || "0"}
                        trend="All time"
                        icon={ShoppingCart}
                    />
                    <StatCard
                        title="Active Products"
                        value={activeProducts?.toString() || "0"}
                        trend="Live on storefront"
                        icon={Package}
                    />
                    <StatCard
                        title="Categories"
                        value={totalCategories?.toString() || "0"}
                        trend="Product categories"
                        icon={Tag}
                    />
                    <StatCard
                        title="Customers"
                        value={uniqueCustomers.toString()}
                        trend="Unique buyers"
                        icon={Users}
                    />
                    <StatCard
                        title="Revenue"
                        value={`KES ${totalRevenue.toLocaleString()}`}
                        trend="From paid orders"
                        icon={TrendingUp}
                    />
                </div>
            </section>

            {/* ⚡ Quick Actions */}
            <section aria-label="Quick Actions">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    <QuickAction href="/admin/products/new" label="Add Product" icon={Plus} />
                    <QuickAction href="/admin/orders" label="View Orders" icon={ShoppingCart} />
                    <QuickAction href="/admin/categories" label="Categories" icon={Tag} />
                    <QuickAction href="/admin/products" label="Products" icon={Package} />
                    <QuickAction href="#" label="Analytics" icon={ArrowUpRight} disabled />
                </div>
            </section>

            {/* 📋 Recent Orders */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-primary" />
                        Recent Orders
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {!orders || orders.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                            <Clock className="h-8 w-8 mb-3 opacity-40" />
                            <p className="text-sm">No orders yet.</p>
                            <p className="text-xs mt-1">New orders will appear here in real-time.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {orders.map((order: any) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-mono text-sm font-semibold">{order.id}</span>
                                            <Badge
                                                variant={
                                                    order.payment_status === "paid" ? "default" :
                                                        order.payment_status === "failed" ? "destructive" :
                                                            "secondary"
                                                }
                                                className="text-xs"
                                            >
                                                {order.payment_status}
                                            </Badge>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {order.fulfillment_status}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">
                                            {order.customer_name} • {new Date(order.created_at).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                                        </p>
                                    </div>
                                    <div className="text-right ml-4">
                                        <p className="font-bold text-lg">KES {Number(order.total_amount).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                            <div className="pt-3 border-t">
                                <Link
                                    href="/admin/orders"
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                >
                                    View all orders <ArrowUpRight className="h-3 w-3" />
                                </Link>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// 🔹 Quick Action Component
function QuickAction({ href, label, icon: Icon, disabled = false }: { href: string; label: string; icon: any; disabled?: boolean }) {
    return (
        <Link
            href={href}
            className={`block p-4 rounded-lg border bg-card hover:bg-accent/50 hover:border-primary/30 transition-all ${disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
        >
            <div className="flex flex-col items-center gap-2 text-center">
                <div className="p-2 rounded-full bg-accent/50">
                    <Icon className="h-5 w-5 text-foreground" />
                </div>
                <span className="text-sm font-medium">{label}</span>
            </div>
        </Link>
    )
}