import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductSkeleton } from "@/components/product-skeleton"
import { getProducts } from "@/lib/products"
import { useTranslation } from "@/lib/i18n"

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string }
}) {
  const { t } = await useTranslation()
  const query = searchParams.q || ""
  const products = await getProducts()

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="mb-8">
          <h1 className="text-3xl font-serif mb-2">{t("search.results")}</h1>
          <p className="text-muted-foreground">
            {filteredProducts.length} {t("search.resultsFor")} "{query}"
          </p>
        </div>

        <Suspense fallback={<ProductSkeleton count={8} />}>
          <ProductGrid products={filteredProducts} showSorting={true} />
        </Suspense>
      </div>
      <Footer />
    </>
  )
}

