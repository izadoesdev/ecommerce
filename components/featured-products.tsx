"use client"

import { useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/product-card"
import { FadeIn } from "@/components/animations/fade-in"
import { useTranslation } from "@/lib/i18n/client"
import type { ProductWithRelations } from "@/lib/products"

interface FeaturedProductsProps {
  products: ProductWithRelations[]
  title: string
  subtitle?: string
  viewAllLink?: string
  variant?: "default" | "highlight"
}

export function FeaturedProducts({
  products,
  title,
  subtitle,
  viewAllLink,
  variant = "default",
}: FeaturedProductsProps) {
  const { t } = useTranslation()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return

    const scrollAmount = 300
    const container = scrollContainerRef.current
    const currentScroll = container.scrollLeft

    container.scrollTo({
      left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
      behavior: "smooth",
    })
  }

  const isHighlight = variant === "highlight"

  return (
    <div className={`relative ${isHighlight ? "featured-section" : "py-16"}`}>
      <div className="container relative">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
          <FadeIn delay={0.1}>
            <div>
              <h2 className="text-3xl font-serif mb-2">{title}</h2>
              {subtitle && <p className="text-muted-foreground max-w-md">{subtitle}</p>}
            </div>
          </FadeIn>

          {viewAllLink && (
            <FadeIn delay={0.2}>
              <Link href={viewAllLink}>
                <Button variant="link" className="text-primary font-medium">
                  {t("product.viewAll")} →
                </Button>
              </Link>
            </FadeIn>
          )}
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hidden md:flex rounded-full shadow-md dark:bg-black/90"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-8 scroll-smooth scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product, index) => (
              <div key={product.id} className="w-[260px] flex-shrink-0">
                <ProductCard product={product} index={index} />
              </div>
            ))}
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm hidden md:flex rounded-full shadow-md dark:bg-black/90"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

