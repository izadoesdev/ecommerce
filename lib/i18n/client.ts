"use client"

import { useEffect, useState } from "react"
import i18next from "i18next"
import { initReactI18next, useTranslation as useTranslationOrg } from "react-i18next"
import resourcesToBackend from "i18next-resources-to-backend"
import { getOptions } from "./settings"
import { getCookie } from "@/lib/cookies"

// Initialize i18next for client-side
i18next
  .use(initReactI18next)
  .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
  .init({
    ...getOptions(),
    lng: getCookie("NEXT_LOCALE") || "en",
    preload: ["en", "fr", "es", "ar"],
  })

export function useTranslation(ns = "common", options: { keyPrefix?: string } = {}) {
  const [mounted, setMounted] = useState(false)
  const ret = useTranslationOrg(ns, options)

  // Set up RTL for Arabic
  useEffect(() => {
    if (ret.i18n.language === "ar") {
      document.documentElement.dir = "rtl"
    } else {
      document.documentElement.dir = "ltr"
    }
  }, [ret.i18n.language])

  // When mounted on client, we can show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return ret

  return ret
}

