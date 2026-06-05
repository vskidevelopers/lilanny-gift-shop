"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useCartStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, Tag } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function CartPage() {
    const { items, updateQuantity, removeItem } = useCartStore()
    const [promoCode, setPromoCode] = useState("")
    const [applyingPromo, setApplyingPromo] = useState(false)

    const subtotal = items.reduce((total, item) => {
        const price = item.sale_price && item.sale_price < item.price ? item.sale_price : item.price
        return total + price * item.quantity
    }, 0)

    // Empty State
    if (items.length === 0) {
        return (
            <div className="container px-4 py-16 max-w-4xl mx-auto text-center">
                <div className="mb-6 flex justify-center">
                    <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                        <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold tracking-tight mb-3">Your cart is empty</h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                    Looks like you haven&apos;t added any beautiful gifts yet. Let&apos;s find something special!
                </p>
                <Button size="lg" asChild className="gap-2">
                    <Link href="/shop">
                        <ArrowLeft className="h-4 w-4" /> Continue Shopping
                    </Link>
                </Button>
            </div>
        )
    }

    const handleApplyPromo = () => {
        if (!promoCode.trim()) return
        setApplyingPromo(true)
        // TODO: Wire actual promo code logic later
        setTimeout(() => {
            setApplyingPromo(false)
            // Mock response for now
            alert("Promo code feature coming soon!")
        }, 1000)
    }

    return (
        <div className="container px-4 py-8 max-w-6xl mx-auto">
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Continue Shopping
            </Link>

            <h1 className="text-3xl font-bold tracking-tight mb-8">Your Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    <AnimatePresence>
                        {items.map((item) => {
                            const displayPrice = item.sale_price && item.sale_price < item.price ? item.sale_price : item.price

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="overflow-hidden">
                                        <CardContent className="p-4 sm:p-6">
                                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

                                                {/* Product Image */}
                                                <div className="relative w-full sm:w-28 h-40 sm:h-28 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="(max-width: 640px) 100vw, 112px"
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex justify-between items-start">
                                                            <Link href={`/product/${item.id}`} className="hover:text-primary transition-colors">
                                                                <h3 className="font-semibold text-lg line-clamp-2">{item.name}</h3>
                                                            </Link>
                                                            <button
                                                                onClick={() => removeItem(item.id)}
                                                                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                                                                aria-label="Remove item"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>

                                                        {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(" • ")}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center gap-3 border rounded-md w-fit">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="p-2 hover:bg-muted rounded-l-md transition-colors"
                                                                aria-label="Decrease quantity"
                                                            >
                                                                <Minus className="h-3 w-3" />
                                                            </button>
                                                            <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="p-2 hover:bg-muted rounded-r-md transition-colors"
                                                                aria-label="Increase quantity"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </button>
                                                        </div>

                                                        {/* Price */}
                                                        <div className="text-right">
                                                            <p className="font-bold text-lg text-primary">
                                                                KES {(displayPrice * item.quantity).toLocaleString()}
                                                            </p>
                                                            {item.quantity > 1 && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    KES {displayPrice.toLocaleString()} each
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>

                {/* RIGHT COLUMN: Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Promo Code */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-muted-foreground" /> Promo Code
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter code"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        className="uppercase"
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={handleApplyPromo}
                                        disabled={applyingPromo || !promoCode.trim()}
                                    >
                                        {applyingPromo ? "..." : "Apply"}
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            {/* Totals */}
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>KES {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className="text-muted-foreground italic">Calculated at checkout</span>
                                </div>
                            </div>

                            <Separator />

                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-2xl font-bold text-primary">KES {subtotal.toLocaleString()}</span>
                            </div>

                            {/* Checkout Button */}
                            <Button size="lg" className="w-full h-12 text-base gap-2" asChild>
                                <Link href="/checkout">
                                    Proceed to Checkout <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                                Secure checkout. We will confirm delivery details with you shortly.
                            </p>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    )
}