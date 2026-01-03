"use client"

import { useState } from "react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Upload, Check, Download, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Receipt = {
  id: string
  imageUrl: string
  amount: number
  status: string
  createdAt: string
}

interface PaymentTabProps {
  receitps: Receipt[]
  emailVerified: boolean
}

const PaymentTab: React.FC<PaymentTabProps> = ({ receitps, emailVerified }) => {
  const [file, setFile] = useState<File | null>(null)
  const [amount, setAmount] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { data, mutate } = useSWR("/api/user/receipts", fetcher, {
    fallbackData: {
      data: receitps,
    },
  })

  // HANDLE FILE SELECTION
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadError(null)
      setSuccess(null)
    }
  }

  const handleUploadReceipt = async (): Promise<void> => {
    setUploadError(null)
    setSuccess(null)

    // Users must verify their email before uploading receipts
    if (!emailVerified) {
      setUploadError("Please verify your email before submitting a payment receipt.")
      return
    }

    if (!file) {
      setUploadError("Please select a receipt file first.")
      return
    }

    if (!amount || Number(amount) <= 0) {
      setUploadError("Please enter a valid payment amount.")
      return
    }

    try {
      setUploading(true)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("amount", amount)

      const res = await fetch("/api/user/receipts", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setFile(null)
      setAmount("")
      setSuccess("Receipt uploaded successfully! Waiting for admin approval.")

      // Refetching receipts from database to update the Payment History
      mutate()

      const fileInput = document.getElementById("receipt-upload") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setUploading(false)
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Payments</h2>
            <p className="text-gray-600 mt-1">Manage your payment history and upload receipts</p>
          </div>

          {/* Upload Receipt */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Payment Receipt</h3>

            {/* Show warning if email is not verified */}
            {!emailVerified && (
              <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Email verification required</p>
                  <p>
                    Please verify your email address before uploading receipts. Check your inbox for
                    the verification link or go to your Account settings to resend it.
                  </p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {uploadError && (
              <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                {uploadError}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm flex items-center gap-2">
                <Check size={18} />
                {success}
              </div>
            )}

            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount (Tomans)
              </label>
              <input
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Enter amount (e.g., 1500000)"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                disabled={uploading}
              />
            </div>

            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-rose-400 transition-colors mb-4">
              <label className="cursor-pointer">
                <input
                  id="receipt-upload"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
                    <Upload className="text-rose-600" size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      {file ? file.name : "Click to select receipt"}
                    </p>
                    <p className="text-sm text-gray-600">PNG, JPG or PDF (max. 5MB)</p>
                  </div>
                </div>
              </label>
            </div>

            {/* Upload Button */}
            {/* Disabled if: uploading, no file, no amount, OR email not verified */}
            <button
              onClick={handleUploadReceipt}
              disabled={uploading || !file || !amount || !emailVerified}
              className="w-full px-6 py-3 rounded-xl bg-linear-to-r from-rose-500 to-pink-500 text-white font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={20} />
                  Upload Receipt
                </>
              )}
            </button>
          </div>

          {/* Payment History */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Payment History</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {(data?.data ?? receitps).map((payment: Receipt) => (
                <div key={payment.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                        <Check className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{payment.amount}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium capitalize">
                        {payment.status}
                      </span>
                      <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                        <Download size={16} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default PaymentTab
