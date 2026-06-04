"use client"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/layout/PageHeader"
import {
    Heart,
    Sparkles,
    Gift,
    Truck,
    ShieldCheck,
    Palette,
    Users,
    Star,
    ArrowRight,
    MessageCircle,
    MapPin,
    Package,
} from "lucide-react"

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollY } = useScroll()

    // Parallax for the story image
    const storyY = useTransform(scrollY, [400, 900], [0, -50])

    return (
        <div ref={containerRef} className="overflow-hidden">
            {/* 🎨 HERO */}
            <PageHeader
                title="Our Story"
                description="How Li & Lanny Trends began — a passion for quality, creativity, and joy."
                gradient="accent"
                breadcrumbs={[{ label: "About" }]}
            />

            {/* 📖 THE ORIGIN STORY */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                        {/* Text */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                <Heart className="h-3 w-3" /> Our Beginning
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                                Born from a Love of <span className="text-primary">Meaningful Gifting</span>
                            </h2>
                            <div className="space-y-4 text-muted-foreground leading-relaxed">
                                <p>
                                    Li & Lanny Trends started with a simple belief: every gift should feel like a story.
                                    In a world of mass-produced items, we saw a need for something different — carefully
                                    curated pieces that carry emotion, quality, and a personal touch.
                                </p>
                                <p>
                                    From our home in Nairobi, we began handpicking toys, gifts, and accessories that
                                    spark joy in kids and adults alike. Each item in our collection is chosen with intention —
                                    not just for how it looks, but for the memories it will create.
                                </p>
                                <p>
                                    Today, we&apos;re proud to serve families across Kenya, delivering not just products,
                                    but moments of happiness wrapped with care.
                                </p>
                            </div>
                        </motion.div>

                        {/* Image with parallax */}
                        <motion.div
                            style={{ y: storyY }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <Image
                                src="https://jmaiujntubdnenicctvr.supabase.co/storage/v1/object/public/homepage/42880216fafaf401439d053a64f49ffb.jpg"
                                alt="Gift wrapping"
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 💎 OUR VALUES */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                            <Sparkles className="h-3 w-3" /> What We Stand For
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                            Built on <span className="text-primary">Values That Matter</span>
                        </h2>
                        <p className="text-muted-foreground">
                            Every decision we make is guided by these core principles.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[
                            {
                                icon: Heart,
                                title: "Curated with Love",
                                desc: "Every product is handpicked by our team. We never mass-list — we thoughtfully select items that meet our quality standards.",
                            },
                            {
                                icon: Gift,
                                title: "Gift-Ready Always",
                                desc: "Beautiful packaging is included with every order. Because presentation matters when you're giving something special.",
                            },
                            {
                                icon: ShieldCheck,
                                title: "Trust & Transparency",
                                desc: "Clear pricing, honest descriptions, and real support. We treat every customer like family.",
                            },
                            {
                                icon: Palette,
                                title: "Unique Finds",
                                desc: "We source items you won't find in every mall. From artisan pieces to rare imports, we bring you the extraordinary.",
                            },
                            {
                                icon: Truck,
                                title: "Kenya-Wide Delivery",
                                desc: "From Nairobi to upcountry, we work with trusted couriers to get your gifts to you safely and on time.",
                            },
                            {
                                icon: Users,
                                title: "Community First",
                                desc: "We're more than a shop — we're a community of gift-givers who believe in the power of thoughtful surprises.",
                            },
                        ].map((value, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                            >
                                <Card className="h-full hover:shadow-md transition-shadow bg-background">
                                    <CardContent className="p-6 space-y-3">
                                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                            <value.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <h3 className="font-semibold text-lg">{value.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 📊 BY THE NUMBERS */}
            <section className="py-16 md:py-24 bg-background">
                <div className="container px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                                The Li & Lanny <span className="text-primary">Impact</span>
                            </h2>
                            <p className="text-muted-foreground">Numbers that tell our story</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { number: "500+", label: "Happy Customers" },
                                { number: "200+", label: "Unique Products" },
                                { number: "47", label: "Counties Served" },
                                { number: "4.9★", label: "Customer Rating" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.4 }}
                                    className="text-center p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border"
                                >
                                    <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                                        {stat.number}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 🌟 WHY CHOOSE US */}
            <section className="py-16 md:py-24 bg-muted/30">
                <div className="container px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                                <Star className="h-3 w-3" /> The Difference
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                                Why Customers <span className="text-primary">Choose Us</span>
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    icon: Package,
                                    title: "No Generic Catalogues",
                                    desc: "Unlike big retailers, we don't list thousands of random items. Every product on our site has been personally reviewed and approved by our team.",
                                },
                                {
                                    icon: MessageCircle,
                                    title: "Real Human Support",
                                    desc: "Chat with us on WhatsApp anytime. No bots, no automated responses — just real people who care about your order.",
                                },
                                {
                                    icon: Gift,
                                    title: "Complimentary Gift Wrapping",
                                    desc: "Every order comes beautifully packaged at no extra cost. Perfect for birthdays, anniversaries, or 'just because' moments.",
                                },
                                {
                                    icon: MapPin,
                                    title: "Proudly Kenyan",
                                    desc: "Based in Nairobi, we understand local needs. From M-Pesa integration to Kenya-wide delivery, we've built this for you.",
                                },
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.4 }}
                                    className="flex gap-4 p-6 rounded-xl bg-background border hover:shadow-md transition-shadow"
                                >
                                    <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                        <item.icon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 💌 CTA SECTION */}
            <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
                <div className="container px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-2xl mx-auto space-y-6"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold">
                            Ready to Find the Perfect Gift?
                        </h2>
                        <p className="text-lg opacity-90">
                            Browse our curated collection or chat with us — we&apos;re here to help you make someone&apos;s day.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Button size="lg" variant="secondary" className="gap-2" asChild>
                                <Link href="/shop">
                                    Shop Now <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                                asChild
                            >
                                <a href="https://wa.me/254791242021" target="_blank" rel="noopener noreferrer">
                                    <MessageCircle className="h-4 w-4" /> Chat on WhatsApp
                                </a>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}