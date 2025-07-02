'use server'

import { revalidatePath } from "next/cache"
import { z } from "zod"
import db from "@/lib/db"

const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().optional(),
    categoryId: z.coerce.number({ invalid_type_error: "Category is required" }),
    price: z.coerce.number().min(0, "Price must be a positive number"),
    stock: z.coerce.number().min(0, "Stock must be a positive number"),
    images: z.array(z.string()).min(1, "At least one image is required"),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
    featured: z.boolean().optional(),
    newArrival: z.boolean().optional(),
    sale: z.boolean().optional(),
})

const categorySchema = z.object({
    name: z.string().min(1, "Category name is required"),
    description: z.string().optional(),
    image: z.string().url({ message: "A valid image URL is required" }),
})

export async function getProducts() {
    try {
        return await db.product.findMany({
            include: {
                category: true,
                variants: true,
            },
            orderBy: { createdAt: "desc" },
        })
    } catch (error) {
        console.error("Failed to fetch products:", error)
        return []
    }
}

export async function getCategories() {
    try {
        return await db.category.findMany({
            orderBy: { name: "asc" },
        })
    } catch (error) {
        console.error("Failed to fetch categories:", error)
        return []
    }
}

export async function getProductBySlug(slug: string) {
    try {
        return await db.product.findUnique({
            where: { slug },
            include: {
                category: true,
                variants: true,
            },
        })
    } catch (error) {
        console.error("Failed to fetch product:", error)
        return null
    }
}

export async function addProduct(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries())
    const rawImages = formData.getAll("images[]")

    // Convert checkbox values to booleans
    const processedData = {
        ...rawData,
        images: rawImages,
        featured: formData.has("featured"),
        newArrival: formData.has("newArrival"),
        sale: formData.has("sale"),
    }

    const validatedFields = productSchema.safeParse(processedData)

    if (!validatedFields.success) {
        return {
            message: "Invalid form data.",
            errors: validatedFields.error.flatten().fieldErrors,
            success: false,
            data: rawData
        }
    }

    const { name, description, categoryId, price, stock, images, status, featured, newArrival, sale } =
        validatedFields.data

    try {
        await db.product.create({
            data: {
                name,
                slug: name.toLowerCase().replace(/\s+/g, "-"),
                description: description ?? "",
                categoryId,
                status,
                featured: featured ?? false,
                newArrival: newArrival ?? false,
                sale: sale ?? false,
                variants: {
                    create: [
                        {
                            price,
                            stock,
                            images: images,
                            options: {},
                        },
                    ],
                },
            },
        })

        revalidatePath("/admin/products")
        return { success: true, message: "Product added successfully." }
    } catch (error) {
        console.error("Failed to create product:", error)
        return { message: "Failed to create product.", success: false, data: rawData }
    }
}

export async function updateProduct(id: number, prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries())
    const rawImages = formData.getAll("images[]")

    // Convert checkbox values to booleans
    const processedData = {
        ...rawData,
        images: rawImages,
        featured: formData.has("featured"),
        newArrival: formData.has("newArrival"),
        sale: formData.has("sale"),
    }

    const validatedFields = productSchema.safeParse(processedData)

    if (!validatedFields.success) {
        return {
            message: "Invalid form data.",
            errors: validatedFields.error.flatten().fieldErrors,
            success: false,
            data: rawData
        }
    }

    const { name, description, categoryId, price, stock, images, status, featured, newArrival, sale } =
        validatedFields.data

    try {
        await db.product.update({
            where: { id },
            data: {
                name,
                slug: name.toLowerCase().replace(/\s+/g, "-"),
                description: description ?? "",
                categoryId,
                status,
                featured: featured ?? false,
                newArrival: newArrival ?? false,
                sale: sale ?? false,
                variants: {
                    // This assumes a single variant per product for now.
                    // A more robust solution would handle multiple variants.
                    updateMany: {
                        where: { productId: id },
                        data: {
                            price,
                            stock,
                            images,
                        }
                    }
                },
            },
        })

        revalidatePath(`/admin/products`)
        revalidatePath(`/admin/products/${name.toLowerCase().replace(/\s+/g, "-")}`)
        return { success: true, message: "Product updated successfully." }
    } catch (error) {
        console.error("Failed to update product:", error)
        return { message: "Failed to update product.", success: false, data: rawData }
    }
}

export async function addCategory(prevState: any, formData: FormData) {
    const rawData = Object.fromEntries(formData.entries())
    const validatedFields = categorySchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            message: "Invalid form data.",
            errors: validatedFields.error.flatten().fieldErrors,
            success: false,
            data: rawData
        }
    }

    const { name, description, image } = validatedFields.data

    try {
        await db.category.create({
            data: {
                name,
                slug: name.toLowerCase().replace(/\s+/g, "-"),
                description,
                image,
            },
        })

        revalidatePath("/admin/products")
        return { success: true, message: "Category added successfully." }
    } catch (error) {
        return { message: "Failed to add category.", success: false, data: rawData }
    }
}

export async function deleteProduct(id: number) {
    try {
        await db.product.delete({
            where: { id },
        })
        revalidatePath("/admin/products")
        return { success: "Product deleted successfully." }
    } catch (error) {
        console.error("Failed to delete product:", error)
        return { error: "An unexpected error occurred." }
    }
}

export async function deleteProducts(ids: number[]) {
    try {
        await db.product.deleteMany({
            where: {
                id: { in: ids },
            },
        })
        revalidatePath("/admin/products")
        return { success: "Products deleted successfully." }
    } catch (error) {
        console.error("Failed to delete products:", error)
        return { error: "An unexpected error occurred." }
    }
} 