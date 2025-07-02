"use client"

import { useState } from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import { Star, Heart, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { trpc } from "@/lib/trpc/client"
import { useTranslation } from "@/lib/i18n/client"
import { ProductSkeleton } from "@/components/product-skeleton"
import { FeaturedProducts } from "@/components/featured-products"

function RelatedProducts({ categoryId, currentProductId }: { categoryId: number, currentProductId: number }) {
  const { t } = useTranslation()
  const { data: relatedProducts, isLoading } = trpc.products.getRelated.useQuery({
    categoryId,
    currentProductId,
  })

  if (isLoading) {
    return <ProductSkeleton count={4} />
  }

  if (!relatedProducts || relatedProducts.length === 0) {
    return null
  }

  return (
    <FeaturedProducts
      products={relatedProducts}
      title={t("product.youMayAlsoLike")}
      subtitle=""
    />
  )
}

export default function ProductPage() {
  const { t } = useTranslation()
  const params = useParams()
  const productSlug = params.id as string

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(0)

  const { data: product, isLoading, isError } = trpc.products.getBySlug.useQuery(
    { slug: productSlug },
    { enabled: !!productSlug }
  )

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <ProductSkeleton count={1} />
        </div>
        <Footer />
      </>
    )
  }

  if (isError || !product) {
    return notFound()
  }

  const variant = product.variants[selectedVariant]
  const safeImages = (variant?.images || []).filter(img => img && img.length > 0);
  const images = safeImages.length > 0 ? safeImages : ["/placeholder.jpg"];
  const price = variant?.salePrice || variant?.price || 0
  const originalPrice = variant?.salePrice ? variant.price : null

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover transition-opacity duration-300"
                priority
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={`image-${index + 1}`}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index
                      ? "border-primary"
                      : "border-transparent hover:border-gray-300"
                      }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category.name}</Badge>
                {product.newArrival && <Badge variant="outline">{t("product.new")}</Badge>}
                {product.sale && <Badge variant="destructive">{t("product.sale")}</Badge>}
              </div>
              <h1 className="text-3xl lg:text-4xl font-serif mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={`star-${i + 1}`}
                      className={`w-4 h-4 ${i < 4 ? "fill-current" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">(4.0) · 24 reviews</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold">${price.toFixed(2)}</span>
                {originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              {product.variants.length > 1 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2 uppercase tracking-wider text-muted-foreground">{t("product.variants")}</h3>
                  <div className="flex gap-2">
                    {product.variants.map((v, index) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(index)}
                        className={`px-4 py-2 text-sm rounded-md border transition-colors ${selectedVariant === index
                          ? "bg-primary text-primary-foreground border-primary"
                          : "hover:bg-accent"
                          }`}
                      >
                        {Object.values(v.options as any).join(' / ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 pt-4">
                <AddToCartButton product={product} />
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("product.stock")}: {variant?.stock || 0}
              </p>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">{t("product.description")}</TabsTrigger>
              <TabsTrigger value="specifications">{t("product.specifications")}</TabsTrigger>
              <TabsTrigger value="reviews">{t("product.reviews")}</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6 prose dark:prose-invert max-w-none">
              <p>{product.description}</p>
            </TabsContent>
            <TabsContent value="specifications" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">{t("product.category")}</h4>
                  <p className="text-muted-foreground">{product.category.name}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t("product.sku")}</h4>
                  <p className="text-muted-foreground">{variant?.sku || "N/A"}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t("product.stock")}</h4>
                  <p className="text-muted-foreground">{variant?.stock || 0} units</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">{t("product.tags")}</h4>
                  <p className="text-muted-foreground">{product.tags.join(", ") || "None"}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <p className="text-muted-foreground">{t("product.noReviews")}</p>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <RelatedProducts categoryId={product.categoryId} currentProductId={product.id} />
        </div>
      </div>
      <Footer />
    </>
  )
}

