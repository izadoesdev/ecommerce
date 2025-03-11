"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/client"
import { motion } from "framer-motion"

export function HeroSection() {
  const { t } = useTranslation()

  return (
    <div className="relative min-h-[90vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80"
          alt="Modern interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-xl"
        >
          <span className="inline-block text-sm uppercase tracking-wider mb-4 bg-primary/90 text-white px-3 py-1 rounded-full">
            {t("home.newCollection")}
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif mb-4 leading-tight">{t("home.heroTitle")}</h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 font-light">{t("home.heroSubtitle")}</p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="rounded-full px-8" asChild>
              <Link href="/category/all">{t("home.shopNow")}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white hover:text-black rounded-full px-8"
              asChild
            >
              <Link href="/category/new-arrivals">{t("home.newArrivals")}</Link>
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex gap-2"
        >
          <span className="w-2 h-2 bg-white rounded-full opacity-60"></span>
          <span className="w-2 h-2 bg-white rounded-full opacity-80"></span>
          <span className="w-8 h-2 bg-primary rounded-full"></span>
          <span className="w-2 h-2 bg-white rounded-full opacity-80"></span>
          <span className="w-2 h-2 bg-white rounded-full opacity-60"></span>
        </motion.div>
      </div>
    </div>
  )
}

