import { getCategories, getProducts } from "./_components/actions"
import { AddProductSheet } from "./_components/add-product-sheet"
import { ProductsTable } from "./_components/products-table"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useTranslation } from "@/lib/i18n"

export default async function ProductsPage() {
    const { t } = await useTranslation()
    const products = await getProducts()
    const categories = await getCategories()

    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            {/* Mobile Responsive Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center px-4 sm:px-0">
                <h1 className="text-lg font-semibold sm:text-xl lg:text-2xl">{t("admin.products.title")}</h1>
                <div className="flex items-center gap-2 sm:ml-auto">
                    <AddProductSheet categories={categories} />
                </div>
            </div>

            {/* Products Table Card - Full screen on mobile */}
            <Card className="sm:mx-0 sm:rounded-lg sm:border">
                <CardHeader className="px-4 sm:px-6">
                    <CardTitle>{t("admin.products.cardTitle")}</CardTitle>
                    <CardDescription>
                        {t("admin.products.cardDescription")}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <ProductsTable products={products} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
} 