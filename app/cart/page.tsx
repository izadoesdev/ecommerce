"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslation } from "@/lib/i18n/client"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CartItem } from "@/components/cart-item"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { motion } from "framer-motion"

export default function CartPage() {
  const { t } = useTranslation()
  const { items, totalPrice, clearCart } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const handleCheckout = () => {
    setIsCheckingOut(true)
    // Simulate checkout process
    setTimeout(() => {
      clearCart()
      setIsCheckingOut(false)
      // In a real app, you would redirect to a success page
    }, 2000)
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-3xl font-light mb-8">{t("cart.title")}</h1>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="border-t border-gray-100">
                {items.map((item) => {
                  const variant = item.variants[0]
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CartItem
                        id={item.id}
                        slug={item.slug}
                        name={item.name}
                        price={variant?.price ?? 0}
                        salePrice={variant?.salePrice ?? undefined}
                        quantity={item.quantity}
                        image={variant?.images[0] || "/placeholder.svg"}
                        stock={variant?.stock || 10}
                      />
                    </motion.div>
                  )
                })}
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" onClick={clearCart}>
                  {t("cart.clearCart")}
                </Button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="border rounded-md p-6 sticky top-24">
                <h2 className="text-lg font-medium mb-4">{t("cart.orderSummary")}</h2>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("cart.subtotal")}</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("cart.shipping")}</span>
                    <span>{t("cart.freeShipping")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("cart.tax")}</span>
                    <span>${(totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex justify-between font-medium">
                    <span>{t("cart.total")}</span>
                    <span>${(totalPrice + totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                </div>

                <Button className="w-full" onClick={handleCheckout} disabled={isCheckingOut}>
                  {isCheckingOut ? t("cart.processing") : t("cart.checkout")}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-4">{t("cart.empty")}</h2>
            <p className="text-gray-500 mb-8">{t("cart.emptyMessage")}</p>
            <Link href="/category/all">
              <Button>{t("cart.continueShopping")}</Button>
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

