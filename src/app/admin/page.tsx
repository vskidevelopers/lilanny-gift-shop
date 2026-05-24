/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import Link from "next/link"
import { PageHeader } from "@/components/admin/PageHeader"
import { StatCard } from "@/components/admin/StatCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
    ShoppingCart, Package, FileText, BookOpen, Users, Plus, ArrowUpRight,
    TrendingUp, Clock, Tag, Settings
} from "lucide-react"

export default function AdminDashboard() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <PageHeader
                title="Dashboard"
                description="Overview of your Li & Lanny Trends store performance"
            />

            {/* 📊 Stats Grid */}
            <section aria-label="Store Statistics">
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <StatCard title="Total Orders" value="124" trend="+12% from last month" icon={ShoppingCart} />
                    <StatCard title="Products" value="89" trend="Active listings" icon={Package} />
                    <StatCard title="Quotes" value="14" trend="3 pending review" icon={FileText} />
                    <StatCard title="Catalogues" value="6" trend="Kids, Adults, Seasonal" icon={BookOpen} />
                    <StatCard title="Customers" value="342" trend="+28 this week" icon={Users} />
                    <StatCard title="Revenue" value="KES 184,200" trend="+8.4% growth" icon={TrendingUp} />
                </div>
            </section>

            {/* ⚡ Quick Actions */}
            <section aria-label="Quick Actions">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    <QuickAction href="/admin/products" label="Add Product" icon={Plus} />
                    <QuickAction href="/admin/quotes" label="Create Quote" icon={FileText} />
                    <QuickAction href="/admin/orders" label="View Orders" icon={ShoppingCart} />
                    <QuickAction href="/admin/categories" label="Categories" icon={Tag} />
                    <QuickAction href="/admin/settings" label="Settings" icon={Settings} />
                    <QuickAction href="#" label="Analytics" icon={ArrowUpRight} disabled />
                </div>
            </section>

            {/* 📋 Recent Activity Placeholder */}
            <Card className="border-dashed">
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <Clock className="h-8 w-8 mb-3 opacity-40" />
                        <p className="text-sm">No recent orders to display.</p>
                        <p className="text-xs mt-1">New orders will appear here in real-time.</p>
                    </div>
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