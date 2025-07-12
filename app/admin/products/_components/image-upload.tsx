'use client'

import { UploadCloud, X } from "lucide-react"
import Image from "next/image"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ImageUploadProps {
    name: string
    value: string[]
    onChange: (value: string[]) => void
}

export function ImageUpload({ name, value, onChange }: ImageUploadProps) {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            // This is a mock upload. Replace with your actual upload logic.
            const newImageUrls = acceptedFiles.map((file) => URL.createObjectURL(file))
            onChange([...value, ...newImageUrls])
        },
        [value, onChange]
    )

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
    })

    const removeImage = (urlToRemove: string) => {
        onChange(value.filter((url) => url !== urlToRemove))
    }

    return (
        <div>
            {value.map((url, index) => (
                <input key={`${name}-${index}-${url}`} type="hidden" name={`${name}[]`} value={url} />
            ))}
            <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-md p-4 sm:p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
            >
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                    Drag & drop files here, or click to select files
                </p>
            </div>
            {value.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {value.map((url, index) => (
                        <div key={`${name}-image-${index}-${url}`} className="relative aspect-square">
                            <Image
                                src={url}
                                alt="Product image"
                                fill
                                className="object-cover rounded-md"
                            />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6"
                                onClick={() => removeImage(url)}
                            >
                                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
} 