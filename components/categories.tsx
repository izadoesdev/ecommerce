"use client"

import Link from "next/link"
import { trpc } from "@/lib/trpc/client"
import { FadeIn } from "@/components/animations/fade-in"
import { useTranslation } from "@/lib/i18n/client"

export function Categories() {
  const { t } = useTranslation()
  const { data: categories = [], isLoading } = trpc.categories.getAll.useQuery()

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif mb-2">{t("categories.shopByCategory")}</h2>
          <p className="text-muted-foreground">{t("categories.shopByCategoryDesc")}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }, (_, i) => i).map((id) => (
            <div key={`skeleton-${id}`} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <FadeIn>
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif mb-2">{t("categories.shopByCategory")}</h2>
          <p className="text-muted-foreground">{t("categories.shopByCategoryDesc")}</p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <FadeIn key={category.id} delay={index * 0.1}>
            <Link
              href={`/category/${category.slug}`}
              className="group block text-center hover:scale-105 transition-transform duration-200"
            >
              <div className="aspect-square overflow-hidden rounded-lg mb-3 bg-gray-100 dark:bg-gray-800">
                <img
                  src={category.image || "/placeholder.jpg"}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="font-medium text-sm mb-1">{category.name}</h3>
              <p className="text-xs text-muted-foreground">
                {category.description || t("categories.exploreCollection")}
              </p>
            </Link>
          </FadeIn>
        ))}
      </div>
    </div>
  )
}

