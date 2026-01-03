"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertTriangle, Mail, X, Loader2 } from "lucide-react"

interface EmailVerificationBannerProps {
  email: string
}

const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({ email }) => {
  const [isResending, setIsResending] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isDismissed, setIsDismissed] = useState(false)

  const handleResendEmail = async () => {
    setIsResending(true)
    setMessage(null)

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: data.message })
      } else {
        setMessage({ type: "error", text: data.error })
      }
    } catch (error) {
      setMessage({ type: "error", text: "Failed to resend email. Please try again." })
    } finally {
      setIsResending(false)
    }
  }

  if (isDismissed) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200"
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-amber-800">Verify your email address</h3>
          <p className="text-sm text-amber-700 mt-1">
            We sent a verification link to <strong>{email}</strong>. Please verify your email to
            access all features including payment submission.
          </p>

          {message && (
            <p
              className={`text-sm mt-2 ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}

          <button
            onClick={handleResendEmail}
            disabled={isResending}
            className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-200 text-amber-800 font-medium hover:bg-amber-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Resend verification email
              </>
            )}
          </button>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="shrink-0 p-1 rounded-lg hover:bg-amber-100 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-5 h-5 text-amber-600" />
        </button>
      </div>
    </motion.div>
  )
}

export default EmailVerificationBanner
