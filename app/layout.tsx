import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Lato } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/components/cart-provider"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
})

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-lato",
})

export const metadata: Metadata = {
  title: "MAISON - Beautiful Home Decor & Furnishings",
  description:
    "Discover beautiful home decor, furniture, and accessories for your modern lifestyle. Create a space that feels like home.",
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${playfair.variable} ${lato.variable}`}>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <CartProvider>
            <TooltipProvider>
              <main className="min-h-screen">{children}</main>
              <Toaster />
              <SonnerToaster />
            </TooltipProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'