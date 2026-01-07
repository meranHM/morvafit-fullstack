import type { Metadata, Viewport } from "next"
import { Montserrat, Vazirmatn } from "next/font/google"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { locales, localeDirections } from "@/i18n/config"
import { routing } from "@/i18n/routing"
import { notFound } from "next/navigation"
import LenisProvider from "@/components/providers/LenisProvider"
import AuthProvider from "@/components/providers/AuthProvider"
import "@/styles/globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["400", "500", "600", "700"],
})

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  variable: "--font-vazirmatn",
  display: "swap",
  weight: ["400", "500", "700"],
})

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export const metadata: Metadata = {
  title: "morvafit",
  description:
    "Fitness & Pilates expert, certified health coach, and dancer. I offer personalized, dynamic training programs to help you achieve your fitness goals.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

export const viewport: Viewport = {
  themeColor: "#f6eaea",
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  // Validating locale
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const direction = localeDirections[locale as keyof typeof localeDirections]

  return (
    <html
      lang={locale}
      dir={direction}
      className={locale === "fa" ? vazirmatn.className : montserrat.className}
    >
      <body>
        <AuthProvider>
          <LenisProvider>
            <NextIntlClientProvider>{children}</NextIntlClientProvider>
          </LenisProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
