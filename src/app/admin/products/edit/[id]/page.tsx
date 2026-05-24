/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProducts, getCategories } from "@/lib/supabase/admin-actions"
import { PageHeader } from "@/components/admin/PageHeader"
import { ProductForm } from "@/components/admin/ProductForm"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params // ✅ Next.js 15 requires awaiting params
    const products = await getProducts()
    const categories = await getCategories().catch(() => [])
    const product = products?.find((p: any) => p.id === id)

    if (!product) notFound()

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <PageHeader title="Edit Product" />
            <ProductForm categories={categories} initialData={product} />
        </div>
    )
}