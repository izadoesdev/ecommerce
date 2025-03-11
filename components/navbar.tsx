"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Search, Menu, X, Heart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { SearchBar } from "@/components/search-bar"
import { LanguageSelector } from "@/components/language-selector"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useTranslation } from "@/lib/i18n/client"

export function Navbar() {
  const { t } = useTranslation()
  const { itemCount } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isScrolled ? "py-3 bg-white/90 backdrop-blur-md shadow-sm dark:bg-black/90" : "py-5 bg-transparent",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-serif tracking-tight z-10">
          MAISON
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm hover:text-primary transition-colors">
            {t("nav.home")}
          </Link>
          <Link href="/category/all" className="text-sm hover:text-primary transition-colors">
            {t("nav.shop")}
          </Link>
          <Link href="/category/decor" className="text-sm hover:text-primary transition-colors">
            {t("nav.decor")}
          </Link>
          <Link href="/category/furniture" className="text-sm hover:text-primary transition-colors">
            {t("nav.furniture")}
          </Link>
          <Link href="/category/kitchen" className="text-sm hover:text-primary transition-colors">
            {t("nav.kitchen")}
          </Link>
        </nav>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-1 md:space-x-2 z-10">
          <LanguageSelector />

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="relative"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="relative hidden sm:flex" aria-label="Wishlist" asChild>
            <Link href="/wishlist">
              <Heart className="h-5 w-5" />
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="relative hidden sm:flex" aria-label="Account" asChild>
            <Link href="/account">
              <User className="h-5 w-5" />
            </Link>
          </Button>

          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {itemCount}
                </motion.span>
              )}
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white shadow-md py-4 px-4 dark:bg-gray-900"
          >
            <SearchBar onClose={() => setIsSearchOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white z-40 pt-20 px-6 flex flex-col items-center dark:bg-gray-900"
          >
            <div className="space-y-6 text-center">
              <Link href="/" className="block text-lg font-medium py-2" onClick={() => setIsMobileMenuOpen(false)}>
                {t("nav.home")}
              </Link>
              <Link
                href="/category/all"
                className="block text-lg font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.shop")}
              </Link>
              <Link
                href="/category/decor"
                className="block text-lg font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.decor")}
              </Link>
              <Link
                href="/category/furniture"
                className="block text-lg font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.furniture")}
              </Link>
              <Link
                href="/category/kitchen"
                className="block text-lg font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("nav.kitchen")}
              </Link>
              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <Link href="/account" className="block text-base py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("nav.account")}
                </Link>
                <Link href="/wishlist" className="block text-base py-2" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("nav.wishlist")}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

