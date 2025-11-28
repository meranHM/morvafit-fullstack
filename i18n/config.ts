export const locales = ["fa", "en"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "fa"

export const localeNames: Record<Locale, string> = {
  fa: "فارسی",
  en: "English",
}

export const localeDirections: Record<Locale, "rtl" | "ltr"> = {
  fa: "rtl",
  en: "ltr",
}

// Namespaces for organized translations
export const namespaces = ["common", "chat", "invoice", "forms", "errors"] as const

export type Namespace = (typeof namespaces)[number]
