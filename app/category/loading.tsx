import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductSkeleton } from "@/components/product-skeleton"

export default function CategoryLoading() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <div className="w-full md:w-64 shrink-0 space-y-6">
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="space-y-2">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </div>
            
            <Skeleton className="h-8 w-32 mt-8 mb-4" />
            <div className="space-y-2">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-5 w-24" />
                </div>
              ))}
            </div>
            
            <Skeleton className="h-8 w-32 mt-8 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
          
          {/* Products Grid Skeleton */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ProductSkeleton count={9} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
} 