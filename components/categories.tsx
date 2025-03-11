"use client"

import { useRef } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/client"
import { FadeIn } from "@/components/animations/fade-in"
import { getCategories } from "@/lib/products"
import { motion } from "framer-motion"

export function Categories() {
  const { t } = useTranslation()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const categories = getCategories()

  // Add Unsplash images for categories
  const categoryImages = {
    all: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    decor:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    furniture:
      "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    textiles:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
    kitchen:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80",
  }

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

  return (
    <div className="relative py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
        <FadeIn delay={0.2}>
          <h2 className="text-3xl font-serif mb-2">{t("home.shopByCategory")}</h2>
          <p className="text-muted-foreground max-w-md">{t("home.categorySubtitle")}</p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <Link href="/category/all">
            <Button variant="link" className="text-primary font-medium">
              {t("home.viewAllCategories")} →
            </Button>
          </Link>
        </FadeIn>
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
          className="flex overflow-x-auto gap-6 pb-8 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories
            .filter((cat) => cat.id !== "all")
            .map((category, index) => (
              <FadeIn key={category.id} delay={0.1 + index * 0.05} distance={10}>
                <Link href={`/category/${category.id}`} className="flex-shrink-0 category-card">
                  <div className="w-[280px] h-[320px] relative overflow-hidden rounded-lg">
                    <img
                      src={categoryImages[category.id as keyof typeof categoryImages] || "/placeholder.svg"}
                      alt={t(`category.${category.id}.name`)}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out"
                    />
                    <div className="category-card-content">
                      <h3 className="text-white text-xl font-serif">{t(`category.${category.id}.name`)}</h3>
                      <p className="text-white/80 text-sm mt-1 line-clamp-2">
                        {t(`category.${category.id}.description`)}
                      </p>
                      <motion.div
                        className="mt-3 inline-flex items-center text-sm text-white font-medium"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {t("home.exploreCategory")} <span className="ml-1">→</span>
                      </motion.div>
                    </div>
                  </div>
                </Link>
              </FadeIn>
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
  )
}

