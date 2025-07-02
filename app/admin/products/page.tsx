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
        <div className="flex flex-col gap-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">{t("admin.products.title")}</h1>
                <div className="ml-auto flex items-center gap-2">
                    <AddProductSheet categories={categories} />
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{t("admin.products.cardTitle")}</CardTitle>
                    <CardDescription>
                        {t("admin.products.cardDescription")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductsTable products={products} />
                </CardContent>
            </Card>
        </div>
    )
} 