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
          className="relative h-full flex flex-col product-card"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Link href={`/product/${product.slug}`} className="flex flex-col h-full">
            {/* Image container */}
            <div className="relative overflow-hidden bg-accent aspect-[3/4] rounded-t-lg">
              {/* Product badges */}
              <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
                {product.sale && (
                  <Badge className="bg-primary text-white font-medium px-3 py-1">{t("product.sale")}</Badge>
                )}
                {product.newArrival && (
                  <Badge variant="outline" className="bg-white dark:bg-black px-3 py-1">
                    {t("product.new")}
                  </Badge>
                )}
              </div>

              {/* Product image with loading state */}
              <div className="w-full h-full">
                {!isImageLoaded && <div className="absolute inset-0 bg-accent animate-pulse-soft" />}
                <img
                  src={image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  onLoad={() => setIsImageLoaded(true)}
                  style={{ opacity: isImageLoaded ? 1 : 0 }}
                />
              </div>

              {/* Quick actions overlay */}
              <div
                className={`absolute inset-0 bg-black/5 flex items-center justify-center gap-3 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                <Button
                  size="sm"
                  onClick={handleAddToCart}
                  className={`rounded-full w-10 h-10 p-0 ${productInCart ? "bg-primary text-white" : "bg-white text-foreground hover:bg-primary hover:text-white"
                    } transition-colors shadow-md`}
                  title={t("product.addToCart")}
                >
                  <ShoppingCart className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full w-10 h-10 p-0 bg-white text-foreground hover:bg-primary hover:text-white border-none transition-colors shadow-md"
                  title={t("product.wishlist")}
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full w-10 h-10 p-0 bg-white text-foreground hover:bg-primary hover:text-white border-none transition-colors shadow-md"
                  title={t("product.quickView")}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleQuickView()
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Product details */}
            <div className="flex-1 flex flex-col p-4">
              <div className="text-sm text-muted-foreground mb-1">{product.category?.name}</div>
              <h3 className="font-medium line-clamp-1">{product.name}</h3>
              <div className="mt-auto pt-2 flex items-baseline gap-2">
                {variant?.salePrice && variant.salePrice < originalPrice ? (
                  <>
                    <span className="font-medium text-primary">${variant.salePrice.toFixed(2)}</span>
                    <span className="text-sm text-muted-foreground line-through">${originalPrice.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="font-medium">${originalPrice.toFixed(2)}</span>
                )}
              </div>
            </div>
          </Link>
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

