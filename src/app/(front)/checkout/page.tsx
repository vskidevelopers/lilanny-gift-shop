/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCartStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Truck, Store, MapPin, Smartphone, CreditCard, ArrowLeft, Loader2, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const generateOrderId = () => `ORD-${Date.now().toString(36).toUpperCase()}`

export default function CheckoutPage() {
    const router = useRouter()
    const { items, clearCart } = useCartStore()

    const subtotal = items.reduce((total, item) => {
        const price = item.sale_price && item.sale_price < item.price ? item.sale_price : item.price
        return total + price * item.quantity
    }, 0)


    const [isSubmitting, setIsSubmitting] = useState(false)
    const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup")
    const [payment, setPayment] = useState<"pay_now" | "pay_later">("pay_later")

    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        location: "",
        notes: ""
    })

    if (items.length === 0) {
        return (
            <div className="container px-4 py-16 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">Add some beautiful gifts before checking out.</p>
                <Button asChild><Link href="/shop">Continue Shopping</Link></Button>
            </div>
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.fullName || !formData.phone || !formData.location) {
            toast.error("Please fill in your name, phone number, and location.")
            return
        }
        if (payment === "pay_now" && !/^0(7|1)\d{8}$/.test(formData.phone.replace(/\s/g, ""))) {
            toast.error("Please enter a valid Kenyan phone number (e.g., 0712345678) for M-Pesa.")
            return
        }

        setIsSubmitting(true)
        const orderId = generateOrderId()

        try {
            // 1. SAVE THE COMPLETE ORDER TO SUPABASE FIRST 
            const createRes = await fetch("/api/orders/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: orderId,
                    customerName: formData.fullName,
                    customerPhone: formData.phone,
                    customerEmail: formData.email,
                    location: formData.location,
                    notes: formData.notes,
                    fulfillment: fulfillment,
                    payment: payment,
                    subtotal: subtotal,
                    totalAmount: subtotal,
                    items: items,
                })
            })

            if (!createRes.ok) {
                const errData = await createRes.json()
                throw new Error(errData.error || "Failed to save order details")
            }

            // 2. IF PAY NOW, TRIGGER STK PUSH
            if (payment === "pay_now") {
                const stkRes = await fetch("/api/mpesa/stkpush", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        phone: formData.phone,
                        amount: subtotal,
                        orderId,
                        description: `Li & Lanny Order ${orderId}`
                    })
                })

                const stkData = await stkRes.json()
                if (!stkRes.ok) throw new Error(stkData.error || "Failed to initiate M-Pesa")

                toast.success("M-Pesa prompt sent! Check your phone.")
            } else {
                toast.success("Order placed! We will contact you shortly.")
            }

            // 3. CLEAR CART & REDIRECT
            clearCart()
            router.push(`/success?order=${orderId}&fulfillment=${fulfillment}&payment=${payment}&phone=${formData.phone}`)

        } catch (error: any) {
            toast.error(error.message || "Something went wrong. Please try again.")
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container px-4 py-8 max-w-6xl mx-auto">
            <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="h-4 w-4" /> Back to Shop
            </Link>

            <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT COLUMN: Forms */}
                <div className="lg:col-span-2 space-y-8">

                    {/* 1. Contact & Location Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" /> Contact & Location
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name *</Label>
                                    <Input id="fullName" placeholder="John Doe" value={formData.fullName} onChange={e => setFormData({ ...formData, fullName: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number (M-Pesa) *</Label>
                                    <Input id="phone" placeholder="0712 345 678" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address (Optional)</Label>
                                <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Your Location / Landmark *</Label>
                                <Input id="location" placeholder="e.g., Kilimani, near Yaya Centre" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                                <p className="text-xs text-muted-foreground">This helps us estimate delivery or prepare your pickup.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Order Notes (Optional)</Label>
                                <Input id="notes" placeholder="e.g., Please wrap as a birthday gift" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Fulfillment Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Truck className="h-5 w-5 text-primary" /> How would you like to get your order?
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup value={fulfillment} onValueChange={(v: any) => setFulfillment(v)} className="space-y-3">
                                <Label className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                                    <div className="flex items-center gap-3">
                                        <RadioGroupItem value="pickup" id="pickup" />
                                        <div>
                                            <p className="font-medium">Store Pickup</p>
                                            <p className="text-sm text-muted-foreground">Collect from our Nairobi shop (Free)</p>
                                        </div>
                                    </div>
                                </Label>

                                <Label className="flex flex-col p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                                    <div className="flex items-center gap-3 mb-2">
                                        <RadioGroupItem value="delivery" id="delivery" />
                                        <div>
                                            <p className="font-medium">Delivery to My Location</p>
                                        </div>
                                    </div>
                                    <div className="pl-7 pr-2 py-2 bg-primary/5 rounded-md border border-primary/10">
                                        <p className="text-sm text-primary font-medium flex items-start gap-2">
                                            <MessageCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <span>Delivery fees vary by location. We will call or WhatsApp you shortly after you place this order to confirm the exact delivery cost before dispatching.</span>
                                        </p>
                                    </div>
                                </Label>
                            </RadioGroup>
                        </CardContent>
                    </Card>

                    {/* 3. Payment Method */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-primary" /> Payment Method
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup value={payment} onValueChange={(v: any) => setPayment(v)} className="space-y-3">

                                <Label className="relative flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                                    <div className="absolute -top-3 right-4">
                                        <Badge className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5">POPULAR</Badge>
                                    </div>
                                    <RadioGroupItem value="pay_later" id="pay_later" className="mt-1" />
                                    <div>
                                        <p className="font-medium">Order Now, Pay Later</p>
                                        <p className="text-sm text-muted-foreground mt-1">Place your order now to secure your items. We will send you payment details via WhatsApp/Call during our delivery/pickup confirmation.</p>
                                    </div>
                                </Label>

                                <Label className="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-primary/5">
                                    <RadioGroupItem value="pay_now" id="pay_now" className="mt-1" />
                                    <div>
                                        <p className="font-medium">Pay Now (M-Pesa STK Push)</p>
                                        <p className="text-sm text-muted-foreground mt-1">We will send an M-Pesa prompt to your phone immediately. Just enter your PIN to complete the order.</p>
                                    </div>
                                </Label>

                            </RadioGroup>
                        </CardContent>
                    </Card>
                </div>

                {/* RIGHT COLUMN: Order Summary */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {items.map((item) => {
                                    const price = item.sale_price && item.sale_price < item.price ? item.sale_price : item.price
                                    return (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                                <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                <span className="absolute -top-1 -right-1 h-5 w-5 bg-background border rounded-full text-[10px] flex items-center justify-center font-bold">
                                                    {item.quantity}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                                                <p className="text-sm text-muted-foreground mt-1">KES {price.toLocaleString()} x {item.quantity}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <Separator />

                            <div className="flex justify-between items-center pt-2">
                                <span className="text-lg font-bold">Total</span>
                                <span className="text-2xl font-bold text-primary">KES {subtotal.toLocaleString()}</span>
                            </div>

                            {fulfillment === "delivery" && (
                                <p className="text-xs text-muted-foreground text-center italic">
                                    * Delivery fee will be added and confirmed with you separately.
                                </p>
                            )}

                            <Button type="submit" size="lg" className="w-full mt-4 h-12 text-base" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
                                ) : payment === "pay_now" ? (
                                    `Pay KES ${subtotal.toLocaleString()} Now`
                                ) : (
                                    "Place Order (Pay Later)"
                                )}
                            </Button>

                            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                                <MapPin className="h-3 w-3" /> Secure, hassle-free ordering
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </div>
    )
}