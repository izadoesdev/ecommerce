import { notFound } from "next/navigation"
import { Suspense } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getCategories, getProductBySlug } from "../_components/actions"
import { ProductForm } from "../_components/product-form"
import { useTranslation } from "@/lib/i18n"

function ProductEditSkeleton() {
    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            <div className="flex flex-col gap-2 px-4 sm:px-0">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-96" />
            </div>
            <Card className="sm:mx-0 sm:rounded-lg sm:border">
                <CardHeader className="pb-4 px-4 sm:px-6">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-32 w-full" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

async function ProductEditContent({
    slug,
}: {
    slug: string
}) {
    const { t } = await useTranslation()

    if (!slug || typeof slug !== 'string') {
        return notFound()
    }

    try {
        const [product, categories] = await Promise.all([
            getProductBySlug(slug),
            getCategories(),
        ])

        if (!product) {
            return notFound()
        }

        return (
            <div className="flex flex-col gap-4 sm:gap-6">
                {/* Header with Back Button */}
                <div className="flex flex-col gap-2 px-4 sm:px-0">
                    <div className="flex items-center gap-2 mb-2">
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/admin/products">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Products
                            </Link>
                        </Button>
                    </div>
                    <h1 className="text-lg font-semibold sm:text-xl lg:text-2xl">
                        Edit Product
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Update the details for &quot;{product.name}&quot;.
                    </p>
                </div>

                {/* Product Form Card */}
                <Card className="sm:mx-0 sm:rounded-lg sm:border">
                    <CardHeader className="pb-4 px-4 sm:px-6">
                        <CardTitle className="text-base sm:text-lg">
                            Product Details
                        </CardTitle>
                        <CardDescription>
                            Make changes to the product information below. All changes will be saved automatically.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        <ProductForm product={product} categories={categories} />
                    </CardContent>
                </Card>
            </div>
        )
    } catch (error) {
        console.error("Error loading product:", error)
        return (
            <div className="flex flex-col gap-4 sm:gap-6">
                <div className="flex flex-col gap-2 px-4 sm:px-0">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/products">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Products
                        </Link>
                    </Button>
                    <h1 className="text-lg font-semibold sm:text-xl lg:text-2xl">
                        Edit Product
                    </h1>
                </div>

                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        Failed to load product details. Please try refreshing the page or contact support if the problem persists.
                    </AlertDescription>
                </Alert>
            </div>
        )
    }
}

export default async function ProductEditPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params
    return (
        <Suspense fallback={<ProductEditSkeleton />}>
            <ProductEditContent slug={slug} />
        </Suspense>
    )
}

// Add generateStaticParams to prevent build-time errors
export async function generateStaticParams() {
    // Return empty array to prevent static generation during build
    // This route will be dynamically generated at request time
    return []
} 