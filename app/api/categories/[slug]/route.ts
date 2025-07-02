import { NextResponse } from "next/server"
import db from "@/lib/db"
import type { Prisma } from "@/lib/generated/prisma"

type CategoryWithProducts = Prisma.CategoryGetPayload<{ include: { products: { include: { variants: true } } } }>

export async function GET(req: Request, { params }: { params: { slug: string } }) {
    try {
        const category: CategoryWithProducts | null = await db.category.findFirst({
            where: { slug: params.slug },
            include: {
                products: {
                    where: { status: "PUBLISHED" },
                    include: { variants: true },
                },
            },
        })
        if (!category) return NextResponse.json({ error: "Not found" }, { status: 404 })
        return NextResponse.json(category)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
    }
} 