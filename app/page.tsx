"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { Grid, List, Loader2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductSkeleton } from "@/components/product-skeleton"
import { trpc } from "@/lib/trpc/client"

import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useDebounce } from "@/hooks/use-debounce"

const PRODUCTS_PER_PAGE = 50

export default function Home() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const loadMoreRef = useRef<HTMLDivElement>(null)

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Fetch categories (this is small and can be cached)
  const { data: categories } = trpc.categories.getAll.useQuery()

  // Infinite query for products using tRPC
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = trpc.products.searchInfinite.useInfiniteQuery(
    {
      query: debouncedSearchQuery,
      sortBy: sortBy as any,
      categories: selectedCategories,
      filters: selectedFilters,
      limit: PRODUCTS_PER_PAGE,
    },
    {
      getNextPageParam: (lastPage: any) => lastPage.nextCursor,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      refetchOnWindowFocus: false,
    }
  )

  // Flatten all products from all pages
  const allProducts = useMemo(() => {
    return data?.pages.flatMap(page => page.products) || []
  }, [data])

  const totalProducts = data?.pages[0]?.total || 0

  // Intersection Observer for infinite scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleCategoryToggle = useCallback((categorySlug: string) => {
    setSelectedCategories(prev =>
      prev.includes(categorySlug)
        ? prev.filter(c => c !== categorySlug)
        : [...prev, categorySlug]
    )
  }, [])

  const handleFilterToggle = useCallback((filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }, [])

  const clearAllFilters = useCallback(() => {
    setSelectedCategories([])
    setSelectedFilters([])
    setSearchQuery("")
  }, [])

  // Scroll to top when filters change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [debouncedSearchQuery, selectedCategories, selectedFilters, sortBy])

  // Loading state
  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <ProductSkeleton count={50} />
        </div>
        <Footer />
      </>
    )
  }

  // Error state
  if (isError) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <h2 className="text-3xl font-serif mb-4 text-destructive">
            {t("error.couldNotLoadProducts")}
          </h2>
          <p className="text-muted-foreground mb-6">{t("error.tryRefreshing")}</p>
          <Button onClick={() => refetch()}>{t("error.refreshPage")}</Button>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main className="container mx-auto px-4 pt-24">
        {/* Horizontal Categories Row */}
        <div className="mb-6">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {/* All Categories Card */}
            <div
              className="flex-shrink-0 cursor-pointer"
              onClick={() => setSelectedCategories([])}
            >
              <div className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 ${selectedCategories.length === 0
                ? 'ring-2 ring-primary shadow-lg'
                : 'hover:shadow-md'
                }`}>
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center">
                  <Grid className="h-8 w-8 text-primary" />
                </div>
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              <p className="text-xs text-center mt-2 font-medium text-muted-foreground">
                {t("catalogue.allCategories")}
              </p>
            </div>

            {/* Category Image Cards */}
            {categories?.map(category => (
              <div
                key={category.id}
                className="flex-shrink-0 cursor-pointer p-1"
                onClick={() => handleCategoryToggle(category.slug)}
              >
                <div className={`relative w-20 h-20 rounded-lg overflow-hidden transition-all duration-300 ${selectedCategories.includes(category.slug)
                  ? 'ring-2 ring-primary shadow-lg'
                  : 'hover:shadow-md'
                  }`}>
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300"></div>
                  {selectedCategories.includes(category.slug) && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-center mt-2 font-medium text-muted-foreground line-clamp-1">
                  {category.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <FilterContent
                  categories={categories || []}
                  selectedCategories={selectedCategories}
                  selectedFilters={selectedFilters}
                  onCategoryToggle={handleCategoryToggle}
                  onFilterToggle={handleFilterToggle}
                  onClearAll={clearAllFilters}
                />
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1" id="products-section">
            {/* Results Info and Mobile Filters */}
            <div className="flex items-center justify-between mb-6">
              {/* Mobile Filters and View Mode */}
              <div className="flex items-center gap-2">
                {/* Mobile Filters */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="lg:hidden">
                      {t("catalogue.filters")}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>{t("catalogue.filters")}</SheetTitle>
                    </SheetHeader>
                    <div className="py-6">
                      <FilterContent
                        categories={categories || []}
                        selectedCategories={selectedCategories}
                        selectedFilters={selectedFilters}
                        onCategoryToggle={handleCategoryToggle}
                        onFilterToggle={handleFilterToggle}
                        onClearAll={clearAllFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategories.length > 0 || selectedFilters.length > 0) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategories.map(categorySlug => {
                  const category = categories?.find(c => c.slug === categorySlug)
                  return (
                    <Badge key={categorySlug} variant="secondary" className="cursor-pointer" onClick={() => handleCategoryToggle(categorySlug)}>
                      {category?.name} ×
                    </Badge>
                  )
                })}
                {selectedFilters.map(filter => (
                  <Badge key={filter} variant="secondary" className="cursor-pointer" onClick={() => handleFilterToggle(filter)}>
                    {t(`catalogue.filter.${filter}`)} ×
                  </Badge>
                ))}
              </div>
            )}

            {/* Products Display */}
            {allProducts.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">{t("catalogue.noProducts")}</h3>
                <p className="text-muted-foreground mb-6">{t("catalogue.noProductsDesc")}</p>
                <Button onClick={clearAllFilters}>{t("catalogue.clearFilters")}</Button>
              </div>
            ) : (
              <>
                <ProductGrid products={allProducts} />

                {/* Infinite Scroll Trigger */}
                <div ref={loadMoreRef} className="flex justify-center py-8">
                  {isFetchingNextPage && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>{t("catalogue.loadingMore")}</span>
                    </div>
                  )}
                  {!hasNextPage && allProducts.length > 0 && (
                    <div className="text-center text-muted-foreground">
                      <p>{t("catalogue.allProductsLoaded")}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

// Filter Content Component
interface FilterContentProps {
  categories: any[]
  selectedCategories: string[]
  selectedFilters: string[]
  onCategoryToggle: (categorySlug: string) => void
  onFilterToggle: (filter: string) => void
  onClearAll: () => void
}

const FilterContent = ({
  categories,
  selectedCategories,
  selectedFilters,
  onCategoryToggle,
  onFilterToggle,
  onClearAll
}: FilterContentProps) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{t("catalogue.filters")}</h3>
        <Button variant="ghost" size="sm" onClick={onClearAll}>
          {t("catalogue.clearAll")}
        </Button>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <h4 className="font-medium mb-3">{t("catalogue.categories")}</h4>
        <div className="space-y-2">
          {categories?.map(category => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={selectedCategories.includes(category.slug)}
                onCheckedChange={() => onCategoryToggle(category.slug)}
              />
              <Label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                {category.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Special Filters */}
      <div>
        <h4 className="font-medium mb-3">{t("catalogue.specialFilters")}</h4>
        <div className="space-y-2">
          {["featured", "new", "sale"].map(filter => (
            <div key={filter} className="flex items-center space-x-2">
              <Checkbox
                id={`filter-${filter}`}
                checked={selectedFilters.includes(filter)}
                onCheckedChange={() => onFilterToggle(filter)}
              />
              <Label htmlFor={`filter-${filter}`} className="text-sm cursor-pointer">
                {t(`catalogue.filter.${filter}`)}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

