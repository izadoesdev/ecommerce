"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/client"
import { motion } from "framer-motion"
import { getProducts } from "@/lib/products"

interface SearchBarProps {
  onClose?: () => void
}

export function SearchBar({ onClose }: SearchBarProps) {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const router = useRouter()

  const handleSearch = async (term: string) => {
    setSearchTerm(term)

    if (term.length < 2) {
      setSearchResults([])
      return
    }

    // In a real app, this would be a server action or API call
    const products = await getProducts()
    const results = products
      .filter(
        (product) =>
          product.name.toLowerCase().includes(term.toLowerCase()) ||
          product.description.toLowerCase().includes(term.toLowerCase()),
      )
      .slice(0, 5) // Limit to 5 results

    setSearchResults(results)
  }

  const handleProductClick = (productId: string) => {
    router.push(`/product/${productId}`)
    setSearchTerm("")
    setSearchResults([])
    if (onClose) onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim().length > 0) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
      setSearchTerm("")
      setSearchResults([])
      if (onClose) onClose()
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center border-b border-gray-200 focus-within:border-gray-400 transition-colors dark:border-gray-700 dark:focus-within:border-gray-500">
          <Search className="h-5 w-5 text-gray-400 mx-2" />
          <Input
            type="text"
            placeholder={t("search.placeholder")}
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 py-2"
            autoFocus
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setSearchTerm("")
                setSearchResults([])
              }}
              className="mr-2"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-md z-10 mt-1 max-h-80 overflow-auto dark:bg-gray-900"
          >
            {searchResults.map((product) => (
              <div
                key={product.id}
                className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3 transition-colors dark:hover:bg-gray-800"
                onClick={() => handleProductClick(product.id)}
              >
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <h4 className="text-sm font-medium">{product.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">${product.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </form>
    </div>
  )
}

