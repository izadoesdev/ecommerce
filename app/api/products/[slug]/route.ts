import { NextResponse } from "next/server"
import db from "@/lib/db"
import type { Prisma } from "@/lib/generated/prisma"

type ProductWithRelations = Prisma.ProductGetPayload<{ include: { category: true; variants: true } }>

export async function GET({ params }: { params: Promise<{ slug: string }> }) {
    try {
        const { slug } = await params
        const product: ProductWithRelations | null = await db.product.findFirst({
            where: { slug, status: "PUBLISHED" },
            include: {
                category: true,
                variants: true,
            },
        })
        if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
        return NextResponse.json(product)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
    }
} 