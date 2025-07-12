'use client'

import { useEffect, useState, useActionState } from "react"
import { useFormStatus } from "react-dom"
import { AlertCircle, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { useTranslation } from "@/lib/i18n/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { addProduct, updateProduct } from "./actions"
import type { getCategories, getProductBySlug } from "./actions"
import { CategoryDialog } from "./category-dialog"
import { ImageUpload } from "./image-upload"
import { Checkbox } from "@/components/ui/checkbox"

type FormState = {
    message: string,
    errors?: {
        name?: string[],
        description?: string[],
        categoryId?: string[],
        price?: string[],
        stock?: string[],
        images?: string[],
        status?: string[],
    },
    success: boolean,
    data?: {
        [key: string]: any
    }
}

const initialState: FormState = {
    message: "",
    errors: {},
    success: false,
    data: {}
}

function SubmitButton({ disabled }: { disabled?: boolean }) {
    const { t } = useTranslation()
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending || disabled} className="w-full">
            {pending ? (
                <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {t("admin.products.form.submitting")}
                </>
            ) : (
                t("admin.products.form.submit")
            )}
        </Button>
    )
}

function PriceInput({
    value,
    onChange,
    error
}: {
    value: string
    onChange: (value: string) => void
    error?: string
}) {
    const [displayValue, setDisplayValue] = useState(value)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.replace(/[^\d.]/g, '')
        setDisplayValue(input)
        const numValue = parseFloat(input) || 0
        onChange(numValue.toString())
    }

    const handleBlur = () => {
        const numValue = parseFloat(displayValue) || 0
        setDisplayValue(numValue.toFixed(2))
    }

    return (
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                ₪
            </span>
            <Input
                type="text"
                value={displayValue}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="0.00"
                className={`pl-8 ${error ? "border-red-500" : ""}`}
            />
        </div>
    )
}

