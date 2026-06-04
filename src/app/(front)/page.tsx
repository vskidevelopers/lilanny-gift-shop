import { HomePageClient } from "@/components/layout/HomePageClient"
import { createClient } from "@/lib/supabase/server"


export default async function HomePage() {
  const supabase = await createClient()

  // Fetch all active products with their categories
  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      category:categories(name)
    `)
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to fetch products for homepage:", error)
  }

  return <HomePageClient products={products || []} />
}