import { PageHeader } from "@/components/admin/PageHeader"
import { getOrders } from "@/lib/supabase/admin-actions"
import { OrdersTable } from "@/components/admin/OrdersTable"

export default async function AdminOrdersPage() {
    const orders = await getOrders()

    return (
        <div className="space-y-6">
            <PageHeader
                title="Orders"
                description="Manage customer orders, track payments, and update fulfillment."
            />
            <OrdersTable initialOrders={orders || []} />
        </div>
    )
}