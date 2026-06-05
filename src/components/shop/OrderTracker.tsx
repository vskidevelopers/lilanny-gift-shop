/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
    Package,
    Phone,
    Search,
    Loader2,
    CheckCircle2,
    Clock,
    XCircle,
    Truck,
    MapPin,
    MessageCircle,
    RotateCcw,
    ShoppingBag,
    CreditCard,
} from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface Order {
    id: string
    payment_status: string
    fulfillment_status: string
    payment_method: string
    fulfillment_method: string
    total_amount: number
    amount_paid: number
    created_at: string
    order_items: any[]
    location: string
    notes?: string | null
}

export function OrderTracker() {
    const [orderId, setOrderId] = useState("")
    const [phone, setPhone] = useState("")
    const [loading, setLoading] = useState(false)
    const [order, setOrder] = useState<Order | null>(null)
    const [error, setError] = useState("")

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setOrder(null)

        if (!orderId.trim() || !phone.trim()) {
            setError("Please enter both your Order ID and phone number.")
            return
        }

        setLoading(true)
        try {
            const res = await fetch("/api/orders/track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId: orderId.trim(), phone: phone.trim() }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || "Order not found. Please check your details.")
                return
            }

            setOrder(data.order)
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const handleReset = () => {
        setOrder(null)
        setOrderId("")
        setPhone("")
        setError("")
    }

    // Timeline steps based on fulfillment_status
    const getTimelineSteps = (fulfillmentStatus: string) => {
        const steps = [
            { key: "pending", label: "Order Placed", desc: "We've received your order", icon: Package },
            { key: "processing", label: "Processing", desc: "We're preparing your gift", icon: Clock },
            { key: "shipped", label: "Shipped", desc: "On its way to you", icon: Truck },
            { key: "delivered", label: "Delivered", desc: "Enjoy your purchase!", icon: CheckCircle2 },
        ]

        const statusOrder = ["pending", "processing", "shipped", "delivered"]
        const currentIndex = statusOrder.indexOf(fulfillmentStatus)

        if (fulfillmentStatus === "cancelled") {
            return { steps, currentIndex: -1, cancelled: true }
        }

        return { steps, currentIndex, cancelled: false }
    }

    // Format payment method for display
    const formatPaymentMethod = (method: string) => {
        if (method === "pay_now") return "Pay Now (M-Pesa STK)"
        if (method === "pay_later") return "Pay Later"
        return method
    }

    // Get payment status badge
    const getPaymentStatusBadge = (status: string) => {
        switch (status) {
            case "paid":
                return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Paid</Badge>
            case "pending":
                return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Pending Payment</Badge>
            case "failed":
                return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Payment Failed</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!
    const whatsappMessage = encodeURIComponent(
        order
            ? `Hello Li & Lanny Trends! 👋 I'm checking on my order ${order.id}. Can you help me with the latest status? Thank you!`
            : ""
    )
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

    return (
        <div className="space-y-6">
            <AnimatePresence mode="wait">
                {!order ? (
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        <Card className="shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Search className="h-5 w-5 text-primary" />
                                    Find Your Order
                                </CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    You can find your Order ID on the confirmation page or in your WhatsApp message.
                                </p>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleTrack} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="orderId">Order ID</Label>
                                        <Input
                                            id="orderId"
                                            placeholder="e.g., ORD-MPYVQTQ4"
                                            value={orderId}
                                            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                                            className="font-mono"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="phone"
                                                placeholder="0712 345 678"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="pl-9"
                                                required
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            The phone number you used during checkout.
                                        </p>
                                    </div>

                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-start gap-2"
                                        >
                                            <XCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                            <span>{error}</span>
                                        </motion.div>
                                    )}

                                    <Button type="submit" className="w-full h-11" disabled={loading}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Finding your order...
                                            </>
                                        ) : (
                                            <>
                                                <Search className="h-4 w-4 mr-2" />
                                                Track Order
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>

                        <Card className="bg-muted/30 border-dashed">
                            <CardContent className="p-6 space-y-3">
                                <h4 className="font-medium text-sm flex items-center gap-2">
                                    <MessageCircle className="h-4 w-4 text-primary" />
                                    Need help finding your Order ID?
                                </h4>
                                <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                                    <li>Check the confirmation page after checkout</li>
                                    <li>Look at the WhatsApp message we sent you</li>
                                    <li>Use the exact phone number from checkout</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        <Card className="overflow-hidden">
                            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 border-b">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                                        <h2 className="text-2xl font-bold font-mono">{order.id}</h2>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Placed on{" "}
                                            {new Date(order.created_at).toLocaleDateString("en-KE", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
                                        <div className="mt-3">
                                            {getPaymentStatusBadge(order.payment_status)}
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleReset} className="w-fit">
                                        <RotateCcw className="h-4 w-4 mr-2" />
                                        Track Another
                                    </Button>
                                </div>
                            </div>

                            <CardContent className="p-6">
                                {(() => {
                                    const { steps, currentIndex, cancelled } = getTimelineSteps(order.fulfillment_status)

                                    if (cancelled) {
                                        return (
                                            <div className="flex flex-col items-center py-8 text-center">
                                                <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                                                    <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                                                </div>
                                                <h3 className="text-xl font-bold mb-2">Order Cancelled</h3>
                                                <p className="text-muted-foreground mb-4 max-w-md">
                                                    This order has been cancelled. Please contact us on WhatsApp for more details or a refund.
                                                </p>
                                                <Button asChild className="gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white">
                                                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                                        <MessageCircle className="h-4 w-4" />
                                                        Chat With Us
                                                    </a>
                                                </Button>
                                            </div>
                                        )
                                    }

                                    return (
                                        <div className="space-y-0">
                                            {steps.map((step, idx) => {
                                                const isCompleted = idx < currentIndex
                                                const isCurrent = idx === currentIndex
                                                const isPending = idx > currentIndex
                                                const Icon = step.icon

                                                return (
                                                    <div key={step.key} className="flex gap-4 relative">
                                                        {idx < steps.length - 1 && (
                                                            <div
                                                                className={`absolute left-5 top-10 w-0.5 h-full -translate-x-1/2 ${isCompleted ? "bg-primary" : "bg-muted-foreground/20"
                                                                    }`}
                                                            />
                                                        )}

                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                            className={`relative z-10 flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isCompleted
                                                                ? "bg-primary text-primary-foreground"
                                                                : isCurrent
                                                                    ? "bg-primary/20 text-primary ring-4 ring-primary/20"
                                                                    : "bg-muted text-muted-foreground"
                                                                }`}
                                                        >
                                                            {isCompleted ? (
                                                                <CheckCircle2 className="h-5 w-5" />
                                                            ) : (
                                                                <Icon className="h-5 w-5" />
                                                            )}
                                                        </motion.div>

                                                        <div className="flex-1 pb-8">
                                                            <motion.div
                                                                initial={{ opacity: 0, x: -10 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: idx * 0.1 + 0.05 }}
                                                            >
                                                                <h4
                                                                    className={`font-semibold ${isPending ? "text-muted-foreground" : "text-foreground"
                                                                        }`}
                                                                >
                                                                    {step.label}
                                                                </h4>
                                                                <p className="text-sm text-muted-foreground mt-0.5">{step.desc}</p>
                                                                {isCurrent && (
                                                                    <Badge className="mt-2 bg-primary/10 text-primary border-primary/20">
                                                                        Current Status
                                                                    </Badge>
                                                                )}
                                                            </motion.div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })()}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ShoppingBag className="h-5 w-5 text-primary" />
                                    Order Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-start gap-2">
                                        <CreditCard className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-muted-foreground text-xs uppercase">Payment Method</p>
                                            <p className="font-medium">{formatPaymentMethod(order.payment_method)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                        <div>
                                            <p className="text-muted-foreground text-xs uppercase">Delivery Location</p>
                                            <p className="font-medium">{order.location}</p>
                                        </div>
                                    </div>
                                </div>

                                {order.notes && (
                                    <div className="p-3 bg-muted/50 rounded-lg text-sm">
                                        <p className="text-muted-foreground text-xs uppercase mb-1">Your Notes</p>
                                        <p className="italic">{order.notes}</p>
                                    </div>
                                )}

                                <Separator />

                                <div className="space-y-3">
                                    <h4 className="font-medium text-sm">Items in your order</h4>
                                    {order.order_items.map((item: any, idx: number) => {
                                        const price =
                                            item.sale_price && item.sale_price < item.price ? item.sale_price : item.price
                                        return (
                                            <div key={idx} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                                                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                                                    {item.selectedVariants &&
                                                        Object.keys(item.selectedVariants).length > 0 && (
                                                            <p className="text-xs text-muted-foreground mt-1">
                                                                {Object.entries(item.selectedVariants)
                                                                    .map(([k, v]) => `${k}: ${v}`)
                                                                    .join(", ")}
                                                            </p>
                                                        )}
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {item.quantity} × KES {price.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-sm">
                                                        KES {(price * item.quantity).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                <Separator />

                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-lg font-bold">Total</span>
                                    <span className="text-2xl font-bold text-primary">
                                        KES {order.total_amount.toLocaleString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-gradient-to-br from-[#25D366]/10 to-[#25D366]/5 border-[#25D366]/20">
                            <CardContent className="p-6 text-center space-y-4">
                                <div className="h-12 w-12 rounded-full bg-[#25D366]/20 flex items-center justify-center mx-auto">
                                    <MessageCircle className="h-6 w-6 text-[#25D366]" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">Have questions about your order?</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Chat with us directly on WhatsApp. We&apos;re here to help!
                                    </p>
                                </div>
                                <Button
                                    asChild
                                    size="lg"
                                    className="gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white w-full sm:w-auto"
                                >
                                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                        <MessageCircle className="h-5 w-5" />
                                        Chat on WhatsApp
                                    </a>
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}