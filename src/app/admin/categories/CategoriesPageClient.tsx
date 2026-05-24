/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react"
import { PageHeader } from "@/components/admin/PageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash2, } from "lucide-react"
import { upsertCategory, deleteCategory } from "@/lib/supabase/admin-actions"
import { toast } from "sonner"
import { CategoryImageUpload } from "@/components/admin/CategoryImageUpload"


export default function CategoriesPageClient({ initialData }: { initialData: any[] }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        const res = await upsertCategory(new FormData(e.currentTarget))
        setLoading(false)
        if (res.error) {
            toast.error(res.error)
            console.log("Upsert category response >>>", res)
        }
        else { toast.success("Category saved"); setOpen(false); (e.target as HTMLFormElement).reset() }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this category? Products will lose category reference.")) return
        const res = await deleteCategory(id)
        if (res.error) toast.error(res.error)
        else toast.success("Category deleted")
    }

    return (
        <div className="space-y-6">
            <PageHeader title="Categories" description="Manage product categories & tags" actionLabel="Add Category" onClick={() => setOpen(true)} />

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialData?.map((cat: any) => (
                                <TableRow key={cat.id}>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell><Badge variant={cat.is_active ? "default" : "secondary"}>{cat.is_active ? "Active" : "Hidden"}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {initialData?.length === 0 && (
                                <TableRow><TableCell colSpan={3} className="text-center py-6 text-muted-foreground">No categories yet</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add Category</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Name *</Label>
                            <Input name="name" required placeholder="e.g., Wooden Toys" />
                        </div>

                        <div>
                            <Label>Description (Optional)</Label>
                            <Input name="description" placeholder="Brief description" />
                        </div>

                        {/* Image Upload Section */}
                        <div className="space-y-2">
                            <Label>Category Image (Optional)</Label>
                            <CategoryImageUpload
                                onUploadComplete={(url) => {
                                    // Store in a ref or hidden input
                                    const hiddenInput = document.getElementById('category-image-url') as HTMLInputElement
                                    if (hiddenInput) hiddenInput.value = url
                                }}
                            />
                            <input type="hidden" id="category-image-url" name="image_url" />
                        </div>

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Saving..." : "Save Category"}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}