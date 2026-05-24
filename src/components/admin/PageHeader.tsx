"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

interface Props {
    title: string
    description?: string
    actionLabel?: string
    actionHref?: string      // For navigation (Server-safe)
    onClick?: () => void     // For client actions like dialogs
}

export function PageHeader({ title, description, actionLabel, actionHref, onClick }: Props) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                {description && <p className="text-muted-foreground mt-1 text-sm">{description}</p>}
            </div>
            {actionLabel && (
                actionHref ? (
                    <Link href={actionHref}>
                        <Button className="gap-2"><Plus className="h-4 w-4" /> {actionLabel}</Button>
                    </Link>
                ) : onClick ? (
                    <Button onClick={onClick} className="gap-2"><Plus className="h-4 w-4" /> {actionLabel}</Button>
                ) : null
            )}
        </div>
    )
}