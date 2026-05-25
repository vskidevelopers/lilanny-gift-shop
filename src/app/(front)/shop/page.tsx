import { ShopGrid } from "@/components/shop/ShopGrid"
import { PageHeader } from "@/components/layout/PageHeader"
import { supabase } from "@/lib/supabase/client"

export default async function ShopPage() {


    // Fetch active products + category relation
    const { data: products, error: productsError } = await supabase
        .from("products")
        .select("*, categories(name)")
        .eq("is_active", true)
        .order("created_at", { ascending: false })

    console.log("Products:", products) // Debugging log

    // Fetch categories for filter dropdown
    const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("id, name")
        .eq("is_active", true)
        .order("name")

    // Handle errors gracefully
    if (productsError || categoriesError) {
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
                breadcrumbs={[{ label: "Shop", href: "/shop" }]}
            />
            <ShopGrid
                initialProducts={products || []}
                categories={categories || []}
            />
        </div>
    )
}