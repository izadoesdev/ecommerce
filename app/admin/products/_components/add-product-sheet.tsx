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
import { useTranslation } from "@/lib/i18n/client"
import type { getCategories } from "./actions"
import { ProductForm } from "./product-form"

type Categories = Awaited<ReturnType<typeof getCategories>>

export function AddProductSheet({ categories }: { categories: Categories }) {
    const [open, setOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button size="sm" className="h-8 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        {t("admin.products.add")}
                    </span>
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{t("admin.products.form.sheetTitle")}</SheetTitle>
                    <SheetDescription>
                        {t("admin.products.form.sheetDescription")}
                    </SheetDescription>
                </SheetHeader>
                <ProductForm categories={categories} onSuccess={() => setOpen(false)} />
            </SheetContent>
        </Sheet>
    )
} 