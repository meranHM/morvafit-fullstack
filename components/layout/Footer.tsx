"use client"

import Image from "next/image"
import Link from "next/link"
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin, Heart, ArrowUp } from "lucide-react"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import ScrollVelocity from "../ScrollVelocity"

const Footer = () => {
  const t = useTranslations("Footer")
  const [showScrollTop, setShowScrollTop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const footerLinks = {
    company: [
      { label: t("about") || "About Us", href: "/about" },
      { label: t("services") || "Services", href: "/services" },
      { label: t("testimonials") || "Testimonials", href: "/testimonials" },
      { label: t("blog") || "Blog", href: "/blog" },
    ],
    support: [
      { label: t("faq") || "FAQ", href: "/faq" },
      { label: t("contact") || "Contact", href: "/contact" },
      { label: t("pricing") || "Pricing", href: "/pricing" },
      { label: t("help") || "Help Center", href: "/help" },
    ],
    legal: [
      { label: t("privacy") || "Privacy Policy", href: "/privacy" },
      { label: t("terms") || "Terms of Service", href: "/terms" },
      { label: t("cookies") || "Cookie Policy", href: "/cookies" },
    ],
  }

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://instagram.com",
      label: "Instagram",
      color: "hover:text-pink-500",
    },
    {
      icon: Facebook,
      href: "https://facebook.com",
      label: "Facebook",
      color: "hover:text-blue-500",
    },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube", color: "hover:text-red-500" },
  ]

  const contactInfo = [
    { icon: Mail, text: "morvafitness@gmail.com", href: "mailto:morvafitness@gmail.com" },
    { icon: Phone, text: "+971 (58) 849-8855", href: "tel:+971588498855" },
    { icon: MapPin, text: "Dubai, UAE", href: "#" },
  ]

  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-linear-to-br from-gray-50 via-white to-rose-50/30 ">
      <div className="py-6 md:py-10 lg:py-16">
        <ScrollVelocity
          texts={["KEEP MOVING · ", "KEEP GROWING · ", "KEEP SHOWING UP"]}
          velocity={50}
          className="custom-scroll-text"
        />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4"
          >
            <Link href="/" className="inline-block mb-6">
              <Image
                className="object-contain h-24 w-auto"
                width={250}
                height={120}
                src="/morvafit-logo-black.svg"
                alt="Morvafit Logo"
              />
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-6 max-w-sm">
              {t("description") ||
                "Transform your body and mind with personalized fitness coaching. Your journey to a healthier, stronger you starts here."}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className={`p-2.5 rounded-xl border border-gray-200 text-gray-600 transition-all duration-300 hover:border-rose-300 hover:bg-rose-50 ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wider mb-4">
              {t("company") || "Company"}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-900 text-sm hover:text-rose-600 transition-colors duration-300 inline-block hover:translate-x-1 transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wider mb-4">
              {t("support") || "Support"}
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-800 text-sm hover:text-rose-600 transition-colors duration-300 inline-block hover:translate-x-1 transform"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-4"
          >
            <h3 className="text-gray-900 font-semibold text-sm uppercase tracking-wider mb-4">
              {t("getInTouch") || "Get in Touch"}
            </h3>
            <ul className="space-y-3">
              {contactInfo.map(item => (
                <li key={item.text}>
                  <a
                    href={item.href}
                    className="flex items-center gap-3 text-gray-600 text-sm hover:text-rose-600 transition-colors duration-300 group"
                  >
                    <span className="p-2 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-rose-50 group-hover:text-rose-600 transition-all duration-300">
                      <item.icon size={16} />
                    </span>
                    <span>{item.text}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-gray-600 text-sm mb-3">
                {t("newsletter") || "Subscribe to our newsletter"}
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent transition-all duration-300"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-2 rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-white text-sm font-medium hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-rose-500/25"
                >
                  {t("subscribe") || "Subscribe"}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-8 border-t border-gray-200"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-gray-500 text-sm flex items-center gap-1">
              © {currentYear} MorvaFit. Made with{" "}
              <Heart size={14} className="text-rose-500 fill-rose-500 inline" /> for your fitness
              journey
            </p>

            {/* Legal Links */}
            <div className="flex items-center gap-6">
              {footerLinks.legal.map((link, i) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-800 text-sm hover:text-rose-600 transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: showScrollTop ? 1 : 0,
          scale: showScrollTop ? 1 : 0.8,
          y: showScrollTop ? 0 : 20,
        }}
        transition={{ duration: 0.3 }}
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 transition-all duration-300 z-40 ${
          showScrollTop ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp size={20} />
      </motion.button>
    </footer>
  )
}

export default Footer
