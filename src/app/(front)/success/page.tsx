"use client"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, MessageCircle, ShoppingBag, ArrowLeft } from "lucide-react"

export default function SuccessPage() {
    const searchParams = useSearchParams()
    const orderId = searchParams.get("order") || "ORD-UNKNOWN"
    const fulfillment = searchParams.get("fulfillment")
    const payment = searchParams.get("payment")
    const phone = searchParams.get("phone")

    // Dynamic WhatsApp message generator
    const getWhatsAppMessage = () => {
        let msg = `Hello Li & Lanny Trends! 👋 I just placed an order on your website (Order ID: ${orderId}). `

        if (fulfillment === "delivery" && payment === "pay_later") {
            msg += "I chose delivery and 'Pay Later'. I'm reaching out to confirm my location details and get the exact delivery fee. Thank you!"
        } else if (fulfillment === "delivery" && payment === "pay_now") {
            msg += "I have already paid via M-Pesa. I'm reaching out to confirm my delivery details and expected arrival time. Thank you!"
        } else if (fulfillment === "pickup" && payment === "pay_later") {
            msg += "I chose Store Pickup and 'Pay Later'. I'm reaching out to confirm when my order will be ready for collection and to arrange payment. Thank you!"
        } else {
            msg += "I have already paid via M-Pesa and will be picking up my order. Please let me know when it's ready for collection. Thank you!"
        }

        return encodeURIComponent(msg)
    }

    // Replace with your actual business WhatsApp number (format: 2547XXXXXXXX)
    const whatsappNumber = "254791242021"
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${getWhatsAppMessage()}`

    return (
        <div className="container px-4 py-16 max-w-2xl mx-auto text-center">
            <div className="mb-8 flex justify-center">
                <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
            </div>

            <h1 className="text-3xl font-bold tracking-tight mb-4">Order Placed Successfully!</h1>
            <p className="text-lg text-muted-foreground mb-8">
                Thank you for shopping with Li & Lanny Trends. Your order <span className="font-mono font-bold text-foreground">{orderId}</span> has been received.
            </p>

            <Card className="mb-8 text-left">
                <CardHeader>
                    <CardTitle className="text-lg">What happens next?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <p>1. We have received your order details.</p>
                    <p>2. {fulfillment === "delivery" ? "Our team will call or WhatsApp you shortly to confirm your location and discuss the delivery fee." : "We will prepare your items for store pickup."}</p>
                    <p>3. {payment === "pay_later" ? "We will share the M-Pesa Paybill details with you during our follow-up call/message." : "Your payment is being verified."}</p>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white" asChild>
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                        <MessageCircle className="h-5 w-5" />
                        Chat on WhatsApp to Confirm
                    </a>
                </Button>

                <Button size="lg" variant="outline" className="gap-2" asChild>
                    <Link href="/shop">
                        <ArrowLeft className="h-5 w-5" />
                        Continue Shopping
                    </Link>
                </Button>
            </div>
        </div>
    )
}