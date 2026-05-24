import { getCategories } from "@/lib/supabase/admin-actions"
import { PageHeader } from "@/components/admin/PageHeader"
import { ProductForm } from "@/components/admin/ProductForm"

export default async function NewProductPage() {
    const categories = await getCategories().catch(() => [])
    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <PageHeader title="Add Product" />
            <ProductForm categories={categories} />
        </div>
    )
}