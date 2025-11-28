import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, User2Icon } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"

const Header = () => {
  const t = useTranslations("Navbar")
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Trigger glass effect when scrolled beyond 0
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className="w-full sticky top-0 right-0 left-0 z-50">
      {/* Glass blur backdrop */}
      <div
        className="absolute inset-0 backdrop-blur-md transition-opacity duration-300 ease-out"
        style={{
          opacity: isScrolled ? 1 : 0,
          pointerEvents: "none",
        }}
      />

      {/* Semi-transparent overlay for depth */}
      <div
        className="absolute inset-0 bg-white/5 transition-opacity duration-300 ease-out"
        style={{
          opacity: isScrolled ? 1 : 0,
          pointerEvents: "none",
        }}
      />

      {/* Subtle border gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transition-opacity duration-300 ease-out"
        style={{
          opacity: isScrolled ? 1 : 0,
        }}
      />

      {/* Content */}
      <div className="relative w-full max-w-7xl mx-auto p-4 flex items-center justify-between">
        <div className="w-30 h-10">
          <Image
            className="object-cover size-full"
            width={120}
            height={48}
            src="/morvafit-logo.svg"
            alt="Morvafit Logo"
            priority
          />
        </div>

        <nav className="flex gap-2 items-center justify-center p-4 space-x-4 font-medium rounded-lg">
          <Link
            href="/"
            className="hover:bg-white/10 rounded-md px-2 py-1 transition-colors duration-200"
          >
            {t("home")}
          </Link>
          <Link
            href="/"
            className="hover:bg-white/10 rounded-md px-2 py-1 transition-colors duration-200"
          >
            {t("about")}
          </Link>
          <Link
            href="/"
            className="hover:bg-white/10 rounded-md px-2 py-1 transition-colors duration-200"
          >
            {t("shop")}
          </Link>
          <Link
            href="/"
            className="hover:bg-white/10 rounded-md px-2 py-1 transition-colors duration-200"
          >
            {t("blog")}
          </Link>
          <Link
            href="/"
            className="hover:bg-white/10 rounded-md px-2 py-1 transition-colors duration-200"
          >
            {t("contact")}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/profile"
            className="border border-gray-300 p-2 rounded-md hover:bg-white/10 hover:border-white/50 transition-all duration-200"
          >
            <User2Icon size={24} />
          </Link>

          <Link
            href="/shop"
            className="border border-gray-300 p-2 rounded-md hover:bg-white/10 hover:border-white/50 transition-all duration-200"
          >
            <ShoppingBag size={24} />
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
