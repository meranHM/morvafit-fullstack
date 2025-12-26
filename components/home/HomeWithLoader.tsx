"use client"

import { useFirstTimeLoader, LoadingAnimation } from "../LoadingAnimation"
import { AnimatePresence, motion } from "framer-motion"

const HomeWithLoader = ({ children }: { children: React.ReactNode }) => {
  const { shouldShowLoader, isChecking, handleLoadingComplete } = useFirstTimeLoader()

  // Don't render content until we've checked sessionStorage
  if (isChecking) {
    return <div className="fixed inset-0 z-100 bg-linear-to-br from-gray-50 via-white to-rose-50" />
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {shouldShowLoader && <LoadingAnimation onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      <motion.div
        initial={shouldShowLoader ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: shouldShowLoader ? 0.3 : 0 }}
      >
        {children}
      </motion.div>
    </>
  )
}

export default HomeWithLoader
