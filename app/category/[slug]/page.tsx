"use client"

import { useParams, notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductSkeleton } from "@/components/product-skeleton"
import { trpc } from "@/lib/trpc/client"
import { useTranslation } from "@/lib/i18n/client"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CategoryPage() {
  const { t } = useTranslation()
  const params = useParams()
  const slug = params.slug as string

  const { data: category, isLoading, isError } = trpc.categories.getBySlug.useQuery(
    { slug },
    { enabled: !!slug } // Only run query when slug is available
  )

  // Handle loading state with a skeleton UI
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse mb-12">
            <div className="h-10 bg-gray-200 rounded-md w-1/3 mb-4 dark:bg-gray-700"></div>
            <div className="h-4 bg-gray-200 rounded-md w-1/2 dark:bg-gray-700"></div>
          </div>
          <ProductSkeleton count={12} />
        </div>
        <Footer />
      </>
    )
  }

  // Handle data fetching errors or if category is not found
  if (isError || !category) {
    return notFound()
  }

  const products = category?.products || []

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold tracking-tight sm:text-5xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              {category.description}
            </p>
          )}
        </div>

        {/* Render product grid or empty state */}
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold mb-4">{t("category.noProductsTitle")}</h2>
            <p className="text-muted-foreground mb-8">
              {t("category.noProductsDesc")}
            </p>
            <Button asChild>
              <Link href="/">{t("category.backToHome")}</Link>
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}

