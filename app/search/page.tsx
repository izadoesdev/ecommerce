"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductSkeleton } from "@/components/product-skeleton"
import { trpc } from "@/lib/trpc/client"
import { useTranslation } from "@/lib/i18n/client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search as SearchIcon } from "lucide-react"

function SearchResults() {
  const { t } = useTranslation()
  const params = useSearchParams()
  const router = useRouter()

  const query = params.get("q") || ""
  const sortBy = params.get("sortBy") || "relevance"

  const { data: products, isLoading, isError } = trpc.products.search.useQuery(
    { query, sortBy: sortBy as any },
    { enabled: query.length > 0 }
  )

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(params.toString())
    newParams.set("sortBy", value)
    router.push(`/search?${newParams.toString()}`)
  }

  if (isLoading) {
    return <ProductSkeleton count={8} />
  }

  if (isError) {
    return <p className="text-center text-destructive">{t("search.error")}</p>
  }

  if (query && !products?.length) {
    return <p className="text-center text-muted-foreground">{t("search.noResults", { query })}</p>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-sm text-muted-foreground">
          {t("search.resultsCount", { count: products?.length || 0, query })}
        </p>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("search.sortBy")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">{t("search.sort.relevance")}</SelectItem>
            <SelectItem value="newest">{t("search.sort.newest")}</SelectItem>
            <SelectItem value="price-asc">{t("search.sort.price-asc")}</SelectItem>
            <SelectItem value="price-desc">{t("search.sort.price-desc")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ProductGrid products={products || []} />
    </div>
  )
}

export default function SearchPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(params.get("q") || "")

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-4xl font-serif text-center mb-4">{t("search.title")}</h1>
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search.placeholder")}
                className="pl-10 h-12 rounded-full"
              />
            </div>
            <Button type="submit" className="h-12 rounded-full px-8">
              {t("search.button")}
            </Button>
          </form>
        </div>

        <Suspense fallback={<ProductSkeleton count={8} />}>
          <SearchResults />
        </Suspense>
      </div>
      <Footer />
    </>
  )
}

