import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductSkeleton } from "@/components/product-skeleton"

export default function Loading() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="w-full max-w-7xl">
            <div className="h-8 w-48 bg-muted rounded-md mb-8 animate-pulse mx-auto" />
            <div className="h-4 w-64 bg-muted rounded-md mb-12 animate-pulse mx-auto" />
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <ProductSkeleton count={8} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
} 