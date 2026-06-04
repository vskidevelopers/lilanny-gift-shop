/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingCart, Truck, ShieldCheck, Gift } from "lucide-react"
import { useCartStore } from "@/lib/store"
import { toast } from "sonner"

interface Product {
    id: string
    name: string
    price: number
    sale_price?: number | null
    description?: string | null
    category?: { name: string } | null
    tags?: string[]
    images?: string[]
    variants?: any // JSONB from Supabase
}

export function ProductDetails({ product }: { product: Product }) {
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
    const isOnSale = product.sale_price && product.sale_price < product.price
    const { addItem } = useCartStore()

    const handleAddToCart = () => {
        // Optional: Validate variants here if required
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            sale_price: product.sale_price,
            image: product.images?.[0] || "/placeholder.jpg",
            selectedVariants: Object.keys(selectedVariants).length > 0 ? selectedVariants : undefined,
        })
        toast.success(`Added "${product.name}" to cart`)
    }

    const handleVariantChange = (variantType: string, value: string) => {
        setSelectedVariants(prev => ({ ...prev, [variantType]: value }))
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
        >
            {/* Breadcrumb & Category */}
            <div className="space-y-2">
                {product.category?.name && (
                    <Badge variant="secondary" className="text-xs uppercase tracking-wider">
                        {product.category.name}
                    </Badge>
                )}
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {product.name}
                </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
                {isOnSale ? (
                    <>
                        <span className="text-3xl font-bold text-primary">
                            KES {product.sale_price?.toLocaleString()}
                        </span>
                        <span className="text-xl text-muted-foreground line-through">
                            KES {product.price.toLocaleString()}
                        </span>
                        <Badge className="bg-red-500 hover:bg-red-600">
                            Save {Math.round((1 - product.sale_price! / product.price) * 100)}%
                        </Badge>
                    </>
                ) : (
                    <span className="text-3xl font-bold text-primary">
                        KES {product.price.toLocaleString()}
                    </span>
                )}
            </div>

            {/* Dynamic Variants (if they exist) */}
            {product.variants && Array.isArray(product.variants) && product.variants.length > 0 && (
                <div className="space-y-4 border-t border-b py-4">
                    {product.variants.map((variant: any, idx: number) => (
                        <div key={idx} className="space-y-2">
                            <label className="text-sm font-medium capitalize">
                                Select {variant.type}
                                {selectedVariants[variant.type] && <span className="text-primary ml-1">: {selectedVariants[variant.type]}</span>}
                            </label>
                            <Select
                                onValueChange={(val) => handleVariantChange(variant.type, val)}
                            >
                                <SelectTrigger className="w-full md:w-64">
                                    <SelectValue placeholder={`Choose ${variant.type}`} />
                                </SelectTrigger>
                                <SelectContent>
                                    {variant.options.map((opt: string) => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    ))}
                </div>
            )}

            {/* Description */}
            {product.description && (
                <div className="prose prose-sm max-w-none text-muted-foreground">
                    <p>{product.description}</p>
                </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 py-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Truck className="h-4 w-4 text-primary" />
                    <span>Nairobi Pickup or Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary" />
                    <span>Secure M-Pesa Payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Gift className="h-4 w-4 text-primary" />
                    <span>Beautiful Gift Packaging</span>
                </div>
            </div>

            {/* Desktop Add to Cart */}
            <div className="hidden md:flex gap-4 pt-4">
                <Button size="lg" onClick={handleAddToCart} className="flex-1 gap-2 text-lg h-14 shadow-lg shadow-primary/20">
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                </Button>
            </div>

            {/* Mobile Sticky Add to Cart */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur border-t md:hidden z-50">
                <Button onClick={handleAddToCart} size="lg" className="w-full gap-2 text-lg h-14 shadow-lg shadow-primary/20">
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart - KES {isOnSale ? product.sale_price?.toLocaleString() : product.price.toLocaleString()}
                </Button>
            </div>
        </motion.div>
    )
}