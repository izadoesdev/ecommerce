import { Suspense } from "react"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { useTranslation } from "@/lib/i18n"

function ProductsTableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-8 w-24" />
            </div>
            <div className="rounded-md border">
                <div className="p-4">
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-4">
                                <Skeleton className="h-4 w-4" />
                                <Skeleton className="h-10 w-10 rounded" />
                                <div className="space-y-2 flex-1">
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-3 w-1/2" />
                                </div>
                                <Skeleton className="h-8 w-8" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

async function ProductsContent() {
    const { t } = await useTranslation()

    try {
        const [products, categories] = await Promise.all([
            getProducts(),
            getCategories(),
        ])

        return (
            <div className="flex flex-col gap-4 sm:gap-6">
                {/* Mobile Responsive Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center px-4 sm:px-0">
                    <h1 className="text-lg font-semibold sm:text-xl lg:text-2xl">
                        {t("admin.products.title")}
                    </h1>
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
    } catch (error) {
        console.error("Error loading products:", error)
        return (
            <div className="flex flex-col gap-4 sm:gap-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center px-4 sm:px-0">
                    <h1 className="text-lg font-semibold sm:text-xl lg:text-2xl">
                        {t("admin.products.title")}
                    </h1>
                </div>

                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load products. Please try refreshing the page or contact support if the problem persists.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<ProductsTableSkeleton />}>
            <ProductsContent />
        </Suspense>
    )
} 