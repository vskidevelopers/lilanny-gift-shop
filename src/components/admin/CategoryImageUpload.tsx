/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useCallback } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Upload, X, Image as ImageIcon, Loader2, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
    onUploadComplete: (url: string) => void
    initialUrl?: string
}

export function CategoryImageUpload({ onUploadComplete, initialUrl }: Props) {
    const [uploadedUrl, setUploadedUrl] = useState<string>(initialUrl || "")
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string>(initialUrl || "")

    const handleFileSelect = useCallback(async (file: File) => {
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB")
            return
        }

        setUploading(true)

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${crypto.randomUUID()}.${fileExt}`

            // Create preview
            const objectUrl = URL.createObjectURL(file)
            setPreview(objectUrl)

            const { error: uploadError } = await supabase.storage
                .from('categories')
                .upload(fileName, file, { cacheControl: '3600', upsert: false })

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('categories')
                .getPublicUrl(fileName)

            setUploadedUrl(publicUrl)
            onUploadComplete(publicUrl)
            toast.success("Image uploaded successfully")
        } catch (err: any) {
            toast.error(err.message || "Upload failed")
            setPreview("")
        } finally {
            setUploading(false)
        }
    }, [onUploadComplete])

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFileSelect(file)
    }

    const removeImage = () => {
        setUploadedUrl("")
        setPreview("")
        onUploadComplete("")
        toast.info("Image removed")
    }

    return (
        <div className="space-y-3">
            {preview ? (
                <Card className="relative group overflow-hidden">
                    <img
                        src={preview}
                        alt="Category preview"
                        className="w-full h-48 object-cover"
                    />
                    <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </Card>
            ) : (
                <label className="block">
                    <div className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                        uploading ? "opacity-50 cursor-not-allowed" : "hover:border-primary/50"
                    )}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileInput}
                            disabled={uploading}
                            className="hidden"
                        />
                        {uploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                <p className="text-sm text-muted-foreground">Uploading...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Upload className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">Click to upload image</p>
                                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                                </div>
                            </div>
                        )}
                    </div>
                </label>
            )}
        </div>
    )
}