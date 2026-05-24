"use client"
import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader" // Optional: reuse or make frontend version
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Filter, Grid, List } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ShopPage() {
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [loading, setLoading] = useState(true) // Simulate initial load

    // Placeholder products for UI preview
    const placeholderProducts = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        name: `Product ${i + 1}`,
        price: (Math.random() * 2000 + 500).toFixed(2),
        image: `https://picsum.photos/seed/${i}/400/400`,
    }))

    return (
        <div className="container px-4 py-8">
            {/* 🎯 Header + Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Shop All</h1>
                    <p className="text-muted-foreground mt-1">Discover unique toys & gifts</p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Search products..." className="pl-9 w-48 md:w-64" />
                    </div>

                    {/* Category Filter */}
                    <Select>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="kids">Kids</SelectItem>
                            <SelectItem value="adults">Adults</SelectItem>
                            <SelectItem value="seasonal">Seasonal</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* View Toggle */}
                    <div className="flex border rounded-md overflow-hidden">
                        <Button
                            variant={viewMode === "grid" ? "default" : "ghost"}
                            size="icon"
                            className="h-9 w-9 rounded-none"
                            onClick={() => setViewMode("grid")}
                        >
                            <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="icon"
                            className="h-9 w-9 rounded-none"
                            onClick={() => setViewMode("list")}
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* 🛍️ Product Grid */}
            <div className={cn(
                "grid gap-4 md:gap-6",
                viewMode === "grid"
                    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                    : "grid-cols-1"
            )}>
                {loading
                    ? // Skeleton loaders
                    Array.from({ length: 8 }).map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <Skeleton className="aspect-square w-full" />
                            <CardContent className="p-4 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-6 w-20" />
                            </CardContent>
                        </Card>
                    ))
                    : // Actual product cards
                    placeholderProducts.map((product) => (
                        <Card key={product.id} className="group overflow-hidden hover:shadow-md transition-shadow">
                            <div className="aspect-square relative overflow-hidden">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    loading="lazy"
                                />
                                <Button
                                    size="sm"
                                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Quick View
                                </Button>
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-medium truncate">{product.name}</h3>
                                <p className="text-sm text-muted-foreground mt-1">Category</p>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="font-bold text-primary">KES {product.price}</span>
                                    <Button size="sm" variant="outline">Add</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                }
            </div>

            {/* 📄 Pagination Placeholder */}
            <div className="flex items-center justify-center gap-2 mt-8">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                {[1, 2, 3].map((page) => (
                    <Button
                        key={page}
                        variant={page === 1 ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                    >
                        {page}
                    </Button>
                ))}
                <Button variant="outline" size="sm">Next</Button>
            </div>
        </div>
    )
}