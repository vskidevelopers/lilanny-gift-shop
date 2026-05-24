/* eslint-disable @typescript-eslint/no-explicit-any */
import { getProducts } from "@/lib/supabase/admin-actions"
import { PageHeader } from "@/components/admin/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2 } from "lucide-react"
import Link from "next/link"
import { deleteProduct } from "@/lib/supabase/admin-actions"

export default async function ProductsPage() {
    const products = await getProducts().catch(() => [])

    return (
        <div className="space-y-6">
            <PageHeader
                title="Products"
                description="Manage your toy & gift catalog"
                actionLabel="Add Product"
                actionHref="/admin/products/new" // ✅ Uses href, no function passed
            />

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {products?.map((p: any) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">{p.name}</TableCell>
                                    <TableCell>{p.categories?.name || "Uncategorized"}</TableCell>
                                    <TableCell>KES {p.price}{p.sale_price && <span className="ml-1 text-red-500 line-through text-sm">KES {p.sale_price}</span>}</TableCell>
                                    <TableCell className="text-right flex justify-end gap-2">
                                        <Link href={`/admin/products/edit/${p.id}`}>
                                            <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                                        </Link>
                                        <form action={async () => { "use server"; await deleteProduct(p.id) }}>
                                            <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                        </form>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {products?.length === 0 && (
                                <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">No products yet</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}