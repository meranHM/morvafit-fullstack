import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["fa", "en"],
  defaultLocale: "fa",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/about": "/about",
    "/blog": "/blog",
    "/login": "/login",
    "/signup": "/signup",
    "/verify-email": "/verify-email",
    "/contact": "/contact",
    "/shop": "/shop",
  },
})
