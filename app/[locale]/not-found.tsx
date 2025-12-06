"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Search, Dumbbell, AlertCircle, ArrowLeft, Sparkles } from "lucide-react"
import { Link } from "@/i18n/navigation"
import Image from "next/image"

const NotFoundPage = () => {
  const [reps, setReps] = useState(0)
  const [isLifting, setIsLifting] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [foundIt, setFoundIt] = useState(false)

  const funnyMessages = [
    "This page skipped leg day... and arm day... and every day.",
    "404: Page is doing cardio somewhere. Try again later!",
    "Oops! This page is taking a protein shake break.",
    "This URL needs a personal trainer to find its way.",
    "Lost like a gym newbie on their first day.",
  ]

  const [message, setMessage] = useState(funnyMessages[0])

  useEffect(() => {
    const interval = setInterval(() => {
      setMessage(funnyMessages[Math.floor(Math.random() * funnyMessages.length)])
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const handleLift = () => {
    if (isLifting) return

    setIsLifting(true)
    setReps(prev => prev + 1)

    setTimeout(() => {
      setIsLifting(false)
    }, 600)

    // Easter egg: after 10 reps
    if (reps + 1 === 10) {
      setShowConfetti(true)
      setTimeout(() => {
        setFoundIt(true)
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-rose-50/30 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-linear-to-br from-rose-400 to-pink-400 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            opacity: [0.03, 0.05, 0.03],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-linear-to-tr from-pink-400 to-rose-400 rounded-full blur-3xl"
        />

        {/* Confetti effect */}
        <AnimatePresence>
          {showConfetti && (
            <>
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{
                    x: "50vw",
                    y: "50vh",
                    scale: 0,
                    rotate: 0,
                  }}
                  animate={{
                    x: `${Math.random() * 100}vw`,
                    y: `${Math.random() * 100}vh`,
                    scale: [0, 1, 0.5],
                    rotate: Math.random() * 360,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 2,
                    ease: "easeOut",
                    delay: i * 0.02,
                  }}
                  className={`absolute w-3 h-3 rounded-full ${
                    i % 3 === 0 ? "bg-rose-500" : i % 3 === 1 ? "bg-pink-500" : "bg-yellow-500"
                  }`}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-block">
            <Image
              className="object-contain h-40 w-auto mx-auto"
              width={250}
              height={160}
              src="/morvafit-logo.svg"
              alt="Morvafit Logo"
            />
          </Link>
        </motion.div>

        {!foundIt ? (
          <>
            {/* Main 404 Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <div className="relative inline-block">
                {/* 404 Number with Dumbbell */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <motion.span
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-9xl md:text-[12rem] font-black bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent"
                  >
                    4
                  </motion.span>

                  {/* Interactive Dumbbell */}
                  <motion.div
                    animate={{
                      y: isLifting ? -30 : 0,
                      rotate: isLifting ? [0, -10, 10, 0] : 0,
                    }}
                    transition={{ duration: 0.6 }}
                    className="cursor-pointer select-none"
                    onClick={handleLift}
                  >
                    <Dumbbell
                      size={120}
                      className="text-gray-400 hover:text-rose-500 transition-colors"
                      strokeWidth={2}
                    />
                  </motion.div>

                  <motion.span
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-9xl md:text-[12rem] font-black bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent"
                  >
                    4
                  </motion.span>
                </div>

                {/* Rep Counter */}
                <AnimatePresence mode="wait">
                  {reps > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm font-semibold text-rose-600"
                    >
                      {reps} rep{reps !== 1 ? "s" : ""} completed! 💪
                      {reps >= 5 && reps < 10 && " Keep going!"}
                      {reps >= 10 && " BEAST MODE! 🔥"}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Animated Message */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-16"
              >
                <AnimatePresence mode="wait">
                  <motion.p
                    key={message}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl md:text-3xl font-bold text-gray-800 mb-4"
                  >
                    Page Not Found
                  </motion.p>
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  <motion.p
                    key={message}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-lg text-gray-600 max-w-2xl mx-auto"
                  >
                    {message}
                  </motion.p>
                </AnimatePresence>
              </motion.div>

              {/* Hint for Easter Egg */}
              {reps > 0 && reps < 10 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-gray-500 mt-6 italic"
                >
                  💡 Psst... try lifting that dumbbell 10 times
                </motion.p>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-white font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-rose-500/25"
                >
                  <Home size={20} />
                  Back to Home
                </motion.button>
              </Link>

              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:border-rose-300 hover:bg-rose-50 transition-all duration-300"
                >
                  <Search size={20} />
                  Search Site
                </motion.button>
              </Link>
            </motion.div>

            {/* Fun Facts */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-16 text-center"
            >
              <div className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/50 backdrop-blur-sm border border-gray-200">
                <AlertCircle size={18} className="text-rose-500" />
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Fun fact:</span> You've burned approximately 0.001
                  calories finding this page 🔥
                </p>
              </div>
            </motion.div>
          </>
        ) : (
          /* Easter Egg Success State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{
                rotate: [0, -10, 10, -10, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              <Sparkles size={80} className="text-yellow-500 mx-auto mb-6" />
            </motion.div>

            <h1 className="text-5xl md:text-6xl font-black bg-linear-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent mb-4">
              You Found It!
            </h1>

            <p className="text-2xl text-gray-800 font-bold mb-4">Congratulations, Champion! 🏆</p>

            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              You completed 10 reps and discovered the secret! Unfortunately, the page you're
              looking for is still lost... but your determination is LEGENDARY! 💪✨
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-8 py-4 rounded-full bg-linear-to-r from-rose-500 to-pink-500 text-white font-semibold hover:from-rose-600 hover:to-pink-600 transition-all duration-300 shadow-lg shadow-rose-500/25"
                >
                  <Home size={20} />
                  Claim Your Victory at Home
                </motion.button>
              </Link>

              <motion.button
                onClick={() => {
                  setFoundIt(false)
                  setReps(0)
                  setShowConfetti(false)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-8 py-4 rounded-full border-2 border-gray-300 text-gray-700 font-semibold hover:border-rose-300 hover:bg-rose-50 transition-all duration-300"
              >
                <ArrowLeft size={20} />
                Try Again
              </motion.button>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-12 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-linear-to-r from-rose-100 to-pink-100 border border-rose-200"
            >
              <span className="text-2xl">🎉</span>
              <p className="text-sm text-gray-700 font-medium">
                Achievement Unlocked:{" "}
                <span className="font-bold text-rose-600">404 Fitness Master</span>
              </p>
              <span className="text-2xl">🎉</span>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default NotFoundPage