export function ProductForm({
    product,
    categories,
    onSuccess,
}: {
    product?: NonNullable<Awaited<ReturnType<typeof getProductBySlug>>>,
    categories: Awaited<ReturnType<typeof getCategories>>
    onSuccess?: () => void
}) {
    const { t } = useTranslation()
    const action = product ? updateProduct.bind(null, product.id) : addProduct
    const [state, formAction] = useActionState(action, initialState)

    const initialImages = state.data?.images ?? product?.variants[0]?.images ?? []
    const [images, setImages] = useState<string[]>(initialImages as string[])

    const initialCategoryId = state.data?.categoryId ?? product?.categoryId.toString()
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(initialCategoryId as string | undefined)

    const [showSuccess, setShowSuccess] = useState(false)
    const [price, setPrice] = useState(state.data?.price ?? product?.variants[0]?.price?.toString() ?? "")
    const [stock, setStock] = useState(state.data?.stock ?? product?.variants[0]?.stock?.toString() ?? "")

    useEffect(() => {
        if (state.success) {
            const message = product
                ? t("admin.messages.productUpdated")
                : t("admin.messages.productAdded")
            toast.success(message)
            setShowSuccess(true)
            if (onSuccess) {
                onSuccess()
            }
        } else if (state.message) {
            toast.error(state.message)
            if (state.data?.images) {
                const newImages = Array.isArray(state.data.images) ? state.data.images : [state.data.images]
                setImages(newImages as string[])
            }
            if (state.data?.categoryId) {
                setSelectedCategoryId(state.data.categoryId as string);
            }
            if (state.data?.price) {
                setPrice(state.data.price.toString())
            }
            if (state.data?.stock) {
                setStock(state.data.stock.toString())
            }
        }
    }, [state, onSuccess, t, product])

    const hasErrors = state.errors && Object.keys(state.errors).length > 0
    const isFormValid = images.length > 0 && selectedCategoryId && price && stock

    return (
        <form action={formAction} className="space-y-6 py-4">
            {showSuccess && (
                <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                        {product ? t("admin.messages.productUpdated") : t("admin.messages.productAdded")}
                    </AlertDescription>
                </Alert>
            )}

            {hasErrors && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Please fix the errors below.
                    </AlertDescription>
                </Alert>
            )}

            {/* Images */}
            <div className="space-y-2">
                <Label>
                    Images *
                    {state?.errors?.images?.[0] && (
                        <span className="text-red-500 ml-1">{state.errors.images[0]}</span>
                    )}
                </Label>
                <ImageUpload name="images" value={images} onChange={setImages} />
            </div>

            {/* Name */}
            <div className="space-y-2">
                <Label>
                    Product Name *
                    {state?.errors?.name?.[0] && (
                        <span className="text-red-500 ml-1">{state.errors.name[0]}</span>
                    )}
                </Label>
                <Input
                    name="name"
                    required
                    defaultValue={state.data?.name ?? product?.name}
                    className={state?.errors?.name ? "border-red-500" : ""}
                    placeholder="e.g., Coffee Mug"
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label>
                    Description
                    {state?.errors?.description?.[0] && (
                        <span className="text-red-500 ml-1">{state.errors.description[0]}</span>
                    )}
                </Label>
                <Textarea
                    name="description"
                    defaultValue={state.data?.description ?? product?.description}
                    className={state?.errors?.description ? "border-red-500" : ""}
                    rows={3}
                    placeholder="Describe your product..."
                />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>
                        Price (₪) *
                        {state?.errors?.price?.[0] && (
                            <span className="text-red-500 ml-1">{state.errors.price[0]}</span>
                        )}
                    </Label>
                    <PriceInput
                        value={price}
                        onChange={setPrice}
                        error={state?.errors?.price?.[0]}
                    />
                    <input type="hidden" name="price" value={price} />
                </div>

                <div className="space-y-2">
                    <Label>
                        Stock *
                        {state?.errors?.stock?.[0] && (
                            <span className="text-red-500 ml-1">{state.errors.stock[0]}</span>
                        )}
                    </Label>
                    <Input
                        type="number"
                        name="stock"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        placeholder="0"
                        className={state?.errors?.stock ? "border-red-500" : ""}
                        min="0"
                    />
                </div>
            </div>

            {/* Category and Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>
                        Category *
                        {state?.errors?.categoryId?.[0] && (
                            <span className="text-red-500 ml-1">{state.errors.categoryId[0]}</span>
                        )}
                    </Label>
                    <Select
                        name="categoryId"
                        value={selectedCategoryId}
                        onValueChange={setSelectedCategoryId}
                    >
                        <SelectTrigger className={state?.errors?.categoryId ? "border-red-500" : ""}>
                            <SelectValue placeholder="Choose category..." />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={String(category.id)}>
                                    {category.name}
                                </SelectItem>
                            ))}
                            <CategoryDialog />
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>
                        Status
                        {state?.errors?.status?.[0] && (
                            <span className="text-red-500 ml-1">{state.errors.status[0]}</span>
                        )}
                    </Label>
                    <Select name="status" defaultValue={state.data?.status ?? product?.status ?? 'DRAFT'}>
                        <SelectTrigger className={state?.errors?.status ? "border-red-500" : ""}>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DRAFT">Draft (not visible)</SelectItem>
                            <SelectItem value="PUBLISHED">Published (visible)</SelectItem>
                            <SelectItem value="ARCHIVED">Archived (hidden)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Product Features */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Features</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="featured"
                            name="featured"
                            defaultChecked={state.data?.featured ?? product?.featured}
                        />
                        <Label htmlFor="featured" className="text-sm">Featured</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="newArrival"
                            name="newArrival"
                            defaultChecked={state.data?.newArrival ?? product?.newArrival}
                        />
                        <Label htmlFor="newArrival" className="text-sm">New Arrival</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="sale"
                            name="sale"
                            defaultChecked={state.data?.sale ?? product?.sale}
                        />
                        <Label htmlFor="sale" className="text-sm">On Sale</Label>
                    </div>
                </div>
            </div>

            <SubmitButton disabled={!isFormValid} />
        </form>
    )
} 