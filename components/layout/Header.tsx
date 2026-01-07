"use client"

import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { User2Icon, Menu, X, LogOut, Sparkles } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { routing } from "@/i18n/routing"
import { useSession, signOut } from "next-auth/react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type AppPathnames = keyof typeof routing.pathnames

type NavLink = {
  key: string
  label: string
  href: AppPathnames
}

const Header = () => {
  const t = useTranslations("Navbar")
  const { data: session, status } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeLink, setActiveLink] = useState("")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [mobileMenuOpen])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

  const navLinks: NavLink[] = [
    { href: "/", label: t("home"), key: "home" },
    { href: "/about", label: t("about"), key: "about" },
    { href: "/shop", label: t("shop"), key: "shop" },
    { href: "/blog", label: t("blog"), key: "blog" },
    { href: "/contact", label: t("contact"), key: "contact" },
  ]

  const logoSrc = isScrolled ? "/morvafit-logo-black.svg" : "/morvafit-logo-white.svg"

  // Getting user initials for the avatar
  const getUserInitials = () => {
    if (!session?.user?.name) return "U"
    return session.user.name.slice(0, 2).toUpperCase()
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-background/60 backdrop-blur-lg shadow-lg shadow-black/5"
            : "bg-transparent"
        } ${mobileMenuOpen ? "md:block hidden" : ""}`}
      >
        {/* Gradient accent line */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-rose-400/40 to-transparent transition-opacity duration-500 ${
            isScrolled ? "opacity-100" : "opacity-0"
          }`}
        />

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              <Link href="/" className="block">
                <Image
                  className="object-contain h-25 w-auto"
                  width={200}
                  height={100}
                  src={logoSrc}
                  alt="Morvafit Logo"
                  priority
                />
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.key}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onMouseEnter={() => setActiveLink(link.key)}
                    onMouseLeave={() => setActiveLink("")}
                    className={`relative px-4 py-2 text-md font-medium transition-colors duration-300 hover:text-rose-600 group ${
                      isScrolled ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {link.label}
                    <motion.span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-rose-400 to-pink-500 rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{
                        scaleX: activeLink === link.key ? 1 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {/* Show different UI based on auth status */}
                {status === "loading" ? (
                  // Loading skeleton
                  <div className="w-10 h-10 rounded-full bg-gray-300/30 animate-pulse" />
                ) : session ? (
                  // Logged in
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="relative group outline-none">
                        {/* Animated glow ring */}
                        <div className="absolute -inset-1 bg-linear-to-r from-rose-500 via-pink-500 to-rose-500 rounded-full opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />

                        {/* Avatar container */}
                        <div className="relative w-10 h-10 rounded-full bg-linear-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-lg transition-transform duration-300 group-hover:scale-110">
                          {getUserInitials()}
                        </div>

                        {/* Sparkle indicator */}
                        <motion.div
                          className="absolute -top-1 -right-1"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        >
                          <Sparkles size={14} className="text-yellow-400 drop-shadow-lg" />
                        </motion.div>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="px-3 py-2">
                        <p className="text-sm font-medium">{session.user?.name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.user?.email}
                        </p>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link href="/dashboard" className="flex items-center">
                          <User2Icon className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                        onClick={() => signOut({ callbackUrl: "/" })}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  // Not logged in - Show regular profile link
                  <Link
                    href="/dashboard"
                    className={`relative p-2.5 rounded-xl transition-all duration-300 hover:text-rose-600 group overflow-hidden ${
                      isScrolled ? "text-gray-700" : "text-white"
                    }`}
                  >
                    <User2Icon size={24} className="relative z-10" />
                  </Link>
                )}
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative z-10 p-2 rounded-xl border border-gray-200 text-gray-700 transition-all duration-300 hover:border-rose-300 hover:bg-rose-50"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 md:hidden shadow-2xl"
            >
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-rose-400 via-pink-400 to-rose-400" />

              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <Image
                    className="object-contain h-30 w-auto"
                    width={250}
                    height={120}
                    src="/morvafit-logo-black.svg"
                    alt="Morvafit Logo"
                  />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-6">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.key}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center px-6 py-4 text-lg font-medium text-gray-700 hover:bg-linear-to-r hover:from-rose-50 hover:to-pink-50 hover:text-rose-600 transition-all duration-300 border-l-4 border-transparent hover:border-rose-400"
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Action Buttons */}
                <div className="p-6 border-t border-gray-100 space-y-3">
                  {session ? (
                    // Logged in state for mobile
                    <>
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                      >
                        {/* User info card */}
                        <div className="flex items-center gap-3 p-3 bg-linear-to-r from-rose-50 to-pink-50 rounded-xl mb-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-linear-to-r from-rose-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                              {getUserInitials()}
                            </div>
                            <Sparkles
                              size={12}
                              className="absolute -top-1 -right-1 text-yellow-400"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {session.user?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                          </div>
                        </div>

                        <Link
                          href="/dashboard"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center justify-center gap-3 w-full px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300"
                        >
                          <User2Icon size={20} />
                          <span>Dashboard</span>
                        </Link>
                      </motion.div>

                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                      >
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false)
                            signOut({ callbackUrl: "/" })
                          }}
                          className="flex items-center justify-center gap-3 w-full px-6 py-3 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-all duration-300"
                        >
                          <LogOut size={20} />
                          <span>Log out</span>
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    // Not logged in state for mobile
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-3 w-full px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600 transition-all duration-300"
                      >
                        <User2Icon size={20} />
                        <span>Profile</span>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Header
