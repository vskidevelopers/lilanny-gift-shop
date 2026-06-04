/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, Search, Package, CreditCard, Loader2 } from "lucide-react"
import { updateOrderStatus } from "@/lib/supabase/admin-actions"
import { toast } from "sonner"
import Image from "next/image"

interface Order {
    id: string
    created_at: string
    customer_name: string
    customer_phone: string
    customer_email: string | null
    location: string
    notes: string | null
    fulfillment_method: "pickup" | "delivery"
    payment_method: "pay_now" | "pay_later"
    subtotal: number
    delivery_fee: number
    total_amount: number
    amount_paid: number
    payment_status: "pending" | "paid" | "failed" | "refunded"
    fulfillment_status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
    mpesa_receipt: string | null
    order_items: any[]
}

export function OrdersTable({ initialOrders }: { initialOrders: Order[] }) {
    const [orders, setOrders] = useState<Order[]>(initialOrders)
    const [expandedRow, setExpandedRow] = useState<string | null>(null)
    const [updating, setUpdating] = useState<Set<string>>(new Set())

    // Filters
    const [search, setSearch] = useState("")
    const [filterPayment, setFilterPayment] = useState("all")
    const [filterFulfillment, setFilterFulfillment] = useState("all")

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(search.toLowerCase()) ||
            order.customer_name.toLowerCase().includes(search.toLowerCase()) ||
            order.customer_phone.includes(search)
        const matchesPayment = filterPayment === "all" || order.payment_status === filterPayment
        const matchesFulfillment = filterFulfillment === "all" || order.fulfillment_status === filterFulfillment
        return matchesSearch && matchesPayment && matchesFulfillment
    })

    const handleStatusChange = async (orderId: string, type: "payment" | "fulfillment", value: string) => {
        setUpdating(prev => new Set(prev).add(orderId))

        const updatePayload = type === "payment"
            ? { paymentStatus: value }
            : { fulfillmentStatus: value }

        const res = await updateOrderStatus(orderId, updatePayload.paymentStatus, updatePayload.fulfillmentStatus)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Status updated")
            // Optimistic update
            setOrders(prev => prev.map(o =>
                o.id === orderId ? { ...o, [`${type}_status`]: value } : o
            ))
        }
        setUpdating(prev => {
            const next = new Set(prev)
            next.delete(orderId)
            return next
        })
    }

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
            paid: "bg-green-500/10 text-green-600 border-green-500/20",
            failed: "bg-red-500/10 text-red-600 border-red-500/20",
            refunded: "bg-gray-500/10 text-gray-600 border-gray-500/20",
            processing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
            shipped: "bg-purple-500/10 text-purple-600 border-purple-500/20",
            delivered: "bg-green-500/10 text-green-600 border-green-500/20",
            cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
        }
        return colors[status] || "bg-gray-500/10 text-gray-600"
    }

    return (
        <Card>
            {/* Filters */}
            <CardContent className="p-4 border-b space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by Order ID, Name, or Phone..."
                            className="pl-9"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Select value={filterPayment} onValueChange={setFilterPayment}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Payment Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Payments</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={filterFulfillment} onValueChange={setFilterFulfillment}>
                        <SelectTrigger className="w-full md:w-48">
                            <SelectValue placeholder="Fulfillment Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Fulfillment</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>

            {/* Table */}
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12"></TableHead>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Payment</TableHead>
                            <TableHead>Fulfillment</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrders.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No orders found matching your filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredOrders.map((order) => (
                                <>
                                    <TableRow key={order.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => setExpandedRow(expandedRow === order.id ? null : order.id)}>
                                        <TableCell>
                                            {expandedRow === order.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm font-medium">{order.id}</TableCell>
                                        <TableCell>
                                            <div className="font-medium">{order.customer_name}</div>
                                            <div className="text-xs text-muted-foreground">{order.customer_phone}</div>
                                        </TableCell>
                                        <TableCell className="font-semibold">KES {order.total_amount.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={order.payment_status}
                                                onValueChange={(val) => handleStatusChange(order.id, "payment", val)}
                                                disabled={updating.has(order.id)}
                                            >
                                                <SelectTrigger className={`w-32 h-7 text-xs border-0 ${getStatusColor(order.payment_status)}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="paid">Paid</SelectItem>
                                                    <SelectItem value="failed">Failed</SelectItem>
                                                    <SelectItem value="refunded">Refunded</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                value={order.fulfillment_status}
                                                onValueChange={(val) => handleStatusChange(order.id, "fulfillment", val)}
                                                disabled={updating.has(order.id)}
                                            >
                                                <SelectTrigger className={`w-36 h-7 text-xs border-0 ${getStatusColor(order.fulfillment_status)}`}>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pending</SelectItem>
                                                    <SelectItem value="processing">Processing</SelectItem>
                                                    <SelectItem value="shipped">Shipped</SelectItem>
                                                    <SelectItem value="delivered">Delivered</SelectItem>
                                                    <SelectItem value="cancelled">Cancelled</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(order.created_at).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" })}
                                        </TableCell>
                                    </TableRow>

                                    {/* Expanded Details Row */}
                                    {expandedRow === order.id && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="bg-muted/30 p-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    {/* Left: Customer & Order Details */}
                                                    <div className="space-y-4">
                                                        <h4 className="font-semibold flex items-center gap-2">
                                                            <Package className="h-4 w-4 text-primary" /> Order Details
                                                        </h4>
                                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <span className="text-muted-foreground block text-xs uppercase">Method</span>
                                                                <span className="capitalize font-medium">{order.fulfillment_method} ({order.payment_method.replace("_", " ")})</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-muted-foreground block text-xs uppercase">Location</span>
                                                                <span className="font-medium">{order.location}</span>
                                                            </div>
                                                            {order.customer_email && (
                                                                <div>
                                                                    <span className="text-muted-foreground block text-xs uppercase">Email</span>
                                                                    <span className="font-medium">{order.customer_email}</span>
                                                                </div>
                                                            )}
                                                            {order.mpesa_receipt && (
                                                                <div>
                                                                    <span className="text-muted-foreground block text-xs uppercase">M-Pesa Receipt</span>
                                                                    <span className="font-mono font-medium text-green-600">{order.mpesa_receipt}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        {order.notes && (
                                                            <div className="p-3 bg-background rounded-md border text-sm">
                                                                <span className="text-muted-foreground block text-xs uppercase mb-1">Customer Notes</span>
                                                                <span className="italic">{order.notes}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Right: Cart Items */}
                                                    <div className="space-y-4">
                                                        <h4 className="font-semibold flex items-center gap-2">
                                                            <CreditCard className="h-4 w-4 text-primary" /> Items Purchased
                                                        </h4>
                                                        <div className="space-y-3">
                                                            {order.order_items.map((item: any, idx: number) => {
                                                                const price = item.sale_price && item.sale_price < item.price ? item.sale_price : item.price
                                                                return (
                                                                    <div key={idx} className="flex gap-3 p-3 bg-background rounded-md border">
                                                                        <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                                                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                                                                        </div>
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="font-medium text-sm line-clamp-2">{item.name}</p>
                                                                            {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                                                                                <p className="text-xs text-muted-foreground mt-1">
                                                                                    {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(", ")}
                                                                                </p>
                                                                            )}
                                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                                {item.quantity} x KES {price.toLocaleString()}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        <div className="flex justify-end pt-2 border-t">
                                                            <div className="text-right">
                                                                <p className="text-sm text-muted-foreground">Subtotal: KES {order.subtotal.toLocaleString()}</p>
                                                                {order.delivery_fee > 0 && <p className="text-sm text-muted-foreground">Delivery: KES {order.delivery_fee.toLocaleString()}</p>}
                                                                <p className="text-lg font-bold mt-1">Total: KES {order.total_amount.toLocaleString()}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </Card>
    )
}