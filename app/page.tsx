import { Suspense } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { Categories } from "@/components/categories"
import { FeaturedProducts } from "@/components/featured-products"
import { ProductSkeleton } from "@/components/product-skeleton"
import { getProducts } from "@/lib/products"
import { FadeIn } from "@/components/animations/fade-in"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/lib/i18n"

export default async function Home() {
  const { t } = await useTranslation()
  const products = await getProducts()
  const featuredProducts = products.filter((product) => product.featured).slice(0, 8)
  const newArrivals = products.filter((product) => product.newArrival).slice(0, 8)
  const saleProducts = products.filter((product) => product.sale).slice(0, 8)

  return (
    <>
      <Navbar />
      <HeroSection />

      <div className="container mx-auto px-4">
        <Suspense fallback={<ProductSkeleton count={4} />}>
          <Categories />
        </Suspense>

        <Suspense fallback={<ProductSkeleton count={4} />}>
          <FeaturedProducts
            products={featuredProducts}
            title={t("home.featuredProducts")}
            subtitle={t("home.featuredSubtitle")}
            viewAllLink="/category/all"
          />
        </Suspense>

        {/* Banner Section */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FadeIn delay={0.1}>
              <div className="relative h-[400px] overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1533090161767-e6ffed986c88?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
                  alt="Living room furniture"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-8">
                  <span className="text-white text-sm uppercase tracking-wider mb-2">{t("home.newCollection")}</span>
                  <h3 className="text-white text-2xl font-serif mb-3">{t("home.livingRoom")}</h3>
                  <p className="text-white/80 mb-4 max-w-xs">{t("home.livingRoomDesc")}</p>
                  <Button asChild className="rounded-full w-fit px-6">
                    <Link href="/category/furniture">{t("home.shopCollection")}</Link>
                  </Button>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="relative h-[400px] overflow-hidden rounded-lg">
                <img
                  src="https://images.unsplash.com/photo-1556911220-bda9f7f7597e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
                  alt="Kitchen accessories"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-8">
                  <span className="text-white text-sm uppercase tracking-wider mb-2">{t("home.trending")}</span>
                  <h3 className="text-white text-2xl font-serif mb-3">{t("home.kitchenware")}</h3>
                  <p className="text-white/80 mb-4 max-w-xs">{t("home.kitchenwareDesc")}</p>
                  <Button asChild className="rounded-full w-fit px-6">
                    <Link href="/category/kitchen">{t("home.shopCollection")}</Link>
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        <Suspense fallback={<ProductSkeleton count={4} />}>
          <FeaturedProducts
            products={newArrivals}
            title={t("home.newArrivals")}
            subtitle={t("home.newArrivalsSubtitle")}
            viewAllLink="/category/all"
            variant="highlight"
          />
        </Suspense>

        {/* Testimonials Section */}
        <div className="py-16">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-serif mb-2">{t("home.testimonials")}</h2>
              <p className="text-muted-foreground max-w-md mx-auto">{t("home.testimonialsSubtitle")}</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn delay={0.1}>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-border">
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                </div>
                <p className="text-muted-foreground mb-4">"{t("home.testimonial1")}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
                      alt="Emily Johnson"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Emily Johnson</p>
                    <p className="text-xs text-muted-foreground">New York, USA</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-border">
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                </div>
                <p className="text-muted-foreground mb-4">"{t("home.testimonial2")}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
                      alt="Michael Chen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Michael Chen</p>
                    <p className="text-xs text-muted-foreground">Toronto, Canada</p>
                  </div>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-border">
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                  <span>★</span>
                </div>
                <p className="text-muted-foreground mb-4">"{t("home.testimonial3")}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80"
                      alt="Sophia Martinez"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Sophia Martinez</p>
                    <p className="text-xs text-muted-foreground">London, UK</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        <Suspense fallback={<ProductSkeleton count={4} />}>
          <FeaturedProducts
            products={saleProducts}
            title={t("home.onSale")}
            subtitle={t("home.onSaleSubtitle")}
            viewAllLink="/category/all"
          />
        </Suspense>

        {/* Newsletter Section */}
        <div className="py-16 mb-8">
          <div className="bg-accent/50 dark:bg-gray-800 rounded-xl p-8 md:p-12 text-center">
            <FadeIn>
              <h2 className="text-3xl font-serif mb-3">{t("home.stayUpdated")}</h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">{t("home.stayUpdatedDesc")}</p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input placeholder={t("home.emailPlaceholder")} className="rounded-full" />
                <Button className="rounded-full px-6">{t("home.subscribe")}</Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

