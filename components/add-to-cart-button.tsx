"use client"

import { useState } from "react"
import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useTranslation } from "@/lib/i18n/client"
import type { Product } from "@/lib/types"
import { motion } from "framer-motion"

interface AddToCartButtonProps {
  product: Product
  size?: "default" | "sm" | "lg"
}

export function AddToCartButton({ product, size = "default" }: AddToCartButtonProps) {
  const { t } = useTranslation()
  const { addToCart, isInCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const productInCart = isInCart(product.id)

  const handleAddToCart = () => {
    if (productInCart) return

    setIsAdding(true)
    addToCart(product, quantity)

    // Reset after animation
    setTimeout(() => {
      setIsAdding(false)
    }, 1500)
  }

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex border rounded-md">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-none h-10 w-10"
            onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          >
            -
          </Button>
          <div className="flex items-center justify-center w-12 h-10 text-center">{quantity}</div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-none h-10 w-10"
            onClick={() => setQuantity((prev) => prev + 1)}
          >
            +
          </Button>
        </div>

        <Button onClick={handleAddToCart} disabled={isAdding || productInCart} className="flex-1 relative" size={size}>
          {isAdding ? (
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center"
            >
              <Check className="mr-2 h-4 w-4" />
              {t("product.added")}
            </motion.span>
          ) : productInCart ? (
            <span className="flex items-center">
              <Check className="mr-2 h-4 w-4" />
              {t("product.inCart")}
            </span>
          ) : (
            <span className="flex items-center">
              <ShoppingCart className="mr-2 h-4 w-4" />
              {t("product.addToCart")}
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}

