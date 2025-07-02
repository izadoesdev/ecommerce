import { NextResponse } from "next/server"
import db from "@/lib/db"

export async function GET() {
    try {
        const products = await db.product.findMany({
            where: { status: "PUBLISHED" },
            include: {
                category: true,
                variants: true,
            },
            orderBy: { createdAt: "desc" },
        })
        // Optionally, filter out sensitive fields here
        return NextResponse.json(products)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }
} 