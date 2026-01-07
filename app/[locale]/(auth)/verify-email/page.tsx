"use client"

// ============================================
// EMAIL VERIFICATION PAGE
// ============================================
// This page handles the email verification when users click the magic link
// URL format: /verify-email?token=abc123
//
// Flow:
// 1. User receives email with magic link
// 2. User clicks link, comes to this page with token in URL
// 3. This page calls our API to verify the token
// 4. If successful, shows success message and redirects to dashboard
// 5. If failed, shows error message with option to request new link

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const VerifyEmail = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  // Getting the token from URL (example: /verify-email?token=abc123)
  const token = searchParams.get("token")

  // When this page loads, we immediately call the API to verify the token
  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("No verification token provided. Please check your email for the correct link.")
      return
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setStatus("success")
          setMessage(data.message || "Email verified successfully!")

          setTimeout(() => {
            router.push("/dashboard")
          }, 3000)
        } else {
          setStatus("error")
          setMessage(data.error || "Failed to verify email. The link may have expired.")
        }
      } catch (error) {
        setStatus("error")
        setMessage("An error occurred while verifying your email. Please try again.")
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-rose-50/30 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-10 max-w-md w-full text-center"
      >
        {/* Logo */}
        <Link href="/" className="inline-block mb-8">
          <Image
            className="object-contain h-40 w-auto mx-auto"
            width={250}
            height={120}
            src="/morvafit-logo-black.svg"
            alt="Morvafit Logo"
          />
        </Link>

        {status === "loading" && (
          <div className="space-y-4">
            {/* Spinning loader */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 mx-auto flex items-center justify-center"
            >
              <Loader2 className="w-16 h-16 text-rose-500" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900">Verifying your email...</h2>
            <p className="text-gray-600">Please wait while we verify your email address.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-900">Email Verified!</h2>
            <p className="text-gray-600">{message}</p>
            <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
            {/* Manual link in case redirect doesn't work */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-white font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-rose-500/25"
            >
              Go to Dashboard
              <ArrowRight size={18} />
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-4">
            {/* Error X icon */}
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Verification Failed</h2>
            <p className="text-gray-600">{message}</p>
            <div className="space-y-3 pt-4">
              {/* Link to login where users can request a new verification email */}
              <Link
                href="/login"
                className="block w-full px-6 py-3 rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-white font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-rose-500/25"
              >
                Go to Login
              </Link>
              <p className="text-sm text-gray-500">
                You can request a new verification email after logging in.
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default VerifyEmail
