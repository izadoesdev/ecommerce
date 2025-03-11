"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/types"
import { useTranslation } from "@/lib/i18n/client"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface ProductGridProps {
  products: Product[]
  category?: string
  showSorting?: boolean
}

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "name-a-z", label: "Name: A to Z" },
  { value: "name-z-a", label: "Name: Z to A" },
]

export function ProductGrid({ products: initialProducts, category, showSorting = true }: ProductGridProps) {
  const { t } = useTranslation()
  const [sortOption, setSortOption] = useState("newest")
  const [displayCount, setDisplayCount] = useState(8)
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1024)
  const [products, setProducts] = useState<Product[]>([...initialProducts])
  
  // Filter states
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>(category ? [category] : [])
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [showOnlySale, setShowOnlySale] = useState(false)
  const [showOnlyNew, setShowOnlyNew] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)

  // Get unique categories and price range from products
  const allCategories = Array.from(new Set(initialProducts.map(p => p.category)))
  const maxPrice = Math.max(...initialProducts.map(p => p.price))
  
  useEffect(() => {
    if (maxPrice > 0 && priceRange[1] === 1000) {
      setPriceRange([0, maxPrice])
    }
  }, [maxPrice])

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    // Reset display count and selected categories when category or products change
    setDisplayCount(8)
    if (category) {
      setSelectedCategories([category])
    } else {
      setSelectedCategories([])
    }
  }, [initialProducts, category])

  useEffect(() => {
    // Apply filters and sorting
    let filteredProducts = [...initialProducts]
    
    // Apply price filter
    filteredProducts = filteredProducts.filter(product => {
      const price = product.salePrice || product.price
      return price >= priceRange[0] && price <= priceRange[1]
    })
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        selectedCategories.includes(product.category)
      )
    }
    
    // Apply stock filter
    if (showOnlyInStock) {
      filteredProducts = filteredProducts.filter(product => 
        product.stock === undefined || product.stock > 0
      )
    }
    
    // Apply sale filter
    if (showOnlySale) {
      filteredProducts = filteredProducts.filter(product => product.sale)
    }
    
    // Apply new arrivals filter
    if (showOnlyNew) {
      filteredProducts = filteredProducts.filter(product => product.newArrival)
    }

    // Count active filters
    let filterCount = 0
    if (priceRange[0] > 0 || priceRange[1] < maxPrice) filterCount++
    if (selectedCategories.length > 0) filterCount++
    if (showOnlyInStock) filterCount++
    if (showOnlySale) filterCount++
    if (showOnlyNew) filterCount++
    setActiveFilters(filterCount)
    
    // Apply sorting
    switch (sortOption) {
      case "price-low-high":
        filteredProducts.sort((a, b) => {
          const aPrice = a.salePrice || a.price
          const bPrice = b.salePrice || b.price
          return aPrice - bPrice
        })
        break
      case "price-high-low":
        filteredProducts.sort((a, b) => {
          const aPrice = a.salePrice || a.price
          const bPrice = b.salePrice || b.price
          return bPrice - aPrice
        })
        break
      case "name-a-z":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-z-a":
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        // newest - no sorting needed as the API returns newest first
        break
    }

    setProducts(filteredProducts)
  }, [sortOption, initialProducts, priceRange, selectedCategories, showOnlyInStock, showOnlySale, showOnlyNew, maxPrice])

  const getGridColumns = () => {
    if (windowWidth < 640) return 2 // mobile
    if (windowWidth < 1024) return 3 // tablet
    return 4 // desktop
  }

  const displayedProducts = products.slice(0, displayCount)
  const hasMoreProducts = displayCount < products.length

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + getGridColumns() * 2)
  }

  const handleSortChange = (value: string) => {
    setSortOption(value)
  }

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    )
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
  }

  const resetFilters = () => {
    setPriceRange([0, maxPrice])
    setSelectedCategories([])
    setShowOnlyInStock(false)
    setShowOnlySale(false)
    setShowOnlyNew(false)
  }

  const currentSortOption = sortOptions.find((option) => option.value === sortOption) || sortOptions[0]

  return (
    <div className="w-full">
      {/* Header with product count, filtering and sorting */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {products.length} {products.length === 1 ? t("product.item") : t("product.items")}
          </p>
          
          {activeFilters > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={resetFilters}
              className="h-8 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              {t("product.clearFilters")}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="h-4 w-4 mr-2" />
                {t("product.filter")}
                {activeFilters > 0 && (
                  <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {activeFilters}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>{t("product.filters")}</SheetTitle>
              </SheetHeader>
              <div className="py-6">
                <div className="space-y-6">
                  {/* Price Range Filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-4">{t("product.priceRange")}</h3>
                    <div className="px-2">
                      <Slider
                        defaultValue={priceRange}
                        min={0}
                        max={maxPrice}
                        step={1}
                        value={priceRange}
                        onValueChange={handlePriceChange}
                        className="mb-6"
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-sm">${priceRange[0]}</span>
                        <span className="text-sm">${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Categories Filter */}
                  <div>
                    <h3 className="text-sm font-medium mb-4">{t("product.categories")}</h3>
                    <ScrollArea className="h-[180px] pr-4">
                      <div className="space-y-3">
                        {allCategories.map(cat => (
                          <div key={cat} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`category-${cat}`} 
                              checked={selectedCategories.includes(cat)}
                              onCheckedChange={() => handleCategoryToggle(cat)}
                            />
                            <label
                              htmlFor={`category-${cat}`}
                              className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {cat}
                            </label>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  
                  <Separator />
                  
                  {/* Availability Filters */}
                  <div>
                    <h3 className="text-sm font-medium mb-4">{t("product.availability")}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="in-stock" 
                          checked={showOnlyInStock}
                          onCheckedChange={(checked) => setShowOnlyInStock(!!checked)}
                        />
                        <label
                          htmlFor="in-stock"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t("product.inStock")}
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="on-sale" 
                          checked={showOnlySale}
                          onCheckedChange={(checked) => setShowOnlySale(!!checked)}
                        />
                        <label
                          htmlFor="on-sale"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t("product.onSale")}
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="new-arrival" 
                          checked={showOnlyNew}
                          onCheckedChange={(checked) => setShowOnlyNew(!!checked)}
                        />
                        <label
                          htmlFor="new-arrival"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {t("product.newArrivals")}
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={resetFilters} variant="outline" className="w-full">
                      {t("product.resetFilters")}
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {showSorting && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="text-sm h-9 px-3">
                  <span>
                    {t("product.sortBy")}: {t(`product.sort.${currentSortOption.value}`)}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className="flex items-center justify-between"
                  >
                    {t(`product.sort.${option.value}`)}
                    {option.value === sortOption && <Check className="h-4 w-4" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Active filters display */}
      {activeFilters > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {priceRange[0] > 0 || priceRange[1] < maxPrice ? (
            <Badge variant="secondary" className="flex items-center gap-1">
              ${priceRange[0]} - ${priceRange[1]}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => setPriceRange([0, maxPrice])} 
              />
            </Badge>
          ) : null}
          
          {selectedCategories.map(cat => (
            <Badge key={cat} variant="secondary" className="flex items-center gap-1">
              {cat}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleCategoryToggle(cat)} 
              />
            </Badge>
          ))}
          
          {showOnlyInStock && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {t("product.inStock")}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => setShowOnlyInStock(false)} 
              />
            </Badge>
          )}
          
          {showOnlySale && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {t("product.onSale")}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => setShowOnlySale(false)} 
              />
            </Badge>
          )}
          
          {showOnlyNew && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {t("product.newArrivals")}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => setShowOnlyNew(false)} 
              />
            </Badge>
          )}
        </div>
      )}

      {/* Product grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {displayedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          {/* Load more button */}
          {hasMoreProducts && (
            <div className="mt-12 text-center">
              <Button variant="outline" onClick={handleLoadMore} className="px-8">
                {t("product.loadMore")}
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="py-16 text-center">
          <p className="text-gray-500 dark:text-gray-400">{t("product.noProducts")}</p>
        </div>
      )}
    </div>
  )
}

