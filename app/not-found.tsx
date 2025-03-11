import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"

export default async function NotFound() {
  const { t } = await useTranslation()

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-32 text-center">
        <h1 className="text-6xl font-serif mb-6">404</h1>
        <h2 className="text-2xl font-medium mb-4">{t("error.notFound")}</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">{t("error.notFoundMessage")}</p>
        <Link href="/">
          <Button className="rounded-full px-6">{t("error.returnHome")}</Button>
        </Link>
      </div>
      <Footer />
    </>
  )
}

