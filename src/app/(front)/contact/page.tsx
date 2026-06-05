"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/layout/PageHeader"
import { toast } from "sonner"
import {
    MessageCircle,
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    Loader2,
    CheckCircle2,
    HelpCircle,
} from "lucide-react"

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    })
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Please fill in all required fields")
            return
        }

        setLoading(true)

        // Simulate form submission (can wire to email service later)
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Option 1: Redirect to WhatsApp with pre-filled message
        const whatsappMessage = encodeURIComponent(
            `Hello Li & Lanny Trends! 👋\n\nName: ${formData.name}\nEmail: ${formData.email}\nSubject: ${formData.subject || "General Inquiry"}\n\nMessage:\n${formData.message}`
        )

        setSubmitted(true)
        setLoading(false)
        toast.success("Message sent! We'll get back to you soon.")

        // Open WhatsApp in new tab
        window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${whatsappMessage}`, "_blank")
    }

    const handleWhatsAppClick = () => {
        const message = encodeURIComponent(
            "Hello Li & Lanny Trends! 👋 I have a question about your products."
        )
        window.open(`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${message}`, "_blank")
    }

    return (
        <div className="overflow-hidden">
            {/* 🎨 HERO */}
            <PageHeader
                title="Get in Touch"
                description="We'd love to hear from you. Whether you have a question, feedback, or just want to say hi — we're here."
                gradient="primary"
                breadcrumbs={[{ label: "Contact" }]}
            />

            {/* 📞 QUICK CONTACT OPTIONS */}
            <section className="py-12 md:py-16 bg-background">
                <div className="container px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {/* WhatsApp - Primary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-all hover:border-[#25D366]/50 group">
                                <CardContent className="p-6 text-center space-y-4">
                                    <div className="h-16 w-16 rounded-full bg-[#25D366]/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                        <MessageCircle className="h-8 w-8 text-[#25D366]" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">WhatsApp</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Fastest way to reach us
                                        </p>
                                        <p className="font-mono text-sm font-medium">0706 870 465</p>
                                    </div>
                                    <Button
                                        className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2"
                                        onClick={handleWhatsAppClick}
                                    >
                                        <MessageCircle className="h-4 w-4" />
                                        Chat Now
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Phone */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 group">
                                <CardContent className="p-6 text-center space-y-4">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                        <Phone className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Call Us</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            Mon-Sat, 9am-6pm
                                        </p>
                                        <p className="font-mono text-sm font-medium">0706 870 465</p>
                                    </div>
                                    <Button className="w-full gap-2" variant="outline" asChild>
                                        <a href="tel:+254791242021">
                                            <Phone className="h-4 w-4" />
                                            Call Now
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Email */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 group">
                                <CardContent className="p-6 text-center space-y-4">
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                                        <Mail className="h-8 w-8 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg mb-1">Email</h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            We reply within 24 hours
                                        </p>
                                        <p className="text-sm font-medium break-all">hello@lilanny.com</p>
                                    </div>
                                    <Button className="w-full gap-2" variant="outline" asChild>
                                        <a href="mailto:hello@lilanny.com">
                                            <Mail className="h-4 w-4" />
                                            Send Email
                                        </a>
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 📝 CONTACT FORM + INFO */}
            <section className="py-12 md:py-16 bg-muted/30">
                <div className="container px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">

                        {/* LEFT: Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <Card>
                                <CardContent className="p-6 md:p-8">
                                    <div className="mb-6">
                                        <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
                                        <p className="text-sm text-muted-foreground">
                                            Fill out the form and we&apos;ll get back to you within 24 hours.
                                        </p>
                                    </div>

                                    {submitted ? (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-center py-12 space-y-4"
                                        >
                                            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
                                                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                                            </div>
                                            <h3 className="text-xl font-semibold">Message Sent!</h3>
                                            <p className="text-muted-foreground">
                                                We&apos;ve received your message and will reply soon.
                                            </p>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSubmitted(false)
                                                    setFormData({ name: "", email: "", subject: "", message: "" })
                                                }}
                                            >
                                                Send Another Message
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Your Name *</Label>
                                                    <Input
                                                        id="name"
                                                        placeholder="John Doe"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email Address *</Label>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="john@example.com"
                                                        value={formData.email}
                                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="subject">Subject</Label>
                                                <Input
                                                    id="subject"
                                                    placeholder="What's this about?"
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="message">Message *</Label>
                                                <Textarea
                                                    id="message"
                                                    placeholder="Tell us what's on your mind..."
                                                    rows={5}
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    required
                                                />
                                            </div>

                                            <Button type="submit" className="w-full h-11 gap-2" disabled={loading}>
                                                {loading ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                        Sending...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="h-4 w-4" />
                                                        Send Message
                                                    </>
                                                )}
                                            </Button>

                                            <p className="text-xs text-center text-muted-foreground">
                                                By submitting, you agree to be contacted via WhatsApp or email.
                                            </p>
                                        </form>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* RIGHT: Business Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6"
                        >
                            {/* Location */}
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Visit Our Shop</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                Nairobi, Kenya<br />
                                                CBD Area (Exact location shared upon order confirmation)
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Business Hours */}
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <Clock className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold mb-3">Business Hours</h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Monday - Friday</span>
                                                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Saturday</span>
                                                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Sunday</span>
                                                    <span className="font-medium text-red-500">Closed</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* FAQ Teaser */}
                            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <HelpCircle className="h-6 w-6 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Common Questions</h3>
                                            <ul className="space-y-2 text-sm text-muted-foreground">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-primary mt-1">•</span>
                                                    <span>Do you deliver upcountry?</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-primary mt-1">•</span>
                                                    <span>Can I pay on delivery?</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-primary mt-1">•</span>
                                                    <span>Do you offer gift wrapping?</span>
                                                </li>
                                            </ul>
                                            <Button variant="link" className="p-0 h-auto mt-2" asChild>
                                                <Link href="/shop">Browse our FAQ section →</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Social Media */}
                            <Card>
                                <CardContent className="p-6 space-y-4">
                                    <h3 className="font-semibold">Follow Us</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Stay updated with new arrivals and special offers.
                                    </p>
                                    <div className="flex gap-3">
                                        <a
                                            href="#"
                                            className="h-10 w-10 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                                            aria-label="Facebook"
                                        >
                                            <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5">
                                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                            </svg>

                                        </a>
                                        <a
                                            href="#"
                                            className="h-10 w-10 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                                            aria-label="Instagram"
                                        >
                                            <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5">
                                                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                                            </svg>

                                        </a>
                                        <a
                                            href="#"
                                            className="h-10 w-10 rounded-full bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors"
                                            aria-label="Twitter"
                                        >
                                            <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5">
                                                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                                                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                                            </svg>

                                        </a>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 🗺️ MAP SECTION (Optional) */}
            {/* <section className="py-12 md:py-16 bg-background">
                <div className="container px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl md:text-3xl font-bold mb-3">Find Us</h2>
                            <p className="text-muted-foreground">We&apos;re located in the heart of Nairobi</p>
                        </div>

                        <div className="aspect-video rounded-2xl overflow-hidden border bg-muted flex items-center justify-center">
                            <div className="text-center space-y-3">
                                <MapPin className="h-12 w-12 text-muted-foreground mx-auto" />
                                <p className="text-muted-foreground">
                                    Google Maps embed can be added here
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    (Replace with actual iframe from Google Maps)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
        </div>
    )
}