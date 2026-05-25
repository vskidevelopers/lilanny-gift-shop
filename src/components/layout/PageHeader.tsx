"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import { ChevronRight, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
    title: string
    description?: string
    backgroundImage?: string
    gradient?: "primary" | "accent" | "soft" | "none"
    ctaLabel?: string
    ctaHref?: string
    breadcrumbs?: { label: string; href?: string }[]
    className?: string
}

export function PageHeader({
    title,
    description,
    backgroundImage,
    gradient = "soft",
    ctaLabel,
    ctaHref,
    breadcrumbs,
    className,
}: Props) {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollY } = useScroll()

    // Parallax effect: subtle background movement on scroll
    const bgY = useTransform(scrollY, [0, 200], [0, 30])
    const opacity = useTransform(scrollY, [0, 150], [1, 0.85])

    // Gradient presets
    const gradients = {
        primary: "from-primary/10 via-background to-accent/5",
        accent: "from-accent/10 via-background to-primary/5",
        soft: "from-muted/20 via-background to-muted/10",
        none: "",
    }

    return (
        <motion.section
            ref={ref}
            style={{ opacity }}
            className={cn(
                "relative overflow-hidden py-12 md:py-12 lg:py-12",
                backgroundImage ? "min-h-[40vh]" : "",
                gradients[gradient],
                className
            )}
        >
            {/* Background Image + Overlay */}
            {backgroundImage && (
                <motion.div
                    style={{ y: bgY, backgroundImage: `url(${backgroundImage})` }}
                    className="absolute inset-0 bg-cover bg-center"
                />
            )}

            {/* Gradient Overlay */}
            <div className={cn(
                "absolute inset-0",
                backgroundImage && "bg-gradient-to-t from-background/90 via-background/50 to-transparent"
            )} />

            <div className="container px-4 relative z-10">
                {/* Breadcrumbs */}
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <motion.nav
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-sm text-muted-foreground mb-4"
                    >
                        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                        {breadcrumbs.map((crumb, i) => (
                            <span key={i} className="flex items-center gap-1">
                                <ChevronRight className="h-3 w-3" />
                                {crumb.href ? (
                                    <Link href={crumb.href} className="hover:text-primary transition-colors">
                                        {crumb.label}
                                    </Link>
                                ) : (
                                    <span className="text-foreground font-medium">{crumb.label}</span>
                                )}
                            </span>
                        ))}
                    </motion.nav>
                )}

                {/* Title + Description */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="max-w-3xl"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary uppercase tracking-wider">
                            Li & Lanny Trends
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                        {title}
                    </h1>

                    {description && (
                        <p className="text-lg text-muted-foreground mb-6 max-w-2xl">
                            {description}
                        </p>
                    )}

                    {/* Optional CTA */}
                    {ctaLabel && ctaHref && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Link href={ctaHref}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-sm"
                                >
                                    {ctaLabel}
                                    <ChevronRight className="h-4 w-4" />
                                </motion.button>
                            </Link>
                        </motion.div>
                    )}
                </motion.div>
            </div>

            {/* Decorative Floating Elements (Subtle) */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-primary/5 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl animate-pulse delay-700" />
        </motion.section>
    )
}