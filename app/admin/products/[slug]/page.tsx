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
            <Card>
                <CardHeader>
                    <CardTitle>Edit Product</CardTitle>
                    <CardDescription>
                        Update the details for &quot;{product.name}&quot;.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProductForm product={product} categories={categories} />
                </CardContent>
            </Card>
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