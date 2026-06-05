import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { ShopGrid } from "@/components/shop/ShopGrid"
import { PageHeader } from "@/components/layout/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Skeleton loader for while ShopGrid loads
function ShopGridSkeleton() {
    return (
        <div className="space-y-6">
            {/* Filters skeleton */}
            <div className="flex flex-col sm:flex-row gap-3 p-4 bg-card rounded-lg border">
                <Skeleton className="h-10 w-full sm:w-64" />
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-36" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-20" />
                </div>
            </div>

            {/* Grid skeleton */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <Skeleton className="aspect-square w-full" />
                        <CardContent className="p-4 space-y-2">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-6 w-20" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default async function ShopPage() {
    const supabase = await createClient()

    // Fetch active products + alias category relation
    const { data: products, error: productsError } = await supabase
        .from("products")
        .select(`
      *,
      category:categories(name)
    `)
        .eq("is_active", true)
        .order("created_at", { ascending: false })

    // Fetch categories for filter dropdown
    const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("name")

    console.log("Products:", products) // Debugging log

    // Handle errors gracefully
    if (productsError || categoriesError) {
        console.error("Shop fetch error:", productsError || categoriesError)
        return (
            <div className="container px-4 py-16 text-center">
                <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
                <p className="text-muted-foreground">Please try again later</p>
            </div>
        )
    }

    return (
        <div className="container px-4 py-8">
            <PageHeader
                title="Shop All"
                description="Discover unique toys & gifts for kids and adults. Handpicked with love."
                gradient="soft"
                breadcrumbs={[{ label: "Shop" }]}
            />

            {/* ✅ Wrap ShopGrid in Suspense boundary */}
            <Suspense fallback={<ShopGridSkeleton />}>
                <ShopGrid
                    initialProducts={products || []}
                    categories={categories || []}
                />
            </Suspense>
        </div>
    )
}