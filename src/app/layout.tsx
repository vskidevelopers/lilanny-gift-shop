import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree, Noto_Serif } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const notoSerifHeading = Noto_Serif({ subsets: ['latin'], variable: '--font-heading' });

const figtree = Figtree({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Li & Lanny Trends | Unique Kids Toys & Gifts",
  description: "Handpicked toys, gifts & accessories for kids and adults. Nairobi-based, Kenya-wide delivery.",
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", 'scroll-smooth', "antialiased", geistSans.variable, geistMono.variable, "font-sans", figtree.variable, notoSerifHeading.variable)}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}<Toaster position="top-right" richColors closeButton /></body>
    </html>
  );
}
