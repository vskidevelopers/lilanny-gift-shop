"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Gift, Truck, Shield } from "lucide-react"
import { ProductCard } from "@/components/shop/ProductCard"

interface Product {
    id: string
    name: string
    slug: string
    price: number
    sale_price?: number | null
    images: string[]
    tags?: string[]
    category?: { name: string } | null
}

export function HomePageClient({ products }: { products: Product[] }) {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollY } = useScroll()
    const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER!

    // Parallax transforms
    const heroY = useTransform(scrollY, [0, 300], [0, 100])
    const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.7])

    // Filter products by tag
    const productsByTag = useMemo(() => {
        const tags = ["Trending", "New", "Sales", "educational"]
        const result: Record<string, Product[]> = {}

        tags.forEach(tag => {
            result[tag] = products
                .filter(p => p.tags?.includes(tag))
                .slice(0, 10) // Show max 10 per section
        })

        return result
    }, [products])

    // Check if any tag section has products
    const hasAnyProducts = Object.values(productsByTag).some(arr => arr.length > 0)

    return (
        <div ref={containerRef} className="overflow-hidden">

            {/* 🎨 HERO SECTION - Parallax */}
            <section className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5">
                {/* Background Image */}
                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="absolute inset-0 bg-[url('https://jmaiujntubdnenicctvr.supabase.co/storage/v1/object/public/homepage/home.webp')] bg-cover bg-center"
                />

                {/* Content */}
                <div className="container px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="max-w-3xl mx-auto"
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/70 text-white text-sm font-medium mb-6">
                            <Sparkles className="h-3 w-3" /> New Arrivals Just Dropped
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white">
                            Unique Toys & Gifts <br />
                            <span className="text-primary">Made with Love</span>
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Handpicked treasures for kids and adults. Nairobi-based, Kenya-wide delivery with care.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/shop">
                                <Button size="lg" className="gap-2">
                                    Shop Now <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/about">
                                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
                                    Our Story
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 🎁 VALUE PROPS */}
            <section className="py-16 bg-background">
                <div className="container px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Gift, title: "Handpicked Quality", desc: "Every item curated with care" },
                            { icon: Truck, title: "Nairobi Pickup", desc: "Free collection or KES 300 delivery" },
                            { icon: Shield, title: "Secure Payment", desc: "M-Pesa STK push, safe & instant" },
                            { icon: Sparkles, title: "Gift Ready", desc: "Beautiful packaging included" },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className="p-6 rounded-xl border bg-card hover:shadow-sm transition-shadow"
                            >
                                <item.icon className="h-8 w-8 text-primary mb-4" />
                                <h3 className="font-semibold mb-2">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 🛍️ TAG-BASED PRODUCT SECTIONS */}
            {hasAnyProducts && (
                <section className="py-16 bg-muted/30">
                    <div className="container px-4">
                        <div className="text-center mb-10">
                            <h2 className="text-2xl md:text-3xl font-bold mb-3">Shop by Mood</h2>
                            <p className="text-muted-foreground">Curated collections for every occasion</p>
                        </div>

                        {["Trending", "New", "Sale", "educational"].map((tag) => {
                            const tagProducts = productsByTag[tag]
                            if (tagProducts?.length === 0) return null // Skip empty sections

                            return (
                                <div key={tag} className="mb-12 last:mb-0">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold capitalize">{tag.replace("-", " ")}</h3>
                                        <Link href={`/shop?tag=${tag}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                                            View all <ArrowRight className="h-3 w-3" />
                                        </Link>
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                        {tagProducts?.map((product) => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            )}

            {/* 📱 ENGAGEMENT BANNER */}
            <section className="py-16 bg-primary text-primary-foreground">
                <div className="container px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-2xl mx-auto"
                    >
                        <h2 className="text-2xl md:text-3xl font-bold mb-4">Not sure what to pick?</h2>
                        <p className="text-lg opacity-90 mb-6">
                            Chat with us on WhatsApp. We&apos;ll help you find the perfect gift in minutes.
                        </p>
                        <Button size="lg" variant="secondary" className="gap-2" asChild>
                            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer">
                                Chat on WhatsApp
                            </a>
                        </Button>
                    </motion.div>
                </div>
            </section>

        </div>
    )
}