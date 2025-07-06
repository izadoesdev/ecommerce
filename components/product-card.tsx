"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"
import { useTranslation } from "@/lib/i18n/client"
import type { ProductWithRelations } from "@/lib/products"
import { CustomContextMenu } from "@/components/custom-context-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ProductCardProps {
  product: ProductWithRelations
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const { addToCart, isInCart } = useCart()
  const [isHovered, setIsHovered] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const productInCart = isInCart(product.id)

  // Use the first variant as the main variant
  const variant = product.variants[0]
  const price = variant?.salePrice ?? variant?.price ?? 0
  const originalPrice = variant?.price ?? 0
  const image = variant?.images?.[0] || "/placeholder.svg"
  const stock = variant?.stock ?? 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
  }

  const handleQuickView = () => {
    setShowQuickView(true)
  }

  return (
    <div className="group h-full">
      <CustomContextMenu
        product={product}
        onQuickView={handleQuickView}
        className="h-full"
      >
        <div
          key={product.id}
          className="relative h-full flex flex-col bg-white dark:bg-card rounded-lg shadow-sm border border-border overflow-hidden product-card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Link href={`/product/${product.slug}`} className="flex flex-col h-full">
            {/* Image container */}
            <div className="relative overflow-hidden bg-accent aspect-square">
              {/* Sale badge - top left */}
              {product.sale && (
                <Badge className="absolute top-2 left-2 z-10 bg-green-500 text-white font-medium px-2 py-1 text-xs rounded">
                  -15%
                </Badge>
              )}

              {/* Heart icon - top right */}
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 z-10 rounded-full w-8 h-8 p-0 bg-white/80 hover:bg-white text-foreground hover:text-red-500 transition-colors shadow-sm"
                title={t("product.wishlist")}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>

              {/* Product image with loading state */}
              <div className="w-full h-full">
                {!isImageLoaded && <div className="absolute inset-0 bg-accent animate-pulse" />}
                <img
                  src={image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  onLoad={() => setIsImageLoaded(true)}
                  style={{ opacity: isImageLoaded ? 1 : 0 }}
                />
              </div>
            </div>

            {/* Product details */}
            <div className="flex-1 flex flex-col p-3">
              <div className="text-xs text-muted-foreground mb-1">{product.category?.name}</div>
              <h3 className="font-medium text-sm line-clamp-2 mb-2 leading-tight">{product.name}</h3>

              {/* Price */}
              <div className="flex items-center gap-2 mb-3">
                {variant?.salePrice && variant.salePrice < originalPrice ? (
                  <>
                    <span className="font-bold text-green-600">${variant.salePrice.toFixed(0)}</span>
                    <span className="text-xs text-muted-foreground line-through">${originalPrice.toFixed(0)}</span>
                  </>
                ) : (
                  <span className="font-bold text-foreground">${originalPrice.toFixed(0)}</span>
                )}
              </div>
            </div>
          </Link>

          {/* Add to cart button - bottom of card */}
          <div className="p-3 pt-0">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white rounded-lg h-8 text-sm"
              size="sm"
            >
              <ShoppingCart className="mr-2 h-3 w-3" />
              {t("product.addToCart")}
            </Button>
          </div>
        </div>
      </CustomContextMenu>

      {/* Quick View Dialog */}
      <Dialog open={showQuickView} onOpenChange={setShowQuickView}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{product.name}</DialogTitle>
            <DialogDescription>
              {product.category?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="aspect-square overflow-hidden rounded-md">
              <img
                src={image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-2 mb-4">
                {variant?.salePrice && variant.salePrice < originalPrice ? (
                  <>
                    <span className="text-2xl font-medium text-primary">${variant.salePrice.toFixed(2)}</span>
                    <span className="text-lg text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-2xl font-medium">${originalPrice.toFixed(2)}</span>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-6">{product.description}</p>

              {(product.details as any)?.material && (
                <div className="space-y-2 mb-6">
                  {(product.details as any).material && (
                    <p className="text-sm"><span className="font-medium">{t("product.material")}:</span> {(product.details as any).material}</p>
                  )}
                  {(product.details as any).dimensions && (
                    <p className="text-sm"><span className="font-medium">{t("product.dimensions")}:</span> {(product.details as any).dimensions}</p>
                  )}
                  {(product.details as any).care && (
                    <p className="text-sm"><span className="font-medium">{t("product.care")}:</span> {(product.details as any).care}</p>
                  )}
                </div>
              )}

              <div className="mt-auto space-y-4">
                <Button
                  className="w-full"
                  onClick={() => {
                    addToCart(product, 1)
                    setShowQuickView(false)
                  }}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {t("product.addToCart")}
                </Button>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(`/product/${product.id}`)}
                >
                  {t("product.viewDetails")}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

