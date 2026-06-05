import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { SuccessContent } from "./SuccessContent"

function SuccessSkeleton() {
    return (
        <div className="container px-4 py-16 max-w-2xl mx-auto text-center space-y-6">
            <Skeleton className="h-20 w-20 rounded-full mx-auto" />
            <Skeleton className="h-10 w-3/4 mx-auto" />
            <Skeleton className="h-6 w-1/2 mx-auto" />
            <Card className="p-6 space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
            </Card>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Skeleton className="h-12 w-64" />
                <Skeleton className="h-12 w-48" />
            </div>
        </div>
    )
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<SuccessSkeleton />}>
            <SuccessContent />
        </Suspense>
    )
}