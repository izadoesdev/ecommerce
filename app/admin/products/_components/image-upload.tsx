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
            {value.map((url) => (
                <input key={url} type="hidden" name={`${name}[]`} value={url} />
            ))}
            <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer"
            >
                <input {...getInputProps()} />
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">
                    Drag & drop files here, or click to select files
                </p>
            </div>
            {value.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                    {value.map((url) => (
                        <div key={url} className="relative">
                            <Image
                                src={url}
                                alt="Product image"
                                width={100}
                                height={100}
                                className="w-full h-full object-cover rounded-md"
                            />
                            <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6"
                                onClick={() => removeImage(url)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
} 