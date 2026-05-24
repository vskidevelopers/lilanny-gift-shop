/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone" // npm i react-dropzone
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
    onUploadComplete: (urls: string[]) => void
    initialUrls?: string[]
    maxFiles?: number
}

export function ImageUploader({ onUploadComplete, initialUrls = [], maxFiles = 5 }: Props) {
    const [uploadedUrls, setUploadedUrls] = useState<string[]>(initialUrls)
    const [uploading, setUploading] = useState(false)


    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setUploading(true)
        const newUrls: string[] = []

        for (const file of acceptedFiles) {
            if (uploadedUrls.length + newUrls.length >= maxFiles) {
                toast.error(`Max ${maxFiles} images allowed`)
                break
            }

            try {
                const fileExt = file.name.split('.').pop()
                const fileName = `${crypto.randomUUID()}.${fileExt}`
                const filePath = fileName

                const { error: uploadError, data } = await supabase.storage
                    .from('products')
                    .upload(filePath, file, { cacheControl: '3600', upsert: false })

                if (uploadError) throw uploadError

                const { data: { publicUrl } } = supabase.storage
                    .from('products')
                    .getPublicUrl(filePath)

                newUrls.push(publicUrl)
                toast.success(`Uploaded: ${file.name}`)
            } catch (err: any) {
                toast.error(err.message || "Upload failed")
                console.error("Upload error for file", file.name, ">>>", err)
            }
        }

        const allUrls = [...uploadedUrls, ...newUrls]
        setUploadedUrls(allUrls)
        onUploadComplete(allUrls)
        setUploading(false)
    }, [uploadedUrls, onUploadComplete, maxFiles, supabase.storage])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
        maxSize: 5 * 1024 * 1024, // 5MB
        disabled: uploading || uploadedUrls.length >= maxFiles
    })

    const removeImage = (url: string) => {
        setUploadedUrls(prev => prev.filter(u => u !== url))
        onUploadComplete(uploadedUrls.filter(u => u !== url))
        toast.info("Image removed")
    }

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={cn(
                    "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                    isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50",
                    (uploading || uploadedUrls.length >= maxFiles) && "opacity-50 cursor-not-allowed"
                )}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Uploading...</p>
                    </div>
                ) : isDragActive ? (
                    <p className="text-sm text-primary font-medium">Drop images here...</p>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">Click or drag</span> to upload images
                        </p>
                        <p className="text-xs text-muted-foreground">PNG, JPG, WebP up to 5MB • Max {maxFiles}</p>
                    </div>
                )}
            </div>

            {uploadedUrls.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {uploadedUrls.map((url) => (
                        <Card key={url} className="relative group overflow-hidden">
                            <img
                                src={url}
                                alt="Uploaded"
                                className="w-full h-24 object-cover rounded-md"
                                loading="lazy"
                            />
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); removeImage(url) }}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}