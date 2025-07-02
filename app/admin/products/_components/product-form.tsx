'use client'

import { useEffect, useState } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { DollarSign } from "lucide-react"
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
    SelectSeparator,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
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
            {pending ? t("admin.products.form.submitting") : t("admin.products.form.submit")}
        </Button>
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
    const [state, formAction] = useFormState(action, initialState)

    const initialImages = state.data?.images ?? product?.variants[0]?.images ?? []
    const [images, setImages] = useState<string[]>(initialImages as string[])

    const initialCategoryId = state.data?.categoryId ?? product?.categoryId.toString()
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(initialCategoryId as string | undefined)


    useEffect(() => {
        if (state.success) {
            const message = product
                ? "Product updated successfully."
                : t("admin.messages.productAdded")
            toast.success(message)
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
        }
    }, [state, onSuccess, t, product])

    return (
        <form action={formAction} className="space-y-4 py-4">
            <div>
                <Label htmlFor="name">{t("admin.products.form.labels.name")}</Label>
                <Input id="name" name="name" required defaultValue={state.data?.name ?? product?.name} />
                {state?.errors?.name && (
                    <p className="text-sm text-red-500 mt-1">{state.errors.name[0]}</p>
                )}
            </div>
            <div>
                <Label htmlFor="description">{t("admin.products.form.labels.description")}</Label>
                <Textarea id="description" name="description" defaultValue={state.data?.description ?? product?.description} />
                {state?.errors?.description && (
                    <p className="text-sm text-red-500 mt-1">{state.errors.description[0]}</p>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="price">{t("admin.products.form.labels.price")}</Label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="price"
                            name="price"
                            type="number"
                            step="0.01"
                            required
                            className="pl-8"
                            defaultValue={state.data?.price ?? product?.variants[0]?.price}
                        />
                    </div>
                    {state?.errors?.price && (
                        <p className="text-sm text-red-500 mt-1">{state.errors.price[0]}</p>
                    )}
                </div>
                <div>
                    <Label htmlFor="stock">{t("admin.products.form.labels.stock")}</Label>
                    <Input id="stock" name="stock" type="number" required defaultValue={state.data?.stock ?? product?.variants[0]?.stock} />
                    {state?.errors?.stock && (
                        <p className="text-sm text-red-500 mt-1">{state.errors.stock[0]}</p>
                    )}
                </div>
            </div>
            <div>
                <Label>{t("admin.products.form.labels.images")}</Label>
                <ImageUpload name="images" value={images} onChange={setImages} />
                {state?.errors?.images && (
                    <p className="text-sm text-red-500 mt-1">{state.errors.images[0]}</p>
                )}
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="categoryId">{t("admin.products.form.labels.category")}</Label>
                    <Select
                        name="categoryId"
                        value={selectedCategoryId}
                        onValueChange={setSelectedCategoryId}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={t("admin.products.form.placeholders.category")} />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((category) => (
                                <SelectItem key={category.id} value={String(category.id)}>
                                    {category.name}
                                </SelectItem>
                            ))}
                            <SelectSeparator />
                            <CategoryDialog />
                        </SelectContent>
                    </Select>
                    {state?.errors?.categoryId && (
                        <p className="text-sm text-red-500 mt-1">
                            {state.errors.categoryId[0]}
                        </p>
                    )}
                </div>
                <div>
                    <Label htmlFor="status">{t("admin.products.form.labels.status")}</Label>
                    <Select name="status" defaultValue={state.data?.status ?? product?.status ?? 'DRAFT'}>
                        <SelectTrigger>
                            <SelectValue placeholder={t("admin.products.form.placeholders.status")} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="DRAFT">{t("admin.productStatus.DRAFT")}</SelectItem>
                            <SelectItem value="PUBLISHED">{t("admin.productStatus.PUBLISHED")}</SelectItem>
                            <SelectItem value="ARCHIVED">{t("admin.productStatus.ARCHIVED")}</SelectItem>
                        </SelectContent>
                    </Select>
                    {state?.errors?.status && (
                        <p className="text-sm text-red-500 mt-1">{state.errors.status[0]}</p>
                    )}
                </div>
            </div>

            {/* Product flags */}
            <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="featured"
                        name="featured"
                        defaultChecked={state.data?.featured ?? product?.featured ?? false}
                    />
                    <Label htmlFor="featured" className="text-sm font-medium">
                        {t("admin.products.featured")}
                    </Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="newArrival"
                        name="newArrival"
                        defaultChecked={state.data?.newArrival ?? product?.newArrival ?? false}
                    />
                    <Label htmlFor="newArrival" className="text-sm font-medium">
                        {t("admin.products.newArrival")}
                    </Label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="sale"
                        name="sale"
                        defaultChecked={state.data?.sale ?? product?.sale ?? false}
                    />
                    <Label htmlFor="sale" className="text-sm font-medium">
                        {t("admin.products.sale")}
                    </Label>
                </div>
            </div>

            <SubmitButton disabled={!selectedCategoryId} />
        </form>
    )
} 