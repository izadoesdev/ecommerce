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
} 