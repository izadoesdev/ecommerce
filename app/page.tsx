"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { Categories } from "@/components/categories"
import { FeaturedProducts } from "@/components/featured-products"
import { ProductSkeleton } from "@/components/product-skeleton"
import { trpc } from "@/lib/trpc/client"
import { FadeIn } from "@/components/animations/fade-in"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/lib/i18n/client"

export default function Home() {
  const { t } = useTranslation()

  // Use tRPC queries to fetch product data for different sections
  const {
    data: featuredProducts,
    isLoading: featuredLoading,
    isError: featuredError,
  } = trpc.products.getFeatured.useQuery()
  const {
    data: newArrivals,
    isLoading: newLoading,
    isError: newError,
  } = trpc.products.getNewArrivals.useQuery()
  const {
    data: saleProducts,
    isLoading: saleLoading,
    isError: saleError,
  } = trpc.products.getSale.useQuery()

  const isLoading = featuredLoading || newLoading || saleLoading
  const isError = featuredError || newError || saleError

  // Display a full-page loading skeleton while initial data is being fetched
  if (isLoading) {
    return (
      <>
        <Navbar />
        <HeroSection />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-serif mb-6">{t("home.loadingProducts")}</h2>
          <ProductSkeleton count={8} />
        </div>
        <Footer />
      </>
    )
  }

  // Display a full-page error message if any of the data fetches fail
  if (isError) {
    return (
      <>
        <Navbar />
        <HeroSection />
        <div className="container mx-auto px-4 py-32 text-center">
          <h2 className="text-3xl font-serif mb-4 text-destructive">
            {t("error.couldNotLoadProducts")}
          </h2>
          <p className="text-muted-foreground mb-6">{t("error.tryRefreshing")}</p>
          <Button onClick={() => window.location.reload()}>{t("error.refreshPage")}</Button>
        </div>
        <Footer />
      </>
    )
  }

  const noProductsAvailable =
    !featuredProducts?.length && !newArrivals?.length && !saleProducts?.length

  return (
    <>
      <Navbar />
      <HeroSection />

      <main className="container mx-auto px-4">
        <Suspense fallback={<ProductSkeleton count={4} />}>
          <Categories />
        </Suspense>

        {noProductsAvailable ? (
          <div className="py-32 text-center">
            <h2 className="text-3xl font-serif mb-4">{t("home.noProductsFound")}</h2>
            <p className="text-muted-foreground mb-8">{t("home.noProductsDesc")}</p>
            <Button asChild>
              <Link href="/search">{t("home.exploreAll")}</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Only render "Featured Products" if there are any */}
            {featuredProducts && featuredProducts.length > 0 && (
              <FeaturedProducts
                products={featuredProducts}
                title={t("home.featuredProducts")}
                subtitle={t("home.featuredSubtitle")}
                viewAllLink="/search?filter=featured"
              />
            )}

            {/* Only render "New Arrivals" if there are any */}
            {newArrivals && newArrivals.length > 0 && (
              <FeaturedProducts
                products={newArrivals}
                title={t("home.newArrivals")}
                subtitle={t("home.newArrivalsSubtitle")}
                viewAllLink="/search?filter=new-arrivals"
                variant="highlight"
              />
            )}

            {/* Only render "On Sale" if there are any */}
            {saleProducts && saleProducts.length > 0 && (
              <FeaturedProducts
                products={saleProducts}
                title={t("home.onSale")}
                subtitle={t("home.onSaleSubtitle")}
                viewAllLink="/search?filter=sale"
              />
            )}
          </>
        )}

        {/* Newsletter Section */}
        <div className="py-16 my-8">
          <div className="bg-accent/50 dark:bg-gray-800 rounded-xl p-8 md:p-12 text-center">
            <FadeIn>
              <h2 className="text-3xl font-serif mb-3">{t("home.stayUpdated")}</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {t("home.stayUpdatedDesc")}
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <Input
                  type="email"
                  placeholder={t("home.emailPlaceholder")}
                  className="rounded-full"
                  required
                />
                <Button type="submit" className="rounded-full px-6">
                  {t("home.subscribe")}
                </Button>
              </form>
            </FadeIn>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

