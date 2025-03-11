"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-6xl font-serif mb-6 text-primary">500</h1>
          <h2 className="text-2xl font-medium mb-4">Server Error</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            We apologize for the inconvenience. Our server encountered an error and could not complete your request.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={reset} variant="outline" className="rounded-full px-6">
              Try again
            </Button>
            <Link href="/">
              <Button className="rounded-full px-6">
                Return home
              </Button>
            </Link>
          </div>
        </div>
      </body>
    </html>
  )
} 