import { type NextRequest, NextResponse } from "next/server"
import { match } from "@formatjs/intl-localematcher"
import Negotiator from "negotiator"
import { languages, fallbackLng } from "@/lib/i18n/settings"

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => {
    negotiatorHeaders[key] = value
  })

  const locales = languages
  const detectedLanguages = new Negotiator({ headers: negotiatorHeaders }).languages()

  // Try to get locale from cookie first
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale
  }

  return match(detectedLanguages, locales, fallbackLng)
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  // Get locale from cookie or headers
  const locale = getLocale(request)

  // Set html lang attribute and dir attribute for RTL languages
  const response = NextResponse.next()
  response.headers.set("x-locale", locale)

  return response
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc)
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}

