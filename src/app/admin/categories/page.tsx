import { getCategories } from "@/lib/supabase/admin-actions"
import CategoriesPageClient from "./CategoriesPageClient"


export default async function CategoriesPage() {
    const data = await getCategories().catch(() => [])
    return <CategoriesPageClient initialData={data} />
}