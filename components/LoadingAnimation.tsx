"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface LoadingAnimationProps {
  onComplete: () => void
}

export const LoadingAnimation = ({ onComplete }: LoadingAnimationProps) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 20)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress === 100) {
      // Wait a bit before completing
      const timeout = setTimeout(() => {
        onComplete()
      }, 500)
      return () => clearTimeout(timeout)
    }
  }, [progress, onComplete])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-linear-to-br from-gray-50 via-white to-rose-50/30"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-linear-to-br from-rose-400 to-pink-400 rounded-full blur-3xl"
        />
      </div>

      {/* Logo Animation */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 20 }}
          animate={{
            scale: [0.5, 1.2, 1],
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            times: [0, 0.6, 1],
            ease: "easeOut",
          }}
          className="mb-8"
        >
          <motion.div
            animate={{
              rotate: [0, 0, 360, 360],
            }}
            transition={{
              duration: 2,
              times: [0, 0.5, 0.7, 1],
              ease: "easeInOut",
            }}
          >
            <Image
              src="/morvafit-logo.svg"
              alt="MorvaFit"
              width={200}
              height={80}
              className="object-contain"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Animated rings around logo */}
        {[1, 2, 3].map(ring => (
          <motion.div
            key={ring}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-rose-300/30"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{
              width: ring * 100 + 100,
              height: ring * 100 + 100,
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 2,
              delay: ring * 0.2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        ))}

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-64 mt-8"
        >
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-rose-500 to-pink-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-center text-sm text-gray-600 mt-4 font-medium"
          >
            {progress < 30 && "Preparing your journey..."}
            {progress >= 30 && progress < 60 && "Loading your experience..."}
            {progress >= 60 && progress < 90 && "Almost there..."}
            {progress >= 90 && "Welcome to MorvaFit! 💪"}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Hook to manage first-time loading
export const useFirstTimeLoader = () => {
  const [isFirstTime, setIsFirstTime] = useState(false)
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    // Checking if user has visited before
    const hasVisited = sessionStorage.getItem("morvafit_visited")

    if (!hasVisited) {
      setIsFirstTime(true)
      sessionStorage.setItem("morvafit_visited", "true")
    } else {
      setShowLoader(false)
    }
  }, [])

  const handleLoadingComplete = () => {
    setShowLoader(false)
  }

  return {
    shouldShowLoader: isFirstTime && showLoader,
    handleLoadingComplete,
  }
}
