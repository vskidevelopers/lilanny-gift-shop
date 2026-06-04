import { PageHeader } from "@/components/layout/PageHeader"
import { OrderTracker } from "@/components/shop/OrderTracker"

export default function TrackPage() {
    return (
        <div className="min-h-screen">
            <PageHeader
                title="Track Your Order"
                description="Enter your Order ID and phone number to see the latest status of your gift."
                gradient="soft"
                breadcrumbs={[{ label: "Track Order" }]}
            />
            <div className="container px-4 py-8 max-w-3xl mx-auto -mt-4">
                <OrderTracker />
            </div>
        </div>
    )
}