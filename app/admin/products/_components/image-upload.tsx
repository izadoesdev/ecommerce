'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { X, Upload, ImageIcon } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

interface ImageUploadProps {
    name: string
    value: string[]
    onChange: (value: string[]) => void
}

export function ImageUpload({ name, value, onChange }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setIsUploading(true)
        setError(null)

        try {
            const newImages: string[] = []

            for (const file of acceptedFiles) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    throw new Error('Only image files are allowed')
                }

                // Validate file size (5MB limit)
                if (file.size > 5 * 1024 * 1024) {
                    throw new Error('File size must be less than 5MB')
                }

                // Convert to base64 for demo purposes
                // In production, you would upload to a CDN or storage service
                const reader = new FileReader()
                const imageUrl = await new Promise<string>((resolve, reject) => {
                    reader.onload = () => resolve(reader.result as string)
                    reader.onerror = reject
                    reader.readAsDataURL(file)
                })

                newImages.push(imageUrl)
            }

            onChange([...value, ...newImages])
            toast.success(`${acceptedFiles.length} image(s) uploaded successfully`)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to upload images'
            setError(message)
            toast.error(message)
        } finally {
            setIsUploading(false)
        }
    }, [value, onChange])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
        },
        multiple: true,
        disabled: isUploading
    })

    const removeImage = (urlToRemove: string) => {
        onChange(value.filter(url => url !== urlToRemove))
    }

    const addImageUrl = (url: string) => {
        if (url && !value.includes(url)) {
            onChange([...value, url])
            toast.success('Image URL added successfully')
        }
    }

    return (
        <div className="space-y-4">
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`
                    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'}
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}
                `}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                    {isUploading ? (
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                        <Upload className="h-8 w-8 text-muted-foreground" />
                    )}
                    <div>
                        <p className="text-sm font-medium">
                            {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            or click to browse (max 5MB per image)
                        </p>
                    </div>
                </div>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
                <Label htmlFor="image-url" className="text-sm font-medium">
                    Or add image URL
                </Label>
                <div className="flex gap-2">
                    <Input
                        id="image-url"
                        placeholder="https://example.com/image.jpg"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault()
                                const input = e.target as HTMLInputElement
                                addImageUrl(input.value)
                                input.value = ''
                            }
                        }}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement
                            addImageUrl(input.value)
                            input.value = ''
                        }}
                    >
                        Add
                    </Button>
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Image Grid */}
            {value.length > 0 && (
                <div className="space-y-3">
                    <Label className="text-sm font-medium">Uploaded Images ({value.length})</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                        {value.map((url, index) => (
                            <div key={`${name}-image-${index}-${url}`} className="relative aspect-square group">
                                <Image
                                    src={url}
                                    alt={`Product image ${index + 1}`}
                                    fill
                                    className="object-cover rounded-md transition-transform group-hover:scale-105"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />
                                <Button
                                    variant="destructive"
                                    size="icon"
                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removeImage(url)}
                                >
                                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-md" />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {value.length === 0 && !isDragActive && !isUploading && (
                <div className="text-center py-8 text-muted-foreground">
                    <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No images uploaded yet</p>
                    <p className="text-xs">Upload at least one image to continue</p>
                </div>
            )}
        </div>
    )
} 