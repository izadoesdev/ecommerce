"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FadeIn } from "@/components/animations/fade-in"
import { useTranslation } from "@/lib/i18n/client"

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="pt-16 pb-8 bg-accent/30 dark:bg-gray-900">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          <FadeIn className="md:col-span-4" delay={0.1}>
            <div>
              <h3 className="text-2xl font-serif mb-6">MAISON</h3>
              <p className="text-muted-foreground mb-6 max-w-xs">{t("footer.storeDescription")}</p>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white">
                  <Instagram className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary hover:text-white">
                  <Twitter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </FadeIn>

          <FadeIn className="md:col-span-2" delay={0.2}>
            <div>
              <h4 className="text-base font-medium mb-4">{t("footer.shop")}</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/category/all"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.allProducts")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/decor"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.decor")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/furniture"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.furniture")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/kitchen"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.kitchen")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/category/textiles"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {t("footer.textiles")}
                  </Link>
                </li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn className="md:col-span-2" delay={0.3}>
            <div>
              <h4 className="text-base font-medium mb-4">{t("footer.company")}</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("footer.aboutUs")}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("footer.contactUs")}
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("footer.blog")}
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {t("footer.careers")}
                  </Link>
                </li>
              </ul>
            </div>
          </FadeIn>

          <FadeIn className="md:col-span-4" delay={0.4}>
            <div>
              <h4 className="text-base font-medium mb-4">{t("footer.newsletter")}</h4>
              <p className="text-sm text-muted-foreground mb-4">{t("footer.newsletterDesc")}</p>
              <div className="flex gap-2">
                <Input placeholder={t("footer.emailPlaceholder")} className="h-10 rounded-full" />
                <Button variant="default" size="sm" className="h-10 rounded-full px-4">
                  {t("footer.subscribe")}
                </Button>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{t("footer.address")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{t("footer.phone")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <p className="text-sm text-muted-foreground">{t("footer.email")}</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">{t("footer.copyright")}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              {t("footer.privacyPolicy")}
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              {t("footer.termsOfService")}
            </Link>
            <Link href="/shipping" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              {t("footer.shippingPolicy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

