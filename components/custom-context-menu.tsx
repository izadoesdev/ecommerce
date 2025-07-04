"use client"

import React, { ReactNode } from "react"
import { Copy, Share, Heart, ShoppingCart, Eye, Trash } from "lucide-react"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/components/cart-provider"
import { ProductWithRelations } from "@/lib/products"
import { useTranslation } from "@/lib/i18n/client"

interface CustomContextMenuProps {
  children: ReactNode
  product?: ProductWithRelations
  onQuickView?: () => void
  className?: string
}

export function CustomContextMenu({
  children,
  product,
  onQuickView,
  className
}: CustomContextMenuProps) {
  const { toast } = useToast()
  const { addToCart } = useCart()
  const { t } = useTranslation()

  const variant = product?.variants[0]
  const price = variant?.price ?? 0
  const salePrice = variant?.salePrice

  const handleCopyLink = () => {
    if (product) {
      const url = `${window.location.origin}/product/${product.slug}`
      navigator.clipboard.writeText(url)
      toast({
        title: t("common.copied"),
        description: t("product.linkCopied"),
      })
    }
  }

  const handleShare = async () => {
    if (product && navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: `${window.location.origin}/product/${product.slug}`,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      handleCopyLink()
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1)
      toast({
        title: t("cart.itemAdded"),
        description: product.name,
      })
    }
  }

  const handleAddToWishlist = () => {
    if (product) {
      toast({
        title: t("wishlist.itemAdded"),
        description: product.name,
      })
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger className={className}>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64 animate-in zoom-in-90 duration-100">
        {product && (
          <>
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium leading-none">{product.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {salePrice && salePrice < price ? (
                  <>
                    <span className="text-primary font-medium">${salePrice.toFixed(2)}</span>
                    <span className="line-through ml-2">${price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="font-medium">${price.toFixed(2)}</span>
                )}
              </p>
            </div>
            <ContextMenuSeparator />
            {onQuickView && (
              <ContextMenuItem onClick={onQuickView}>
                <Eye className="mr-2 h-4 w-4" />
                {t("product.quickView")}
              </ContextMenuItem>
            )}
            <ContextMenuItem onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              {t("product.addToCart")}
            </ContextMenuItem>
            <ContextMenuItem onClick={handleAddToWishlist}>
              <Heart className="mr-2 h-4 w-4" />
              {t("product.addToWishlist")}
              <ContextMenuShortcut>⌘W</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={handleCopyLink}>
              <Copy className="mr-2 h-4 w-4" />
              {t("common.copyLink")}
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={handleShare}>
              <Share className="mr-2 h-4 w-4" />
              {t("common.share")}
            </ContextMenuItem>
          </>
        )}
        {!product && (
          <>
            <ContextMenuItem onClick={handleCopyLink}>
              <Copy className="mr-2 h-4 w-4" />
              {t("common.copyLink")}
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={handleShare}>
              <Share className="mr-2 h-4 w-4" />
              {t("common.share")}
            </ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
} 