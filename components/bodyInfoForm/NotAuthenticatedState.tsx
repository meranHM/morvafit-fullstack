"use client"

import { User } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"

const NotAuthenticatedState = () => {
  const t = useTranslations("UserForm")
  const router = useRouter()

  return (
    <section
      id="contact-form"
      className="py-24 px-4"
      style={{ background: "oklch(0.2389 0.0076 211.07)" }}
    >
      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center bg-linear-to-r from-rose-500 to-pink-500">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
            {t("authGate.title") || "Start Your Fitness Journey"}
          </h2>
          <p className="text-lg mb-8 opacity-80" style={{ color: "oklch(0.9465 0.013 17.39)" }}>
            {t("authGate.description") ||
              "Please sign in or create an account to access your personalize fitness assessment form."}
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-8 py-4 rounded-full font-semibold bg-linear-to-r from-rose-500 to-pink-500 text-white transition-all hover:scale-105"
          >
            {t("authGate.CTA") || "Sign In / Sign Up"}
          </button>
        </div>
      </div>
    </section>
  )
}

export default NotAuthenticatedState
