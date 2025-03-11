import { createInstance } from "i18next"
import resourcesToBackend from "i18next-resources-to-backend"
import { initReactI18next } from "react-i18next/initReactI18next"
import { getOptions } from "./settings"
import { cookies } from "next/headers"

const initI18next = async (lng: string, ns: string) => {
  const i18nInstance = createInstance()
  await i18nInstance
    .use(initReactI18next)
    .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
    .init(getOptions(lng, ns))

  return i18nInstance
}

export async function useTranslation(ns = "common", options: { keyPrefix?: string } = {}) {
  // This function should only be used in Server Components
  let lng: string

  try {
    // Try to get the locale from cookies
    const cookieStore = await cookies()
    const locale = cookieStore.get("NEXT_LOCALE")
    lng = locale?.value || "en"
  } catch (error) {
    // If cookies() fails (client component), fallback to default
    lng = "en"
  }

  const i18nextInstance = await initI18next(lng, ns)

  return {
    t: i18nextInstance.getFixedT(lng, ns, options.keyPrefix),
    i18n: i18nextInstance,
  }
}

