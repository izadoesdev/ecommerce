import { Suspense } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { FeaturedProducts } from "@/components/featured-products"
import { ProductSkeleton } from "@/components/product-skeleton"
import { getProductById, getProducts } from "@/lib/products"
import { useTranslation } from "@/lib/i18n"

export async function generateStaticParams() {
  const products = await getProducts()
  return products.map((product) => ({
    id: product.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: `${product.name} - MAISON`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = await useTranslation()
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getProducts(product.category)
  const filteredRelatedProducts = relatedProducts.filter((p) => p.id !== product.id).slice(0, 8)

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="aspect-square relative overflow-hidden rounded-md">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-3xl font-serif">{product.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t(`category.${product.category}.name`)}</p>

            <div className="mt-4 flex items-baseline gap-2">
              {product.sale && product.salePrice ? (
                <>
                  <span className="text-2xl font-medium text-primary">${product.salePrice.toFixed(2)}</span>
                  <span className="text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-2xl font-medium">${product.price.toFixed(2)}</span>
              )}
            </div>

            <div className="mt-8">
              <p className="text-foreground">{product.description}</p>
            </div>

            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>

            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-sm font-medium mb-2">{t("product.details")}</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  {t("product.material")}: {product.details?.material || "Various"}
                </li>
                <li>
                  {t("product.dimensions")}: {product.details?.dimensions || "Various sizes"}
                </li>
                <li>
                  {t("product.care")}: {product.details?.care || "Clean with a soft cloth"}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <Suspense fallback={<ProductSkeleton count={4} />}>
          <FeaturedProducts
            products={filteredRelatedProducts}
            title={t("product.youMayAlsoLike")}
            viewAllLink={`/category/${product.category}`}
          />
        </Suspense>
      </div>
      <Footer />
    </>
  )
}

