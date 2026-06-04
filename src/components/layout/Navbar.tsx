"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Menu, Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useCartStore } from "@/lib/store"
import { CartDrawer } from "@/components/shop/CartDrawer"

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    { label: "Track Order", href: "/track" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
]

export function Navbar() {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    // Cart state
    const { items, toggleCart } = useCartStore()
    const itemCount = items.reduce((acc, item) => acc + item.quantity, 0)

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span className="text-foreground">Li & Lanny</span>
                        <span className="text-muted-foreground font-normal">Trends</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary relative py-1",
                                    pathname === link.href ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                {link.label}
                                {pathname === link.href && (
                                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-1 sm:gap-2">
                        <Button variant="ghost" size="icon" className="hidden sm:flex rounded-full">
                            <Search className="h-4 w-4" />
                        </Button>

                        {/* Cart Trigger */}
                        <button
                            onClick={toggleCart}
                            className="relative p-2 rounded-full hover:bg-accent transition-colors"
                            aria-label="Open cart"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {itemCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center animate-in zoom-in duration-200">
                                    {itemCount}
                                </span>
                            )}
                        </button>

                        {/* Mobile Menu Trigger */}
                        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>

                            {/* Polished Mobile Menu */}
                            <SheetContent side="right" className="w-[85vw] sm:max-w-md p-0 flex flex-col">
                                <SheetHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
                                    <SheetTitle className="text-lg font-bold flex items-center gap-2">
                                        <Sparkles className="h-4 w-4 text-primary" />
                                        Menu
                                    </SheetTitle>
                                </SheetHeader>

                                <nav className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            onClick={() => setMobileOpen(false)}
                                            className={cn(
                                                "flex items-center justify-between px-4 py-4 rounded-xl text-base font-medium transition-all",
                                                pathname === link.href
                                                    ? "bg-primary/10 text-primary"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            )}
                                        >
                                            {link.label}
                                            {pathname === link.href && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                                        </Link>
                                    ))}
                                </nav>

                                {/* Mobile Footer */}
                                <div className="p-6 border-t bg-muted/30 space-y-3">
                                    <p className="text-xs text-center text-muted-foreground mb-2">
                                        Need help finding the perfect gift?
                                    </p>
                                    <Button className="w-full" size="lg" asChild>
                                        <Link href="/contact" onClick={() => setMobileOpen(false)}>
                                            Contact Us
                                        </Link>
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            {/* Cart Drawer (Mounted at root level of Navbar) */}
            <CartDrawer />
        </>
    )
}