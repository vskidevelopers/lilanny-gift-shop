/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, Filter, Grid, List, SlidersHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProductCard } from "./ProductCard"

interface Product {
    id: string
    name: string
    slug: string
    price: number
    sale_price?: number | null
    images: string[]
    category?: { name: string } | null
    tags?: string[]
    is_active?: boolean
}

export function ShopGrid({ initialProducts, categories }: { initialProducts: Product[]; categories: any[] }) {
    const searchParams = useSearchParams()
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all")
    const [sortBy, setSortBy] = useState("newest")

    // Filter + sort products client-side (for MVP; move to Supabase query later)
    const filteredProducts = useMemo(() => {
        let result = [...initialProducts]

        // Search filter
        if (searchQuery) {
            const q = searchQuery.toLowerCase()
            result = result.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.category?.name?.toLowerCase().includes(q) ||
                p.tags?.some(t => t.toLowerCase().includes(q))
            )
        }

        // Category filter
        if (selectedCategory !== "all") {
            result = result.filter(p => p.category?.name?.toLowerCase() === selectedCategory.toLowerCase())
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === "price-low") return a.price - b.price
            if (sortBy === "price-high") return b.price - a.price
            if (sortBy === "name") return a.name.localeCompare(b.name)
            return 0 // newest (default order from DB)
        })

        return result
    }, [initialProducts, searchQuery, selectedCategory, sortBy])

    return (
        <div className="space-y-6">
            {/* 🔍 Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between p-4 bg-card rounded-lg border">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-initial">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search toys, gifts..."
                            className="pl-9 w-full sm:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" className="sm:hidden">
                        <Filter className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-36">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            {categories.map((cat: any) => (
                                <SelectItem key={cat.id} value={cat.name.toLowerCase()}>{cat.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-32">
                            <SelectValue placeholder="Sort" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                            <SelectItem value="name">Name A-Z</SelectItem>
                        </SelectContent>
                    </Select>

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
            {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                    <SlidersHorizontal className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
                    <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("all") }}>
                        Clear Filters
                    </Button>
                </div>
            ) : (
                <div className={cn(
                    "grid gap-4 md:gap-6",
                    viewMode === "grid"
                        ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                        : "grid-cols-1"
                )}>
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} viewMode={viewMode} />
                    ))}
                </div>
            )}

            {/* 📄 Pagination Placeholder */}
            {filteredProducts.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                    <Button variant="outline" size="sm" disabled>Previous</Button>
                    {[1, 2, 3].map((page) => (
                        <Button key={page} variant={page === 1 ? "default" : "outline"} size="sm" className="w-8 h-8 p-0">
                            {page}
                        </Button>
                    ))}
                    <Button variant="outline" size="sm">Next</Button>
                </div>
            )}
        </div>
    )
}