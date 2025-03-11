import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"

export default async function ProductNotFound() {
  const { t } = await useTranslation()

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-6xl font-serif mb-6 text-primary">404</h1>
        <h2 className="text-2xl font-medium mb-4">{t("error.productNotFound", "Product Not Found")}</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {t("error.productNotFoundMessage", "The product you are looking for does not exist or has been removed.")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/category/all">
            <Button variant="outline" className="rounded-full px-6">
              {t("error.continueShopping", "Continue Shopping")}
            </Button>
          </Link>
          <Link href="/">
            <Button className="rounded-full px-6">{t("error.returnHome", "Return Home")}</Button>
          </Link>
        </div>
      </div>
      <Footer />
    </>
  )
} 