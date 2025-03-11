import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/lib/i18n"

export async function ServerFooter() {
  const { t } = await useTranslation()

  return (
    <footer className="pt-16 pb-8 border-t border-gray-100 dark:border-gray-800">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div>
              <h3 className="text-xl font-light mb-6">MAISON</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">{t("footer.storeDescription")}</p>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">{t("footer.shop")}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/category/all"
                  className="text-sm text-gray-500 hover:text-black transition-colors dark:text-gray-400 dark:hover:text-white"
                >
                  {t("footer.allProducts")}
                </Link>
              </li>
              <li>
                <Link
                  href="/category/decor"
                  className="text-sm text-gray-500 hover:text-black transition-colors dark:text-gray-400 dark:hover:text-white"
                >
                  {t("footer.decor")}
                </Link>
              </li>
              <li>
                <Link
                  href="/category/furniture"
                  className="text-sm text-gray-500 hover:text-black transition-colors dark:text-gray-400 dark:hover:text-white"
                >
                  {t("footer.furniture")}
                </Link>
              </li>
              <li>
                <Link
                  href="/category/kitchen"
                  className="text-sm text-gray-500 hover:text-black transition-colors dark:text-gray-400 dark:hover:text-white"
                >
                  {t("footer.kitchen")}
                </Link>
              </li>
              <li>
                <Link
                  href="/category/textiles"
                  className="text-sm text-gray-500 hover:text-black transition-colors dark:text-gray-400 dark:hover:text-white"
                >
                  {t("footer.textiles")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">{t("footer.newsletter")}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t("footer.newsletterDesc")}</p>
            <div className="flex gap-2">
              <Input placeholder={t("footer.emailPlaceholder")} className="h-10" />
              <Button variant="default" size="sm" className="h-10">
                {t("footer.subscribe")}
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400">{t("footer.copyright")}</p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-gray-400 hover:text-black transition-colors dark:hover:text-white">
              {t("footer.privacyPolicy")}
            </Link>
            <Link href="#" className="text-xs text-gray-400 hover:text-black transition-colors dark:hover:text-white">
              {t("footer.termsOfService")}
            </Link>
            <Link href="#" className="text-xs text-gray-400 hover:text-black transition-colors dark:hover:text-white">
              {t("footer.shippingPolicy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

