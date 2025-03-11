import { Suspense } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductSkeleton } from "@/components/product-skeleton"
import { getProducts, getCategories } from "@/lib/products"
import { notFound } from "next/navigation"
import { useTranslation } from "@/lib/i18n"

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((category) => ({
    slug: category.id,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const categories = await getCategories()
  const category = categories.find((cat) => cat.id === slug)

  if (!category) {
    return {
      title: "Category Not Found",
    }
  }

  return {
    title: `${category.name} - MAISON`,
    description: `Explore our ${category.name.toLowerCase()} collection at MAISON.`,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { t } = await useTranslation()
  const { slug } = await params
  const categories = await getCategories()
  const category = categories.find((cat) => cat.id === slug)

  if (!category) {
    notFound()
  }

  const products = await getProducts(slug === "all" ? undefined : slug)

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16 mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-serif mb-2">{t(`category.${category.id}.name`)}</h1>
          <p className="text-muted-foreground">{category.description || t(`category.${category.id}.description`)}</p>
        </div>

        <Suspense fallback={<ProductSkeleton count={8} />}>
          <ProductGrid products={products} category={slug} showSorting={true} />
        </Suspense>
      </div>
      <Footer />
    </>
  )
}

