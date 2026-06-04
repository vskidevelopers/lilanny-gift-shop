"use client"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/store"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export function CartDrawer() {
    const router = useRouter()
    const { items, isOpen, toggleCart, updateQuantity, removeItem } = useCartStore()
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

    const subtotal = items.reduce((total, item) => {
        const price = item.sale_price && item.sale_price < item.price ? item.sale_price : item.price
        return total + price * item.quantity
    }, 0)

    // ✅ Helper function to close drawer and navigate cleanly
    const handleNavigate = (path: string) => {
        toggleCart() // Close the drawer first
        router.push(path) // Then navigate
    }

    return (
        <Sheet open={isOpen} onOpenChange={toggleCart}>
            <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle className="flex items-center gap-2 text-xl">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                        Your Cart ({itemCount})
                    </SheetTitle>
                </SheetHeader>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <div className="p-4 rounded-full bg-muted">
                                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="font-medium text-lg">Your cart is empty</p>
                                <p className="text-sm text-muted-foreground mt-1">Looks like you haven&apos;t added any gifts yet.</p>
                            </div>
                            {/* ✅ Close drawer on click */}
                            <Button onClick={() => handleNavigate("/shop")} variant="outline">
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <AnimatePresence>
                            {items.map((item) => {
                                const displayPrice = item.sale_price && item.sale_price < item.price ? item.sale_price : item.price
                                return (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex gap-4"
                                    >
                                        <div className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                                            {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(", ")}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="font-semibold text-primary">KES {displayPrice.toLocaleString()}</span>
                                                <div className="flex items-center gap-2 border rounded-md">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:bg-muted rounded-l-md transition-colors"
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="text-sm w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:bg-muted rounded-r-md transition-colors"
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="self-start p-1 text-muted-foreground hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    )}
                </div>

                {/* Footer / Checkout */}
                {items.length > 0 && (
                    <SheetFooter className="p-4 border-t bg-background flex-col gap-4">
                        <div className="flex items-center justify-between w-full">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="text-xl font-bold">KES {subtotal.toLocaleString()}</span>
                        </div>
                        <p className="text-xs text-muted-foreground text-center">
                            Shipping & taxes calculated at checkout. Free Nairobi pickup available.
                        </p>
                        <div className="grid grid-cols-2 gap-3 w-full">
                            {/* ✅ Close drawer on click */}
                            <Button variant="outline" onClick={() => handleNavigate("/shop")} className="w-full">
                                Keep Shopping
                            </Button>
                            {/* ✅ Close drawer AND navigate to checkout */}
                            <Button onClick={() => handleNavigate("/checkout")} className="w-full gap-2">
                                Checkout <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )
}