import { notFound } from "next/navigation"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getCategories, getProductBySlug } from "../_components/actions"
import { ProductForm } from "../_components/product-form"

export default async function ProductEditPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

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
                <div className="flex flex-col gap-2 px-4 sm:px-0">
                    <h1 className="text-lg font-semibold sm:text-xl lg:text-2xl">Edit Product</h1>
                    <p className="text-sm text-muted-foreground">
                        Update the details for &quot;{product.name}&quot;.
                    </p>
                </div>

                <Card className="sm:mx-0 sm:rounded-lg sm:border">
                    <CardHeader className="pb-4 px-4 sm:px-6">
                        <CardTitle className="text-base sm:text-lg">Product Details</CardTitle>
                        <CardDescription>
                            Make changes to the product information below.
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
        return notFound()
    }
}

// Add generateStaticParams to prevent build-time errors
export async function generateStaticParams() {
    // Return empty array to prevent static generation during build
    // This route will be dynamically generated at request time
    return []
} 