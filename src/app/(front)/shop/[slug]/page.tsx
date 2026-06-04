import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/layout/PageHeader"
import { ProductGallery } from "@/components/shop/ProductGallery"
import { ProductDetails } from "@/components/shop/ProductDetails"

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: product, error } = await supabase
        .from("products")
        .select(`
      *,
      category:categories(name)
    `)
        .eq("slug", slug)
        .eq("is_active", true)
        .single()

    if (error || !product) {
        notFound()
    }

    return (
        <div className="min-h-screen pb-20 md:pb-0">
            {/* Parallax Hero Header */}
            <PageHeader
                title={product.name}
                description={product.category?.name || "Li & Lanny Trends"}
                backgroundImage={product.images?.[0]}
                gradient="none"
                breadcrumbs={[
                    { label: "Shop", href: "/shop" },
                    { label: product.category?.name || "Products", href: `/shop?category=${product.category?.name}` },
                    { label: product.name }
                ]}
                className="py-8 md:py-12"
            />

            <div className="container px-4 -mt-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-background rounded-2xl shadow-xl p-4 md:p-8 border">
                    {/* Left: Gallery */}
                    <ProductGallery
                        images={product.images || []}
                        productName={product.name}
                    />

                    {/* Right: Details */}
                    <ProductDetails product={product} />
                </div>
            </div>

            {/* TODO: Related Products Section will go here */}
        </div>
    )
}