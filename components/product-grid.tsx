"use client"

import { memo } from "react"
import { ProductCard } from "@/components/product-card"
import type { ProductWithRelations } from "@/lib/products"

interface ProductGridProps {
  products: ProductWithRelations[]
}

export const ProductGrid = memo(function ProductGrid({ products }: ProductGridProps) {
  // If no products are provided, render a message instead of an empty grid.
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">No products found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  )
})

