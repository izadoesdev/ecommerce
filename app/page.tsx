"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { Search, Grid, List, SlidersHorizontal, Loader2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductSkeleton } from "@/components/product-skeleton"
import { trpc } from "@/lib/trpc/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/lib/i18n/client"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useDebounce } from "@/hooks/use-debounce"

const PRODUCTS_PER_PAGE = 12

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
          <div className="text-center mb-8 pt-12">
            <h1 className="text-4xl font-serif mb-4">{t("catalogue.title")}</h1>
            <p className="text-muted-foreground">{t("catalogue.loading")}</p>
          </div>
          <ProductSkeleton count={12} />
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

      <main className="container mx-auto px-4 py-8">
        {/* Catalogue Header */}
        <div className="text-center mb-12 pt-12">
          <h1 className="text-4xl font-serif mb-4">{t("catalogue.title")}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("catalogue.subtitle")}
          </p>
        </div>

        {/* Search and Filters Bar */}
        <Card className="mb-8 mt-12">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("catalogue.searchPlaceholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">{t("catalogue.sort.newest")}</SelectItem>
                  <SelectItem value="oldest">{t("catalogue.sort.oldest")}</SelectItem>
                  <SelectItem value="price-low">{t("catalogue.sort.priceLow")}</SelectItem>
                  <SelectItem value="price-high">{t("catalogue.sort.priceHigh")}</SelectItem>
                  <SelectItem value="name">{t("catalogue.sort.name")}</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filters */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
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

              {/* View Mode Toggle */}
              <div className="flex border rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-3"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

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
            {/* Results Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  {t("catalogue.showing")} {allProducts.length} {t("catalogue.of")} {totalProducts} {t("catalogue.products")}
                </p>
                {(selectedCategories.length > 0 || selectedFilters.length > 0 || searchQuery) && (
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    {t("catalogue.clearFilters")}
                  </Button>
                )}
              </div>

              {/* Active Filters */}
              {(selectedCategories.length > 0 || selectedFilters.length > 0) && (
                <div className="flex flex-wrap gap-2">
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
            </div>

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

