"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useTranslation } from "@/lib/i18n/client"

interface CartItemProps {
  id: number
  slug: string
  name: string
  price: number
  salePrice?: number
  quantity: number
  image: string
  stock: number
}

export function CartItem({ id, slug, name, price, salePrice, quantity, image, stock }: CartItemProps) {
  const { t } = useTranslation()
  const { updateQuantity, removeFromCart } = useCart()
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const displayPrice = salePrice || price
  const totalPrice = displayPrice * quantity

  const incrementQuantity = () => {
    if (quantity < stock) {
      updateQuantity(id, quantity + 1)
    }
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1)
    }
  }

  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 dark:border-gray-800 animate-fade-in">
      <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden flex-shrink-0">
        {!isImageLoaded && <div className="w-full h-full bg-gray-100 dark:bg-gray-800 animate-pulse-soft" />}
        <Link href={`/product/${slug}`}>
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover"
            onLoad={() => setIsImageLoaded(true)}
            style={{ opacity: isImageLoaded ? 1 : 0 }}
          />
        </Link>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <div className="pr-2">
            <Link href={`/product/${slug}`} className="hover:underline underline-offset-2">
              <h3 className="font-medium text-sm line-clamp-1">{name}</h3>
            </Link>
            <div className="mt-1 flex items-center gap-2">
              {salePrice ? (
                <>
                  <span className="font-medium text-sm">${salePrice.toFixed(2)}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 line-through">${price.toFixed(2)}</span>
                </>
              ) : (
                <span className="font-medium text-sm">${price.toFixed(2)}</span>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-8 text-center text-sm">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={incrementQuantity}
              disabled={quantity >= stock}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <Button
            variant="ghost"
            className="h-7 p-0 text-xs text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
            onClick={() => removeFromCart(id)}
          >
            <Trash2 className="h-3 w-3 mr-1" />
            {t("cart.remove")}
          </Button>

          <span className="font-medium">${totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

