'use client'

import { useState } from "react"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { ProductForm } from "./product-form"
import { useTranslation } from "@/lib/i18n/client"
import type { getCategories } from "./actions"

type Categories = Awaited<ReturnType<typeof getCategories>>

export function AddProductSheet({ categories }: { categories: Categories }) {
    const [open, setOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="sm" className="h-8 gap-1 w-full sm:w-auto">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">
                        {t("admin.products.add")}
                    </span>
                    <span className="sm:hidden">Add Product</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto w-full sm:max-w-2xl">
                <SheetHeader>
                    <SheetTitle>Add New Product</SheetTitle>
                    <SheetDescription>
                        Fill in the details below to add a new product.
                    </SheetDescription>
                </SheetHeader>

                <div className="mt-6">
                    <ProductForm
                        categories={categories}
                        onSuccess={() => setOpen(false)}
                    />
                </div>
            </SheetContent>
        </Sheet>
    )
} 