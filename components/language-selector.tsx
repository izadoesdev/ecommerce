"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useTranslation } from "@/lib/i18n/client"
import { setCookie } from "@/lib/cookies"

export function LanguageSelector() {
  const { i18n, t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const changeLanguage = (lng: string) => {
    // Set language cookie
    setCookie("NEXT_LOCALE", lng, 365)

    // Change language
    i18n.changeLanguage(lng)

    // Close dropdown
    setIsOpen(false)

    // Refresh the page to apply language change
    router.refresh()
  }

  const languages = [
    { code: "en", name: t("language.en"), dir: "ltr" },
    { code: "fr", name: t("language.fr"), dir: "ltr" },
    { code: "es", name: t("language.es"), dir: "ltr" },
    { code: "ar", name: t("language.ar"), dir: "rtl" },
  ]

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-8 h-8">
          <Globe className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`${i18n.language === language.code ? "font-medium" : ""}`}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

