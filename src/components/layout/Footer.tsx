import Link from "next/link"
// import { Facebook, Instagram, Twitter, WhatsApp } from "lucide-react"

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg">Li & Lanny Trends</h3>
                        <p className="text-sm text-muted-foreground">
                            Unique toys & gifts for kids and adults. Handpicked with love, delivered with care.
                        </p>
                        <div className="flex gap-3">
                            <a href="#" className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                                {/* <Facebook className="h-4 w-4" /> */}
                            </a>
                            <a href="#" className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                                {/* <Instagram className="h-4 w-4" /> */}
                            </a>
                            <a href="#" className="p-2 rounded-full bg-muted hover:bg-muted/80 transition-colors">
                                {/* <WhatsApp className="h-4 w-4" /> */}
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-medium mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
                            <li><Link href="/shop?tag=trending" className="hover:text-primary transition-colors">Trending</Link></li>
                            <li><Link href="/shop?tag=new" className="hover:text-primary transition-colors">New Arrivals</Link></li>
                            <li><Link href="/shop?tag=sale" className="hover:text-primary transition-colors">Sale</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-medium mb-4">Support</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">About</Link></li>
                            <li><Link href="/track" className="hover:text-primary transition-colors">Track Order</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Shipping Info</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Returns</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-medium mb-4">Get in Touch</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Nairobi, Kenya</li>
                            <li>
                                <a href="tel:+254791242021" className="hover:text-primary transition-colors">0791 242 021</a>
                            </li>
                            <li>
                                <a href="mailto:hello@lilanny.com" className="hover:text-primary transition-colors">hello@lilanny.com</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Li & Lanny Trends. All rights reserved.
                </div>
            </div>
        </footer>
    )
}