/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { upsertCategory, upsertProduct } from "@/lib/supabase/admin-actions"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImageUploader } from "./ImageUploader"
import { RichTextEditor } from "./RichTextEditor"

export function ProductForm({ categories, initialData }: { categories: any[], initialData?: any }) {
    const [loading, setLoading] = useState(false)
    const [categoryId, setCategoryId] = useState(initialData?.category_id || "none")
    const [description, setDescription] = useState(initialData?.description || "")
    const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>(initialData?.images || [])
    const [formKey, setFormKey] = useState(0)

    const [openNewCategory, setOpenNewCategory] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState("")
    const [creatingCategory, setCreatingCategory] = useState(false)
    const [localCategories, setLocalCategories] = useState(categories)

    const isEdit = !!initialData

    const handleSubmit = async (formData: FormData) => {
        if (isEdit) formData.set("id", initialData.id)

        if (categoryId === "add-new" || !categoryId) {
            formData.set("category_id", "none")
        } else {
            formData.set("category_id", categoryId)
        }

        formData.set("images", uploadedImageUrls.join(","))
        formData.set("description", description)

        setLoading(true)
        const res = await upsertProduct(formData)
        setLoading(false)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success(isEdit ? "Product updated" : "Product created")
            if (!isEdit) {
                setUploadedImageUrls([])
                setDescription("")
                setCategoryId("none")
                setFormKey(prev => prev + 1)
            }
        }
    }

    const handleCategoryChange = (val: string) => {
        if (val === "add-new") {
            setOpenNewCategory(true)
            return
        }
        setCategoryId(val)
    }

    const handleCreateCategory = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!newCategoryName.trim()) return

        setCreatingCategory(true)
        const formData = new FormData()
        formData.append("name", newCategoryName.trim())
        const res = await upsertCategory(formData)
        setCreatingCategory(false)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success(`Category "${newCategoryName}" created`)
            const newCat = res.category
            setLocalCategories(prev => [...prev, newCat])
            setCategoryId(newCat.id)
            setNewCategoryName("")
            setOpenNewCategory(false)
        }
    }

    return (
        <Card className="max-w-4xl mx-auto">
            <form action={handleSubmit} className="space-y-8">
                {isEdit && <input type="hidden" name="id" value={initialData.id} />}
                {isEdit && <input type="hidden" name="slug" value={initialData.slug} />}

                <section className="space-y-4">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">1</span>
                            Product Images
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ImageUploader
                            key={formKey}
                            onUploadComplete={setUploadedImageUrls}
                            initialUrls={initialData?.images || []}
                            maxFiles={5}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            First image will be used as the main product thumbnail.
                        </p>
                    </CardContent>
                </section>

                <Separator />

                <section className="space-y-4">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">2</span>
                            Product Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Product Name *</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={initialData?.name}
                                    required
                                    placeholder="e.g., Wooden Puzzle Train"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={categoryId} onValueChange={handleCategoryChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select or create category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Uncategorized</SelectItem>
                                        {localCategories.map((c: any) => (
                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                        ))}
                                        <SelectSeparator />
                                        <SelectItem value="add-new" className="text-primary font-medium">
                                            + Create new category
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Product Description</Label>
                            <RichTextEditor
                                value={description}
                                onChange={setDescription}
                                placeholder="Describe the product, materials, age range, features, etc."
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Tags (for homepage sections)</Label>
                            <Input
                                name="tags"
                                defaultValue={initialData?.tags?.join(", ") || ""}
                                placeholder="e.g., trending, new-arrival, wooden, educational"
                            />
                            <p className="text-xs text-muted-foreground">
                                Comma-separated. Tags like &quot;trending&quot; will show this product in homepage sections.
                            </p>
                        </div>
                    </CardContent>
                </section>

                <Separator />

                <section className="space-y-4">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">3</span>
                            Pricing
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price (KES) *</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    step="0.01"
                                    defaultValue={initialData?.price}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sale_price">Sale Price (Optional)</Label>
                                <Input
                                    id="sale_price"
                                    name="sale_price"
                                    type="number"
                                    step="0.01"
                                    defaultValue={initialData?.sale_price || ""}
                                    placeholder="Set to show discount"
                                />
                            </div>
                        </div>
                    </CardContent>
                </section>

                <Separator />

                <section className="px-6 pb-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Product Visibility</Label>
                            <p className="text-sm text-muted-foreground">Toggle to show/hide from storefront</p>
                        </div>
                        <Switch name="is_active" defaultChecked={initialData?.is_active ?? true} />
                    </div>
                </section>

                <div className="border-t px-6 py-4 flex justify-end gap-3 bg-muted/30">
                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
                    </Button>
                </div>

                <Dialog open={openNewCategory} onOpenChange={setOpenNewCategory}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create New Category</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateCategory} className="space-y-4">
                            <div>
                                <Label>Category Name</Label>
                                <Input
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="e.g., Wooden Toys"
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setOpenNewCategory(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={creatingCategory}>
                                    {creatingCategory ? "Creating..." : "Create & Select"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </form>
        </Card>
    )
}