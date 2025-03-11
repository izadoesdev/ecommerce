import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductSkeleton } from "@/components/product-skeleton"

export default function SearchLoading() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <ProductSkeleton count={6} />
          </div>
          
          <div className="mt-12 flex justify-center">
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
} 