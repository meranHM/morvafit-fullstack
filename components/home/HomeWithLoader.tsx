import { useFirstTimeLoader, LoadingAnimation } from "../LoadingAnimation"
import { AnimatePresence, motion } from "framer-motion"

const HomeWithLoader = ({ children }: { children: React.ReactNode }) => {
  const { shouldShowLoader, handleLoadingComplete } = useFirstTimeLoader()

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
