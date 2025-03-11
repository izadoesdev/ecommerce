"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n/client"

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { t } = useTranslation()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-32 text-center">
      <h1 className="text-5xl font-serif mb-6 text-primary">
        {t("error.somethingWentWrong", "Something went wrong")}
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        {t("error.tryAgainMessage", "We apologize for the inconvenience. Please try again or return home.")}
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={reset} variant="outline" className="rounded-full px-6">
          {t("error.tryAgain", "Try again")}
        </Button>
        <Link href="/">
          <Button className="rounded-full px-6">
            {t("error.returnHome", "Return home")}
          </Button>
        </Link>
      </div>
    </div>
  )
} 