"use client"
import { useState } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface Props {
    images: string[]
    productName: string
}

export function ProductGallery({ images, productName }: Props) {
    const [selectedImage, setSelectedImage] = useState(images[0] || "/placeholder.jpg")
    const { scrollY } = useScroll()

    // Parallax: Image moves slower than scroll on desktop
    const y = useTransform(scrollY, [0, 500], [0, 100])
    const opacity = useTransform(scrollY, [0, 400], [1, 0.8])

    // Fallback if no images
    const displayImages = images.length > 0 ? images : ["/placeholder.jpg"]

    return (
        <div className="space-y-4">
            {/* Main Image with Parallax */}
            <motion.div
                style={{ y, opacity }}
                className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted"
            >
                <Image
                    src={selectedImage}
                    alt={productName}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                />
            </motion.div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {displayImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImage(img)}
                            className={cn(
                                "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                                selectedImage === img ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                            )}
                        >
                            <Image
                                src={img}
                                alt={`${productName} thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}