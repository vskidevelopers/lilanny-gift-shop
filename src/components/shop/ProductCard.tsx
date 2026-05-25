"use client"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Eye } from "lucide-react"

interface Product {
    id: string
    name: string
    slug: string
    price: number
    sale_price?: number | null
    images: string[]
    category?: { name: string } | null
    tags?: string[]
}

export function ProductCard({ product, viewMode = "grid" }: { product: Product; viewMode?: "grid" | "list" }) {
    const mainImage = product.images?.[0] || "https://via.placeholder.com/400x400?text=No+Image"
    const isOnSale = product.sale_price && product.sale_price < product.price
    const discount = isOnSale ? Math.round((1 - product.sale_price! / product.price) * 100) : 0

    if (viewMode === "list") {
        return (
            <Card className="group overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row">
                    <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                        <Image
                            src={mainImage}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, 192px"
                        />
                        {isOnSale && (
                            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">-{discount}%</Badge>
                        )}
                    </div>
                    <CardContent className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                            <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors">
                                <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                            </Link>
                            {product.category?.name && (
                                <p className="text-sm text-muted-foreground mt-1">{product.category.name}</p>
                            )}
                            {product.tags?.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="mr-1 mt-2 text-xs">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2">
                                {isOnSale ? (
                                    <>
                                        <span className="font-bold text-primary text-lg">KES {product.sale_price?.toLocaleString()}</span>
                                        <span className="text-sm text-muted-foreground line-through">KES {product.price.toLocaleString()}</span>
                                    </>
                                ) : (
                                    <span className="font-bold text-primary text-lg">KES {product.price.toLocaleString()}</span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="hidden sm:flex gap-1">
                                    <Eye className="h-4 w-4" /> View
                                </Button>
                                <Button size="sm" className="gap-1">
                                    <ShoppingCart className="h-4 w-4" /> Add
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </div>
            </Card>
        )
    }

    // GRID VIEW (default)
    return (
        <Card className="group overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative aspect-square overflow-hidden">
                <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={false}
                />
                {isOnSale && (
                    <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">-{discount}%</Badge>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                <Button
                    size="sm"
                    className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 shadow-lg"
                    asChild
                >
                    <Link href={`/product/${product.slug}`}>
                        <Eye className="h-4 w-4 mr-1" /> Quick View
                    </Link>
                </Button>
            </div>
            <CardContent className="p-4">
                <Link href={`/product/${product.slug}`} className="hover:text-primary transition-colors block">
                    <h3 className="font-medium line-clamp-2 min-h-[48px]">{product.name}</h3>
                </Link>
                {product.category?.name && (
                    <p className="text-xs text-muted-foreground mt-1">{product.category.name}</p>
                )}
                <div className="flex items-center justify-between mt-3">
                    <div className="flex flex-col">
                        {isOnSale ? (
                            <>
                                <span className="font-bold text-primary">KES {product.sale_price?.toLocaleString()}</span>
                                <span className="text-xs text-muted-foreground line-through">KES {product.price.toLocaleString()}</span>
                            </>
                        ) : (
                            <span className="font-bold text-primary">KES {product.price.toLocaleString()}</span>
                        )}
                    </div>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0 sm:hidden">
                        <ShoppingCart className="h-4 w-4" />
                    </Button>
                    <Button size="sm" className="hidden sm:flex gap-1">
                        <ShoppingCart className="h-4 w-4" /> Add
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}